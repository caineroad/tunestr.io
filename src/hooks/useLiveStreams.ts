import { DAY, N94_LIVE_STREAM, StreamState, WHITELIST } from '@/const'
import { canPlayEvent, findTag, getHost, getTagValues } from '@/utils'
import { unixNow, NostrPrefix } from '@snort/shared'
import { EventKind, type NostrEvent, NostrLink, RequestBuilder, type TaggedNostrEvent } from '@snort/system'
import { SnortContext, useRequestBuilder } from '@snort/system-react'
import { useContext, useMemo } from 'react'

export interface SortedStreamsOptions {
  /**
   * Tag values that should bypass the WHITELIST host check. Any event whose
   * `t` tags include at least one of these values is allowed through even if
   * the host isn't whitelisted. Useful for surfacing topical streams (e.g.
   * music) from non-whitelisted authors on dedicated pages.
   */
  allowTags?: string[]
}

export function useSortedStreams(feed: Array<TaggedNostrEvent>, oldest?: number, options?: SortedStreamsOptions) {
  function sortCreatedAt(a: NostrEvent, b: NostrEvent) {
    return b.created_at > a.created_at ? 1 : -1
  }

  function sortStarts(a: NostrEvent, b: NostrEvent) {
    const aStart = Number(findTag(a, 'starts') ?? '0')
    const bStart = Number(findTag(b, 'starts') ?? '0')
    return bStart > aStart ? 1 : -1
  }

  const allowTagsKey = options?.allowTags?.join(',')
  const feedSorted = useMemo(() => {
    const allowTags = allowTagsKey ? allowTagsKey.split(',').filter(Boolean) : []
    const isAllowedByTag = (a: NostrEvent) =>
      allowTags.length > 0 && getTagValues(a.tags, 't').some(t => allowTags.includes(t))
    if (feed) {
      return feed
        .filter(a => a.created_at > (oldest ?? unixNow() - 7 * DAY))
        .filter(a => canPlayEvent(a))
        .filter(a => !WHITELIST || WHITELIST.includes(getHost(a)) || isAllowedByTag(a))
    }
    return []
  }, [feed, allowTagsKey])

  const live = feedSorted
    .filter(a => {
      try {
        return findTag(a, 'status') === StreamState.Live || a.kind === N94_LIVE_STREAM
      } catch {
        return false
      }
    })
    .sort(sortStarts)

  // Load deletion requests for live events to clear cache relay
  const system = useContext(SnortContext)
  if (system.config.cachingRelay) {
    const rbDeletes = new RequestBuilder('stream-deletes')
    const links = useMemo(() => live.map(a => NostrLink.fromEvent(a)), [live])
    const aDeletes = links.filter(a => a.type === NostrPrefix.Address)
    if (aDeletes.length > 0) {
      rbDeletes.withFilter().replyToLink(aDeletes).kinds([EventKind.Deletion])
    }
    const eDeletes = links.filter(a => a.type === NostrPrefix.Event)
    if (eDeletes.length > 0) {
      rbDeletes.withFilter().replyToLink(eDeletes).kinds([EventKind.Deletion])
    }
    useRequestBuilder(rbDeletes)
  }

  const planned = feedSorted.filter(a => findTag(a, 'status') === StreamState.Planned).sort(sortStarts)
  const ended = feedSorted
    .filter(a => {
      const hasEnded = findTag(a, 'status') === StreamState.Ended
      const recording = findTag(a, 'recording') ?? ''
      return hasEnded && recording?.length > 0
    })
    .sort(sortCreatedAt)
  return { live, planned, ended }
}
