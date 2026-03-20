import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { EventKind, type NostrLink, NostrLink as NL, RequestBuilder, type TaggedNostrEvent, tryParseNostrLink } from "@snort/system";
import { useRequestBuilder, useEventFeed } from "@snort/system-react";
import { NostrPrefix } from "@snort/shared";
import { Profile } from "@/element/profile";
import { Text } from "@/element/text";
import EventReactions from "@/element/event-reactions";
import { Link } from "react-router";
import { Icon } from "@/element/icon";

const TUNESTR_PUBKEY = "b9d02cb8fddeb191701ec0648e37ed1f6afba263e0060fc06099a62851d25e04";

const MediaExtensions: Record<string, "image" | "video"> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  svg: "image",
  mp4: "video",
  mov: "video",
  webm: "video",
  mkv: "video",
  avi: "video",
  m4v: "video",
};

function isMediaUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const ext = pathname.split(".").pop() ?? "";
    return ext in MediaExtensions;
  } catch {
    return false;
  }
}

function extractMediaUrls(content: string): string[] {
  const urlRegex = /https?:\/\/\S+/gi;
  const matches = content.match(urlRegex) ?? [];
  return matches.filter(isMediaUrl);
}

function stripMediaUrls(content: string): string {
  return content.replace(/https?:\/\/\S+/gi, (match) => (isMediaUrl(match) ? "" : match)).trim();
}

function formatTimestamp(unixSeconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - unixSeconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(unixSeconds * 1000).toLocaleDateString();
}

const nostrEventRegex = /nostr:(note1[a-z0-9]+|nevent1[a-z0-9]+|naddr1[a-z0-9]+)/g;

function isEventLink(link: NostrLink): boolean {
  return link.type === NostrPrefix.Event || link.type === NostrPrefix.Note || link.type === NostrPrefix.Address;
}

function extractQuotedLinks(content: string): NostrLink[] {
  const matches = content.match(nostrEventRegex) ?? [];
  const links: NostrLink[] = [];
  for (const m of matches) {
    const link = tryParseNostrLink(m);
    if (link && isEventLink(link)) links.push(link);
  }
  return links;
}

function stripQuotedLinks(content: string): string {
  return content.replace(nostrEventRegex, "").trim();
}

function QuotedPost({ link }: { link: NostrLink }) {
  const ev = useEventFeed(link);
  if (!ev) {
    return (
      <div className="bg-layer-2 rounded-xl border border-layer-3 p-3 sm:p-4 text-layer-4 text-sm">
        <FormattedMessage defaultMessage="loading quoted post..." />
      </div>
    );
  }

  const mediaUrls = extractMediaUrls(ev.content);
  const text = stripMediaUrls(ev.content);

  return (
    <Link
      to={`/${NL.fromEvent(ev).encode()}`}
      className="block bg-layer-2 rounded-xl border border-layer-3 hover:border-primary/30 transition-colors p-3 sm:p-4 flex flex-col gap-2 overflow-hidden min-w-0"
    >
      <div className="flex items-center gap-2">
        <Profile pubkey={ev.pubkey} avatarSize={24} linkToProfile={false} />
        <span className="text-layer-4 text-xs shrink-0">{formatTimestamp(ev.created_at)}</span>
      </div>
      {text && (
        <Text tags={ev.tags} content={text} className="whitespace-pre-line break-words overflow-hidden leading-relaxed text-sm line-clamp-6" />
      )}
      {mediaUrls.length > 0 && (
        <MediaGallery urls={mediaUrls.slice(0, 2)} />
      )}
    </Link>
  );
}

function MediaGallery({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;
  return (
    <div className={`grid gap-2 min-w-0 ${urls.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
      {urls.map((url) => {
        const ext = new URL(url).pathname.toLowerCase().split(".").pop() ?? "";
        const type = MediaExtensions[ext];
        if (type === "video") {
          return (
            <video
              key={url}
              src={url}
              controls
              preload="metadata"
              className="w-full max-w-full rounded-lg max-h-[300px] sm:max-h-[500px] object-cover bg-black"
            />
          );
        }
        return (
          <img
            key={url}
            src={url}
            alt=""
            loading="lazy"
            className="w-full max-w-full rounded-lg max-h-[300px] sm:max-h-[500px] object-cover bg-black"
          />
        );
      })}
    </div>
  );
}

function SocialNote({ ev }: { ev: TaggedNostrEvent }) {
  const mediaUrls = useMemo(() => extractMediaUrls(ev.content), [ev.content]);
  const quotedLinks = useMemo(() => extractQuotedLinks(ev.content), [ev.content]);
  const strippedContent = useMemo(() => {
    let content = stripMediaUrls(ev.content);
    content = stripQuotedLinks(content);
    return content;
  }, [ev.content]);

  return (
    <div className="bg-layer-1 rounded-2xl border border-layer-2 p-3 sm:p-5 flex flex-col gap-3 overflow-hidden min-w-0">
      <div className="flex justify-between items-center gap-2">
        <div className="min-w-0 truncate">
          <Profile pubkey={ev.pubkey} avatarSize={36} />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-layer-4 text-xs sm:text-sm shrink-0">
          <span className="whitespace-nowrap">{formatTimestamp(ev.created_at)}</span>
          <Link to={`/${NL.fromEvent(ev).encode()}`}>
            <Icon name="link" size={16} />
          </Link>
        </div>
      </div>
      {strippedContent && (
        <Text tags={ev.tags} content={strippedContent} className="whitespace-pre-line break-words overflow-hidden leading-relaxed text-sm sm:text-base" />
      )}
      <MediaGallery urls={mediaUrls} />
      {quotedLinks.map((link) => (
        <QuotedPost key={link.encode()} link={link} />
      ))}
      <EventReactions ev={ev} />
    </div>
  );
}

export default function SocialPage() {
  const sub = useMemo(() => {
    const rb = new RequestBuilder("tunestr-social");
    rb.withFilter().kinds([EventKind.TextNote]).authors([TUNESTR_PUBKEY]).limit(50);
    return rb;
  }, []);

  const events = useRequestBuilder(sub);
  const sorted = useMemo(
    () => [...events].sort((a, b) => b.created_at - a.created_at),
    [events],
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-8 min-w-0 overflow-hidden">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
          <FormattedMessage defaultMessage="tunestr social" />
        </h1>
        <p className="text-base sm:text-xl text-layer-5 max-w-2xl mx-auto leading-relaxed">
          <FormattedMessage defaultMessage="latest updates from the tunestr team on nostr." />
        </p>
      </div>

      {sorted.length === 0 && (
        <div className="bg-layer-1 rounded-2xl border border-layer-2 p-8 text-center">
          <Icon name="loading" size={40} className="text-layer-4 mx-auto mb-4 animate-spin" />
          <p className="text-layer-5">
            <FormattedMessage defaultMessage="loading notes..." />
          </p>
        </div>
      )}

      {sorted.map((ev) => (
        <SocialNote key={ev.id} ev={ev} />
      ))}
    </div>
  );
}
