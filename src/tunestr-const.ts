import { parseNostrLink } from "@snort/system";

export const TUNESTR_NPUB = "npub1h8gzew8am6cezuq7cpjgudldra40hgnruqrqlsrqnxnzs5wjtczqztps02";
export const TUNESTR_ID = parseNostrLink(TUNESTR_NPUB).id;