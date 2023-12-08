import { useMemo } from "react";
import { NostrLink, NostrPrefix, ReplaceableNoteStore, RequestBuilder } from "@snort/system";
import { useRequestBuilder } from "@snort/system-react";

export default function useEventFeed(link: NostrLink, leaveOpen = false) {
  const sub = useMemo(() => {
    const b = new RequestBuilder(`event:${link.id.slice(0, 12)}`);
    b.withOptions({
      leaveOpen,
    });
    if (link.type === NostrPrefix.Address) {
      const f = b.withFilter().tag("d", [link.id]);
      if (link.author) {
        f.authors([link.author]);
      }
      if (link.kind) {
        f.kinds([link.kind]);
      }
    } else {
      const f = b.withFilter().ids([link.id]);
      if (link.relays) {
        link.relays.slice(0, 2).forEach(r => f.relay(r));
      }
      if (link.author) {
        f.authors([link.author]);
      }
    }
    return b;
  }, [link, leaveOpen]);

  return useRequestBuilder(ReplaceableNoteStore, sub);
}
