import { NostrEvent, NostrLink, TaggedNostrEvent } from "@snort/system";

import type { Tags } from "@/types";
import { LIVE_STREAM } from "@/const";
import { StreamState } from ".";

export function toAddress(e: NostrEvent): string {
  if (e.kind && e.kind >= 30000 && e.kind <= 40000) {
    const dTag = findTag(e, "d");

    return `${e.kind}:${e.pubkey}:${dTag}`;
  }

  if (e.kind === 0 || e.kind === 3) {
    return e.pubkey;
  }

  return e.id;
}

export function findTag(e: NostrEvent | undefined, tag: string) {
  const maybeTag = e?.tags.find(evTag => {
    return evTag[0] === tag;
  });
  return maybeTag && maybeTag[1];
}

export function splitByUrl(str: string) {
  const urlRegex =
    /((?:http|ftp|https|nostr|web\+nostr|magnet):\/?\/?(?:[\w+?.\w+])+(?:[a-zA-Z0-9~!@#$%^&*()_\-=+\\/?.:;',]*)?(?:[-A-Za-z0-9+&@#/%=~()_|]))/i;

  return str.split(urlRegex);
}

export function eventLink(ev: NostrEvent | TaggedNostrEvent) {
  return NostrLink.fromEvent(ev).encode();
}

export function getHost(ev?: NostrEvent) {
  return ev?.tags.find(a => a[0] === "p" && a[3] === "host")?.[1] ?? ev?.pubkey ?? "";
}

export function openFile(): Promise<File | undefined> {
  return new Promise(resolve => {
    const elm = document.createElement("input");
    elm.type = "file";
    elm.onchange = (e: Event) => {
      const elm = e.target as HTMLInputElement;
      if (elm.files) {
        resolve(elm.files[0]);
      } else {
        resolve(undefined);
      }
    };
    elm.click();
  });
}

export function getTagValues(tags: Tags, tag: string): Array<string> {
  return tags
    .filter(t => t.at(0) === tag)
    .map(t => t.at(1))
    .filter(t => t)
    .map(t => t as string);
}

export function getEventFromLocationState(state: unknown | undefined | null) {
  return state && typeof state === "object" && "kind" in state && state.kind === LIVE_STREAM
    ? (state as NostrEvent)
    : undefined;
}

export function uniqBy<T>(vals: Array<T>, key: (x: T) => string) {
  return Object.values(
    vals.reduce((acc, v) => {
      const k = key(v);
      acc[k] ??= v;
      return acc;
    }, {} as Record<string, T>)
  );
}

export function getPlaceholder(id: string) {
  return `https://robohash.v0l.io/${id}.png`;
}

interface StreamInfo {
  id?: string;
  title?: string;
  summary?: string;
  image?: string;
  status?: string;
  stream?: string;
  recording?: string;
  contentWarning?: string;
  tags?: Array<string>;
  goal?: string;
  participants?: string;
  starts?: string;
  ends?: string;
  service?: string;
}

export function extractStreamInfo(ev?: NostrEvent) {
  const ret = {} as StreamInfo;
  const matchTag = (tag: Array<string>, k: string, into: (v: string) => void) => {
    if (tag[0] === k) {
      into(tag[1]);
    }
  };

  for (const t of ev?.tags ?? []) {
    matchTag(t, "d", v => (ret.id = v));
    matchTag(t, "title", v => (ret.title = v));
    matchTag(t, "summary", v => (ret.summary = v));
    matchTag(t, "image", v => (ret.image = v));
    matchTag(t, "status", v => (ret.status = v));
    matchTag(t, "streaming", v => (ret.stream = v));
    matchTag(t, "recording", v => (ret.recording = v));
    matchTag(t, "content-warning", v => (ret.contentWarning = v));
    matchTag(t, "current_participants", v => (ret.participants = v));
    matchTag(t, "goal", v => (ret.goal = v));
    matchTag(t, "starts", v => (ret.starts = v));
    matchTag(t, "ends", v => (ret.ends = v));
    matchTag(t, "service", v => (ret.service = v));
  }
  ret.tags = ev?.tags.filter(a => a[0] === "t").map(a => a[1]) ?? [];

  return ret;
}
