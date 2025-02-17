import { NostrEvent } from "@snort/system";
import { GameInfo } from "../game-database";
import { Nip94Tags, readNip94Tags, readNip94TagsFromIMeta } from "../upload";
import { getHost, sortStreamTags, extractGameTag, findTag } from "@/utils";

export interface MediaPayload {
  url: string;
  dimensions?: [number, number];
  mimeType?: string;
  hash?: string;
  alternatives: Array<string>;
}

export class VideoInfo {
  title?: string;
  summary?: string;
  contentWarning?: string;
  goal?: string;
  gameId?: string;
  gameInfo?: GameInfo;
  publishedAt?: number;

  get duration() {
    return this.media.find(m => m.duration)?.duration;
  }

  constructor(
    readonly host: string,
    readonly id: string,
    readonly tags: Array<string>,
    readonly media: Array<Nip94Tags>,
  ) {}

  static parse(ev: NostrEvent) {
    const { regularTags, prefixedTags } = sortStreamTags(ev.tags);
    const ret = new VideoInfo(getHost(ev), findTag(ev, "d") ?? ev.id, regularTags, VideoInfo.#parseMediaTags(ev.tags));

    ret.title = findTag(ev, "title");
    ret.summary = findTag(ev, "summary") ?? ev.content;
    ret.contentWarning = findTag(ev, "content-warning");
    ret.goal = findTag(ev, "goal");
    ret.publishedAt = Number(findTag(ev, "published_at") ?? ev.created_at);

    const { gameInfo, gameId } = extractGameTag(prefixedTags);
    ret.gameId = gameId;
    ret.gameInfo = gameInfo;

    return ret;
  }

  static #parseMediaTags(tags: Array<Array<string>>) {
    // parse imeta
    const iMetaTags = tags.filter(a => a[0] === "imeta") ?? [];
    if (iMetaTags.length > 0) {
      return iMetaTags.map(a => readNip94TagsFromIMeta(a));
    } else {
      const meta = readNip94Tags(tags);
      meta.url ??= tags.find(a => a[0] === "url")?.[1];
      return [meta];
    }
  }

  /**
   * Get mapped sources
   */
  sources(): Array<MediaPayload> {
    return this.media
      .filter(a => a.url)
      .sort((a, b) => {
        const aSize = a.dimensions ? a.dimensions[0] * a.dimensions[1] : 0;
        const bSize = b.dimensions ? b.dimensions[0] * b.dimensions[1] : 0;
        return aSize > bSize ? -1 : 1;
      })
      .map(
        a =>
          ({
            url: a.url,
            dimensions: a.dimensions,
            mimeType: a.mimeType,
            hash: a.hash,
            alternatives: a.fallback ?? [],
          }) as MediaPayload,
      );
  }

  // Pick best video
  bestVideo(): MediaPayload | undefined {
    return this.sources().at(0);
  }

  /**
   * Pick highest resolution image
   */
  bestPoster(): MediaPayload | undefined {
    const best = this.media
      .filter(a => (a.image?.length ?? 0) > 0)
      .sort((a, b) => {
        const aSize = a.dimensions![0] * a.dimensions![1];
        const bSize = b.dimensions![0] * b.dimensions![1];
        return aSize > bSize ? -1 : 1;
      })
      .at(0);
    const first = best?.image?.at(0);
    if (first) {
      return {
        url: first,
        alternatives: best?.image?.filter(a => a != first) ?? [],
      };
    }
  }
}
