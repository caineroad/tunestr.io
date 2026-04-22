import { useCallback, useEffect, useRef, useState } from 'react'
import { type AccountResponse, type NostrStreamProvider, ProviderError } from '@/providers/zsz'

export interface UseProviderInfoOptions {
  /**
   * If true, the hook does nothing (no fetch, no polling). Useful when the
   * caller doesn't need provider info in some render branches (e.g. manual
   * streams the user signed themselves).
   */
  skip?: boolean
  /**
   * Polling interval in ms. Pass 0 or undefined to fetch only once.
   */
  pollingMs?: number
}

export interface UseProviderInfoResult {
  /** Latest successful account response, or undefined while loading / on error. */
  info: AccountResponse | undefined
  /** Most recent error, or undefined if the last call succeeded. */
  error: ProviderError | undefined
  /** True while the first fetch is in flight. */
  loading: boolean
  /** Manually re-trigger the fetch. */
  retry: () => Promise<void>
}

/**
 * Wraps NostrStreamProvider.info() with state, polling, and error capture.
 *
 * Replaces the brittle `provider.info().then(setInfo)` pattern that left
 * uncaught promise rejections and a permanently-undefined info state when
 * the provider was unreachable.
 */
export function useProviderInfo(
  provider: NostrStreamProvider,
  options?: UseProviderInfoOptions,
): UseProviderInfoResult {
  const { skip, pollingMs } = options ?? {}
  const [info, setInfo] = useState<AccountResponse>()
  const [error, setError] = useState<ProviderError>()
  const [loading, setLoading] = useState(!skip)
  const cancelledRef = useRef(false)

  const fetchInfo = useCallback(async () => {
    if (skip) return
    try {
      const result = await provider.info()
      if (cancelledRef.current) return
      setInfo(result)
      setError(undefined)
    } catch (e) {
      if (cancelledRef.current) return
      const err =
        e instanceof ProviderError
          ? e
          : new ProviderError((e as Error)?.message ?? 'Unknown error', 'network', provider.url)
      console.warn(`useProviderInfo: ${err.kind} from ${err.providerUrl}: ${err.message}`)
      setError(err)
    } finally {
      if (!cancelledRef.current) setLoading(false)
    }
  }, [provider, skip])

  useEffect(() => {
    cancelledRef.current = false
    if (skip) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetchInfo()
    if (pollingMs && pollingMs > 0) {
      const t = setInterval(() => {
        fetchInfo()
      }, pollingMs)
      return () => {
        cancelledRef.current = true
        clearInterval(t)
      }
    }
    return () => {
      cancelledRef.current = true
    }
  }, [fetchInfo, pollingMs, skip])

  return { info, error, loading, retry: fetchInfo }
}
