import { useMemo } from 'react'
import { RequestBuilder } from '@snort/system'
import { useRequestBuilder } from '@snort/system-react'
import { LIVE_STREAM_KINDS, WHITELIST } from '@/const'

export interface StreamsFeedOptions {
  /**
   * Additional tag to pull streams for from ANY author, bypassing the whitelist.
   * Results are OR'd with the whitelist filters at the relay query level and
   * deduped by event ID in @snort/system.
   */
  includeTagFromAnyone?: string
}

export function useStreamsFeed(tag?: string, options?: StreamsFeedOptions) {
  const alsoTag = options?.includeTagFromAnyone
  const rb = useMemo(() => {
    const rb = new RequestBuilder(`streams${tag ? `:${tag}` : ''}${alsoTag ? `+${alsoTag}` : ''}`)
    rb.withOptions({
      leaveOpen: true,
    })
    if (WHITELIST) {
      if (tag) {
        rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('t', [tag]).authors(WHITELIST)
        rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('t', [tag]).tag('p', WHITELIST)
      } else {
        rb.withFilter().kinds(LIVE_STREAM_KINDS).authors(WHITELIST)
        rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('p', WHITELIST)
      }
    } else {
      if (tag) {
        rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('t', [tag])
      } else {
        rb.withFilter().kinds(LIVE_STREAM_KINDS)
      }
    }
    if (alsoTag) {
      rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('t', [alsoTag])
    }
    return rb
  }, [tag, alsoTag])

  return useRequestBuilder(rb)
}
