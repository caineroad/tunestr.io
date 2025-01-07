import { NostrLink, TaggedNostrEvent } from "@snort/system";

import { ExternalIconLink } from "./external-link";
import { Profile } from "./profile";
import EventReactions from "./event-reactions";
import { Text } from "@/element/text";

export function Note({ ev }: { ev: TaggedNostrEvent }) {
  return (
    <div className="bg-layer-2 rounded-xl px-4 py-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Profile pubkey={ev.pubkey} avatarSize={30} />
        <ExternalIconLink size={24} href={`https://snort.social/${NostrLink.fromEvent(ev).encode()}`} />
      </div>
      <Text tags={ev.tags} content={ev.content} className="whitespace-pre-line overflow-wrap" />
      <EventReactions ev={ev} />
    </div>
  );
}
