import "./new-stream.css";
import * as Dialog from "@radix-ui/react-dialog";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { unwrap } from "@snort/shared";
import { FormattedMessage } from "react-intl";
import { SnortContext } from "@snort/system-react";

import { Icon } from "./icon";
import { useStreamProvider } from "@/hooks/stream-provider";
import { NostrStreamProvider, StreamProvider, StreamProviders } from "@/providers";
import { StreamEditor, StreamEditorProps } from "./stream-editor";
import { eventLink, findTag } from "@/utils";
import { NostrProviderDialog } from "./nostr-provider-dialog";

function NewStream({ ev, onFinish }: Omit<StreamEditorProps, "onFinish"> & { onFinish: () => void }) {
  const system = useContext(SnortContext);
  const providers = useStreamProvider();
  const [currentProvider, setCurrentProvider] = useState<StreamProvider>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentProvider) {
      setCurrentProvider(
        ev !== undefined ? unwrap(providers.find(a => a.name.toLowerCase() === "manual")) : providers.at(0)
      );
    }
  }, [providers, currentProvider]);

  function providerDialog() {
    if (!currentProvider) return;

    switch (currentProvider.type) {
      case StreamProviders.Manual: {
        return (
          <StreamEditor
            onFinish={ex => {
              currentProvider.updateStreamInfo(system, ex);
              if (!ev) {
                if (findTag(ex, "content-warning") && __XXX_HOST && __XXX === false) {
                  location.href = `${__XXX_HOST}/${eventLink(ex)}`;
                } else {
                  navigate(`/${eventLink(ex)}`, {
                    state: ex,
                  });
                  onFinish?.();
                }
              } else {
                onFinish?.();
              }
            }}
            ev={ev}
          />
        );
      }
      case StreamProviders.NostrType: {
        return (
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                navigate("/settings");
                onFinish?.();
              }}>
              <FormattedMessage defaultMessage="Get stream key" id="KdYELp" />
            </button>
            <NostrProviderDialog
              provider={currentProvider as NostrStreamProvider}
              onFinish={onFinish}
              ev={ev}
              showEndpoints={false}
              showEditor={true}
              showForwards={false}
            />
          </>
        );
      }
      case StreamProviders.Owncast: {
        return;
      }
    }
  }

  return (
    <>
      <p>
        <FormattedMessage defaultMessage="Stream Providers" id="6Z2pvJ" />
      </p>
      <div className="flex gap-2">
        {providers.map(v => (
          <span className={`pill${v === currentProvider ? " active" : ""}`} onClick={() => setCurrentProvider(v)}>
            {v.name}
          </span>
        ))}
      </div>
      {providerDialog()}
    </>
  );
}

interface NewStreamDialogProps {
  text?: string;
  btnClassName?: string;
}

export function NewStreamDialog(props: NewStreamDialogProps & StreamEditorProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className={props.btnClassName}>
          {props.text && props.text}
          {!props.text && (
            <>
              <span className="hide-on-mobile">
                <FormattedMessage defaultMessage="Stream" id="uYw2LD" />
              </span>
              <Icon name="signal" />
            </>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="content-inner">
            <div className="new-stream">
              <NewStream {...props} onFinish={() => setOpen(false)} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
