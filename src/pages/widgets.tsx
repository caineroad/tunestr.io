/* eslint-disable @typescript-eslint/no-unused-vars */
import "./widgets.css";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { NostrLink, NostrPrefix } from "@snort/system";

import Copy from "@/element/copy";
import { useCurrentStreamFeed } from "@/hooks/current-stream-feed";
import { getVoices, speak, toTextToSpeechParams } from "@/text2speech";
import { useLogin } from "@/hooks/login";
import { ZapAlertItem } from "./widgets/zaps";
import { TopZappersWidget } from "./widgets/top-zappers";
import { Views } from "./widgets/views";
import { Music } from "./widgets/music";
import { hexToBech32 } from "@snort/shared";
import { DefaultButton } from "@/element/buttons";
import { groupBy } from "@/utils";

interface ZapAlertConfigurationProps {
  npub: string;
  baseUrl: string;
}

function ZapAlertConfiguration({ npub, baseUrl }: ZapAlertConfigurationProps) {
  const login = useLogin();
  const { formatMessage, formatDisplayName } = useIntl();

  const [testText, setTestText] = useState("");
  const [textToSpeech, setTextToSpeech] = useState<boolean>(false);
  const [voice, setVoice] = useState<string | null>(null);
  const [minSatsForTextToSpeech, setMinSatsForTextToSpeech] = useState<string>("21");
  const [volume, setVolume] = useState<number>(1);

  // Google propietary voices are not available on OBS browser
  const voices = getVoices().filter(v => !v.name.includes("Google"));
  const groupedVoices = useMemo(() => {
    return groupBy(voices, v => v.lang);
  }, [voices]);
  const languages = useMemo(() => {
    return Object.keys(groupedVoices).sort();
  }, [groupedVoices]);
  const selectedVoice = useMemo(() => {
    return voices.find(v => v.voiceURI === voice);
  }, [voice]);

  const isTextToSpeechSupported = "speechSynthesis" in window;
  const isTextToSpeechEnabled = voices.length > 0 && textToSpeech;

  const query = useMemo(() => {
    const params = toTextToSpeechParams({
      voiceURI: voice,
      minSats: voice ? Number(minSatsForTextToSpeech) : null,
      volume,
    });
    const queryParams = params.toString();
    return queryParams.length > 0 ? `?${queryParams}` : "";
  }, [voice, volume, minSatsForTextToSpeech]);

  function testVoice() {
    if (selectedVoice) {
      speak(selectedVoice, testText, volume);
    }
  }

  return (
    <>
      <h3>
        <FormattedMessage defaultMessage="Zap Alert" id="zVDHAu" />
      </h3>
      <Copy text={`${baseUrl}/alert/${npub}/zaps${query}`} />
      <ZapAlertItem
        item={{
          id: "",
          valid: true,
          content: testText,
          zapService: "",
          anonZap: false,
          errors: [],
          sender: login?.pubkey,
          amount: 1_000_000,
          targetEvents: [],
          created_at: 0,
        }}
      />
      <div className="text-to-speech-settings">
        <div
          className="paper"
          onClick={() => setTextToSpeech(!textToSpeech)}
          style={{ cursor: isTextToSpeechSupported ? "pointer" : "not-allowed" }}>
          <input
            disabled={!isTextToSpeechSupported}
            type="checkbox"
            checked={textToSpeech}
            onChange={ev => setTextToSpeech(ev.target.checked)}
          />
          <FormattedMessage defaultMessage="Enable text to speech" id="heyxZL" />
        </div>
        {isTextToSpeechEnabled && (
          <>
            <div className="paper labeled-input">
              <label htmlFor="minimum-sats">
                <FormattedMessage defaultMessage="Minimum amount for text to speech" id="6pr6hJ" />
              </label>
              <input
                id="minimum-sats"
                type="number"
                min="1"
                value={minSatsForTextToSpeech}
                onChange={ev => setMinSatsForTextToSpeech(ev.target.value)}
              />
            </div>
            <div className="paper labeled-input">
              <label htmlFor="volume">
                <FormattedMessage defaultMessage="Volume" id="y867Vs" />
              </label>
              <input
                id="volume"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={ev => setVolume(Number(ev.target.value))}
              />
            </div>
            <div className="paper labeled-input">
              <label htmlFor="voice-selector">
                <FormattedMessage defaultMessage="Voice" id="mnJYBQ" />
              </label>
              <select id="voice-selector" onChange={ev => setVoice(ev.target.value)}>
                <option value="">
                  <FormattedMessage defaultMessage="Select voice..." id="wMKVFz" />
                </option>
                {languages.map(l => (
                  <optgroup label={formatDisplayName(l, { type: "language" })}>
                    {groupedVoices[l].map(v => (
                      <option value={v.voiceURI}>{v.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            {voice && (
              <>
                <div className="paper labeled-input">
                  <label htmlFor="zap-alert-text">
                    <FormattedMessage defaultMessage="Zap message" id="sInm1h" />
                  </label>
                  <textarea
                    id="zap-alert-text"
                    placeholder={formatMessage({ defaultMessage: "Insert text to speak", id: "8YT6ja" })}
                    value={testText}
                    onChange={ev => setTestText(ev.target.value)}
                  />
                </div>
                <DefaultButton disabled={testText.length === 0} onClick={testVoice}>
                  <FormattedMessage defaultMessage="Test voice" id="d5zWyh" />
                </DefaultButton>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export function WidgetsPage() {
  const login = useLogin();
  const profileLink = new NostrLink(NostrPrefix.PublicKey, login?.pubkey ?? "");
  const current = useCurrentStreamFeed(profileLink);
  const currentLink = current ? NostrLink.fromEvent(current) : undefined;
  const npub = hexToBech32("npub", login?.pubkey);

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  return (
    <div className="widgets gap-2">
      <div className="flex flex-col gap-2">
        <h3>
          <FormattedMessage defaultMessage="Chat Widget" id="hpl4BP" />
        </h3>
        <Copy text={`${baseUrl}/chat/${npub}`} />
      </div>
      <div className="flex flex-col gap-2">
        <ZapAlertConfiguration npub={npub} baseUrl={baseUrl} />
      </div>
      <div className="flex flex-col gap-2">
        <h3>
          <FormattedMessage defaultMessage="Top Zappers" id="dVD/AR" />
        </h3>
        <Copy text={`${baseUrl}/alert/${npub}/top-zappers`} />
        {currentLink && <TopZappersWidget link={currentLink} />}
      </div>
      <div className="flex flex-col gap-2">
        <h3>
          <FormattedMessage defaultMessage="Current Viewers" id="rgsbu9" />
        </h3>
        <Copy text={`${baseUrl}/alert/${npub}/views`} />
        {currentLink && <Views link={currentLink} />}
      </div>
      <div className="flex flex-col gap-2">
        <h3>
          <FormattedMessage defaultMessage="Music" id="79lLl+" />
        </h3>
        <Copy text={`${baseUrl}/alert/${npub}/music`} />
        {currentLink && <Music link={currentLink} />}
      </div>
    </div>
  );
}
