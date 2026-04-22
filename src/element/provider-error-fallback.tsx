import { FormattedMessage } from 'react-intl'
import type { ProviderError } from '@/providers/zsz'
import { useStreamProvider } from '@/hooks/stream-provider'
import { DefaultButton, Layer2Button } from '@/element/buttons'

interface ProviderErrorFallbackProps {
  error: ProviderError
  onRetry?: () => void | Promise<void>
}

/**
 * Inline error block shown when a stream provider's API is unreachable.
 *
 * Surfaces the failure cause (timeout / network / HTTP / signing) and gives
 * the user two recovery actions: retry the same provider, or reset to the
 * built-in default provider (clears the localStorage override that may be
 * pinning them to a dead host).
 */
export function ProviderErrorFallback({ error, onRetry }: ProviderErrorFallbackProps) {
  const { resetToDefault, config } = useStreamProvider()
  const isDefault = config.url === 'https://api-core.zap.stream/api/v1'

  return (
    <div className="bg-layer-1 border border-warning/40 rounded-xl p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-warning">
          <FormattedMessage defaultMessage="Streaming provider unreachable" />
        </h3>
        <p className="text-layer-5 text-sm mt-1">
          {error.kind === 'timeout' && (
            <FormattedMessage
              defaultMessage="The request to {url} timed out. The provider may be down or your network is blocking it."
              values={{ url: error.providerUrl }}
            />
          )}
          {error.kind === 'network' && (
            <FormattedMessage
              defaultMessage="Couldn't reach {url}. This is usually a DNS, TLS, or connectivity problem on the provider or your network."
              values={{ url: error.providerUrl }}
            />
          )}
          {error.kind === 'http' && (
            <FormattedMessage
              defaultMessage="{url} responded with an error ({status}): {message}"
              values={{ url: error.providerUrl, status: error.status ?? 'unknown', message: error.message }}
            />
          )}
          {error.kind === 'no_signer' && (
            <FormattedMessage defaultMessage="No signer available. Please log in again." />
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {onRetry && (
          <DefaultButton onClick={() => onRetry()}>
            <FormattedMessage defaultMessage="Retry" />
          </DefaultButton>
        )}
        {!isDefault && (
          <Layer2Button onClick={() => resetToDefault()}>
            <FormattedMessage defaultMessage="Reset to default provider" />
          </Layer2Button>
        )}
      </div>
    </div>
  )
}
