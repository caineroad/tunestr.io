import { useContext, useState, type ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { EventExt, type NostrEvent } from '@snort/system'
import { SnortContext } from '@snort/system-react'
import { unixNow } from '@snort/shared'

import { StreamState } from '@/const'
import { useLogin } from '@/hooks/login'
import { DefaultButton, WarningButton } from '@/element/buttons'
import Modal from '@/element/modal'

interface EndStreamButtonProps {
  /** The kind:30311 event to mark as ended. */
  event: NostrEvent
  /** Custom label; defaults to "End Stream". */
  label?: ReactNode
  /** When true, show a confirmation dialog before publishing. Defaults to true. */
  confirm?: boolean
  /** Optional className passed through to the button. */
  className?: string
  /** Called after the ended event is signed and broadcast. */
  onEnded?: () => void
}

/**
 * Publishes a kind:30311 event with status=ended for the given stream event.
 *
 * If the original event was signed by a host (e.g. zap.stream's pubkey), this
 * creates a NEW event signed by the current logged-in user with the same
 * d-tag. Per nostr replaceable-event semantics, the (kind, pubkey, d-tag)
 * triple is unique per author, so this doesn't true-replace the host's event
 * — it lives alongside it. useCurrentStreamFeed sorts by created_at desc, so
 * the new ended event wins for this user's local dashboard view.
 */
export function EndStreamButton({ event, label, confirm = true, className, onEnded }: EndStreamButtonProps) {
  const login = useLogin()
  const system = useContext(SnortContext)
  const [open, setOpen] = useState(false)

  async function endStream() {
    const pub = login?.signer()
    if (!pub) return
    const copy = { ...event, tags: event.tags.map(t => [...t]) } as NostrEvent
    const statusTag = copy.tags.find(t => t[0] === 'status')
    if (!statusTag) return
    statusTag[1] = StreamState.Ended
    const endedTag = copy.tags.find(t => t[0] === 'ends')
    if (endedTag) {
      endedTag[1] = String(unixNow())
    } else {
      copy.tags.push(['ends', String(unixNow())])
    }
    copy.created_at = unixNow()
    copy.id = EventExt.createId(copy)
    const evPub = await pub.sign(copy)
    if (evPub) {
      await system.BroadcastEvent(evPub)
      onEnded?.()
    }
  }

  async function onClick() {
    if (confirm) {
      setOpen(true)
    } else {
      await endStream()
    }
  }

  return (
    <>
      <WarningButton className={className} onClick={onClick}>
        {label ?? <FormattedMessage defaultMessage="End Stream" />}
      </WarningButton>
      {open && (
        <Modal id="confirm-end-stream" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4 max-w-md">
            <h2>
              <FormattedMessage defaultMessage="End this stream?" />
            </h2>
            <p className="text-layer-5">
              <FormattedMessage defaultMessage="This publishes a 'stream ended' update so your dashboard can return to the setup view. If your streaming software is still pushing video, your provider may republish a new live event shortly afterwards." />
            </p>
            <div className="flex justify-end gap-2">
              <DefaultButton onClick={() => setOpen(false)}>
                <FormattedMessage defaultMessage="Cancel" />
              </DefaultButton>
              <WarningButton
                onClick={async () => {
                  await endStream()
                  setOpen(false)
                }}
              >
                <FormattedMessage defaultMessage="End Stream" />
              </WarningButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
