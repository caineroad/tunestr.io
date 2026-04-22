import { useMemo } from 'react'
import { RequestBuilder } from '@snort/system'
import { useRequestBuilder } from '@snort/system-react'
import { LIVE_STREAM_KINDS, WHITELIST } from '@/const'

export interface StreamsFeedOptions {
  /**
   * Additional tag value(s) to pull streams for from ANY author, bypassing
   * the whitelist. Pass an array to match multiple case variants (e.g.
   * ['music', 'Music', 'MUSIC']) — relay filters are case-sensitive.
   * Results are OR'd with the whitelist filters at the relay query level
   * and deduped by event ID in @snort/system.
   */
  includeTagFromAnyone?: string | string[]
}

export function useStreamsFeed(tag?: string, options?: StreamsFeedOptions) {
  const alsoTag = options?.includeTagFromAnyone
  const alsoTagKey = Array.isArray(alsoTag) ? alsoTag.join(',') : alsoTag

  const rb = useMemo(() => {
    const alsoTagValues = alsoTagKey ? alsoTagKey.split(',').filter(Boolean) : []
    const rb = new RequestBuilder(`streams${tag ? `:${tag}` : ''}${alsoTagKey ? `+${alsoTagKey}` : ''}`)
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
    if (alsoTagValues.length > 0) {
      rb.withFilter().kinds(LIVE_STREAM_KINDS).tag('t', alsoTagValues)
    }
    return rb
  }, [tag, alsoTagKey])

  return useRequestBuilder(rb)
}
