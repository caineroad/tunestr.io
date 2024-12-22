import { bech32ToHex } from "@snort/shared";
import { EventKind, RequestBuilder } from "@snort/system";
import { useRequestBuilder } from "@snort/system-react";
import { useMemo } from "react";

// Snort backend publishes rates
const SnortPubkey = "npub1sn0rtcjcf543gj4wsg7fa59s700d5ztys5ctj0g69g2x6802npjqhjjtws";

export function useRates(symbol: string, leaveOpen = true) {
  const sub = useMemo(() => {
    const rb = new RequestBuilder(`rates:${symbol}`);
    rb.withOptions({
      leaveOpen,
    });
    rb.withFilter()
      .kinds([1009 as EventKind])
      .authors([bech32ToHex(SnortPubkey)])
      .tag("d", [symbol])
      .limit(1);
    return rb;
  }, [symbol]);

  const data = useRequestBuilder(sub);

  const tag = data?.at(0)?.tags.find(a => a[0] === "d" && a[1] === symbol);
  return {
    time: data?.at(0)?.created_at,
    ask: Number(tag?.[2]),
    bid: Number(tag?.[3]),
    low: Number(tag?.[4]),
    hight: Number(tag?.[5]),
  };
}
