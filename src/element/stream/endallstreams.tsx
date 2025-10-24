import { useContext, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { EventExt, NostrEvent, RequestBuilder } from "@snort/system";
import { useRequestBuilder, SnortContext } from "@snort/system-react";
import { unixNow } from "@snort/shared";

import { LIVE_STREAM, StreamState } from "@/const";
import { useLogin } from "@/hooks/login";

export default function EndAllStreamsButton({ className }: { className?: string }) {
  const system = useContext(SnortContext);
  const login = useLogin();
  const pubkey = login?.pubkey;

  const sub = useMemo(() => {
    const b = new RequestBuilder(`end-all-streams:${pubkey ?? "none"}`);
    if (pubkey) {
      b.withFilter().authors([pubkey]).kinds([LIVE_STREAM]);
    }
    return b;
  }, [pubkey]);

  const feed = useRequestBuilder(sub);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onEndAll() {
    if (!login || !system || !pubkey) return;
    const signer = login.signer?.();
    if (!signer) {
      setError("No signer available");
      return;
    }
    setBusy(true);
    setError(undefined);

    try {
      for (const ev of feed) {
        if (ev.kind !== LIVE_STREAM) continue;
        if (ev.pubkey !== pubkey) continue;

        const copy = { ...ev } as NostrEvent;
        // Ensure status=ended
        const statusTag = copy.tags.find(t => t[0] === "status");
        if (statusTag) {
          if (statusTag[1] === StreamState.Ended) {
            // Already ended, skip
            continue;
          }
          statusTag[1] = StreamState.Ended;
        } else {
          copy.tags.push(["status", StreamState.Ended]);
        }
        // Ensure ends tag exists/updated
        const endedTag = copy.tags.find(t => t[0] === "ends");
        const now = unixNow();
        if (endedTag) {
          endedTag[1] = String(now);
        } else {
          copy.tags.push(["ends", String(now)]);
        }
        copy.created_at = now;
        copy.id = EventExt.createId(copy);
        const signed = await signer.sign(copy);
        if (signed) {
          await system.BroadcastEvent(signed);
        }
      }
    } catch (e) {
      setError((e as Error).message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      className={className ?? "bg-transparent text-sm text-layer-5 underline underline-offset-2 px-1 py-0"}
      disabled={busy || !pubkey}
      onClick={onEndAll}>
      {busy ? (
        <FormattedMessage defaultMessage="Ending..." />
      ) : (
        <FormattedMessage defaultMessage="End all streams" />
      )}
      {error && <small className="text-warning ml-2">{error}</small>}
    </button>
  );
}
