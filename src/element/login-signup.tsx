import "./login-signup.css";
import LoginHeader from "../login-start.jpg";
import LoginHeader2x from "../login-start@2x.jpg";
import LoginVault from "../login-vault.jpg";
import LoginVault2x from "../login-vault@2x.jpg";
import LoginProfile from "../login-profile.jpg";
import LoginProfile2x from "../login-profile@2x.jpg";
import LoginKey from "../login-key.jpg";
import LoginKey2x from "../login-key@2x.jpg";
import LoginWallet from "../login-wallet.jpg";
import LoginWallet2x from "../login-wallet@2x.jpg";

import { CSSProperties, useContext, useState } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { EventPublisher, UserMetadata } from "@snort/system";
import { schnorr } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/curves/abstract/utils";
import { LNURL, bech32ToHex, getPublicKey, hexToBech32 } from "@snort/shared";
import { VoidApi } from "@void-cat/api";
import { SnortContext } from "@snort/system-react";

import AsyncButton from "./async-button";
import { Login } from "@/index";
import { Icon } from "./icon";
import Copy from "./copy";
import { openFile } from "@/utils";
import { LoginType } from "@/login";
import { DefaultProvider, StreamProviderInfo } from "@/providers";
import { NostrStreamProvider } from "@/providers/zsz";

enum Stage {
  Login = 0,
  LoginInput = 1,
  Details = 2,
  LnAddress = 3,
  SaveKey = 4,
}

export function LoginSignup({ close }: { close: () => void }) {
  const system = useContext(SnortContext);
  const [error, setError] = useState("");
  const [stage, setStage] = useState(Stage.Login);
  const [username, setUsername] = useState("");
  const [lnAddress, setLnAddress] = useState("");
  const [providerInfo, setProviderInfo] = useState<StreamProviderInfo>();
  const [avatar, setAvatar] = useState("");
  const [key, setNewKey] = useState("");
  const { formatMessage } = useIntl();
  const hasNostrExtension = "nostr" in window && window.nostr;

  function doLoginNsec() {
    try {
      const hexKey = key.startsWith("nsec") ? bech32ToHex(key) : key;
      Login.loginWithPrivateKey(hexKey);
      close();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(e as string);
      }
    }
  }

  async function loginNip7() {
    try {
      const nip7 = await EventPublisher.nip7();
      if (nip7) {
        Login.loginWithPubkey(nip7.pubKey, LoginType.Nip7);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(e as string);
      }
    }
  }

  function createAccount() {
    const newKey = bytesToHex(schnorr.utils.randomPrivateKey());
    setNewKey(newKey);
    setLnAddress(`${getPublicKey(newKey)}@zap.stream`);
    setStage(Stage.Details);
  }

  function loginWithKey() {
    Login.loginWithPrivateKey(key);
    close();
  }

  async function uploadAvatar() {
    const file = await openFile();
    if (file) {
      const VoidCatHost = "https://void.cat";
      const api = new VoidApi(VoidCatHost);
      const uploader = api.getUploader(file);
      const result = await uploader.upload({
        "V-Strip-Metadata": "true",
      });
      if (result.ok) {
        const resultUrl = result.file?.metadata?.url ?? `${VoidCatHost}/d/${result.file?.id}`;
        setAvatar(resultUrl);
      } else {
        setError(result.errorMessage ?? "Upload failed");
      }
    }
  }

  async function setupProfile() {
    const px = new NostrStreamProvider(DefaultProvider.name, DefaultProvider.url, EventPublisher.privateKey(key));
    const info = await px.info();
    setProviderInfo(info);

    setStage(Stage.LnAddress);
  }

  async function saveProfile() {
    try {
      // validate LN addreess
      try {
        const lnurl = new LNURL(lnAddress);
        await lnurl.load();
      } catch {
        throw new Error(
          formatMessage({
            defaultMessage: "Hmm, your lightning address looks wrong",
            id: "4l69eO",
          })
        );
      }
      const pub = EventPublisher.privateKey(key);
      const profile = {
        name: username,
        picture: avatar,
        lud16: lnAddress,
      } as UserMetadata;

      const ev = await pub.metadata(profile);
      console.debug(ev);
      system.BroadcastEvent(ev);

      setStage(Stage.SaveKey);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(e as string);
      }
    }
  }

  switch (stage) {
    case Stage.Login: {
      return (
        <>
          <img src={LoginHeader as string} srcSet={`${LoginHeader2x} 2x`} className="header-image" />
          <div className="content-inner">
            <h2>
              <FormattedMessage defaultMessage="Create an Account" id="u6uD94" />
            </h2>
            <h3>
              <FormattedMessage defaultMessage="No emails, just awesomeness!" id="+AcVD+" />
            </h3>
            <button type="button" className="btn btn-primary btn-block" onClick={createAccount}>
              <FormattedMessage defaultMessage="Create Account" id="5JcXdV" />
            </button>

            <div className="or-divider">
              <hr />
              <FormattedMessage defaultMessage="OR" id="INlWvJ" />
              <hr />
            </div>
            {hasNostrExtension && (
              <>
                <AsyncButton type="button" className="btn btn-primary btn-block" onClick={loginNip7}>
                  <FormattedMessage defaultMessage="Nostr Extension" id="ebmhes" />
                </AsyncButton>
              </>
            )}
            <button type="button" className="btn btn-primary btn-block" onClick={() => setStage(Stage.LoginInput)}>
              <FormattedMessage defaultMessage="Login with Private Key (insecure)" id="feZ/kG" />
            </button>
            {error && <b className="error">{error}</b>}
          </div>
        </>
      );
    }
    case Stage.LoginInput: {
      return (
        <>
          <img src={LoginVault as string} srcSet={`${LoginVault2x} 2x`} className="header-image" />
          <div className="content-inner">
            <h2>
              <FormattedMessage defaultMessage="Login with private key" id="3df560" />
            </h2>
            <p>
              <FormattedMessage
                defaultMessage="This method is insecure. We recommend using a {nostrlink}"
                id="Z8ZOEY"
                values={{
                  nostrlink: (
                    <a href="">
                      <FormattedMessage defaultMessage="nostr signer extension" id="/EvlqN" />
                    </a>
                  ),
                }}
              />
            </p>
            <div className="paper">
              <input
                type="text"
                value={key}
                onChange={e => setNewKey(e.target.value)}
                placeholder={formatMessage({ defaultMessage: "eg. nsec1xyz", id: "yzKwBQ" })}
              />
            </div>
            <div className="flex justify-between">
              <div></div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setNewKey("");
                    setStage(Stage.Login);
                  }}>
                  <FormattedMessage defaultMessage="Cancel" id="47FYwb" />
                </button>
                <AsyncButton onClick={doLoginNsec} className="btn btn-primary">
                  <FormattedMessage defaultMessage="Log In" id="r2Jjms" />
                </AsyncButton>
              </div>
            </div>
            {error && <b className="error">{error}</b>}
          </div>
        </>
      );
    }
    case Stage.Details: {
      return (
        <>
          <img src={LoginProfile as string} srcSet={`${LoginProfile2x} 2x`} className="header-image" />
          <div className="content-inner">
            <h2>
              <FormattedMessage defaultMessage="Setup Profile" id="nOaArs" />
            </h2>
            <div className="flex items-center">
              <div
                className="avatar-input"
                onClick={uploadAvatar}
                style={
                  {
                    "--img": `url(${avatar})`,
                  } as CSSProperties
                }>
                <Icon name="camera-plus" />
              </div>
            </div>
            <div className="username">
              <div className="paper">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <small>
                <FormattedMessage defaultMessage="You can change this later" id="ZmqxZs" />
              </small>
            </div>
            <AsyncButton type="button" className="btn btn-primary" onClick={setupProfile}>
              <FormattedMessage defaultMessage="Save" id="jvo0vs" />
            </AsyncButton>
          </div>
        </>
      );
    }
    case Stage.LnAddress: {
      return (
        <>
          <img src={LoginWallet as string} srcSet={`${LoginWallet2x} 2x`} className="header-image" />
          <div className="content-inner">
            <h2>
              <FormattedMessage defaultMessage="Get paid by viewers" id="Fodi9+" />
            </h2>
            <p>
              <FormattedMessage
                defaultMessage="We hooked you up with a lightning wallet so you can get paid by viewers right away!"
                id="Oxqtyf"
              />
            </p>
            {providerInfo?.balance && (
              <p>
                <FormattedMessage
                  defaultMessage="Oh, and you have {n} sats of free streaming on us! 💜"
                  id="f6biFA"
                  values={{
                    n: <FormattedNumber value={providerInfo.balance} />,
                  }}
                />
              </p>
            )}
            <div className="username">
              <div className="paper">
                <input
                  type="text"
                  placeholder={formatMessage({ defaultMessage: "eg. name@wallet.com", id: "1qsXCO" })}
                  value={lnAddress}
                  onChange={e => setLnAddress(e.target.value)}
                />
              </div>
              <small>
                <FormattedMessage defaultMessage="You can always replace it with your own address later." id="FjDlus" />
              </small>
            </div>
            {error && <b className="error">{error}</b>}
            <AsyncButton type="button" className="btn btn-primary" onClick={saveProfile}>
              <FormattedMessage defaultMessage="Amazing! Continue.." id="tM6fNW" />
            </AsyncButton>
          </div>
        </>
      );
    }
    case Stage.SaveKey: {
      return (
        <>
          <img src={LoginKey as string} srcSet={`${LoginKey2x} 2x`} className="header-image" />
          <div className="content-inner">
            <h2>
              <FormattedMessage defaultMessage="Save Key" id="04lmFi" />
            </h2>
            <p>
              <FormattedMessage
                defaultMessage="Save this and keep it safe! If you lose this key, you won't be able to access your account ever again. Yep, it's that serious!"
                id="H/bNs9"
              />
            </p>
            <div className="paper">
              <Copy text={hexToBech32("nsec", key)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={loginWithKey}>
              <FormattedMessage defaultMessage="Ok, it's safe" id="My6HwN" />
            </button>
          </div>
        </>
      );
    }
  }
}
