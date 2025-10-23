import { BorderButton, IconButton } from "@/element/buttons";
import { Icon } from "@/element/icon";
import { LoginSignup } from "@/element/login-signup";
import Logo from "@/element/logo";
import Modal from "@/element/modal";
import { AllLocales } from "@/intl";
import { Login } from "@/login";
import { profileLink } from "@/utils";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { FormattedMessage } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "@/hooks/lang";
import { useLogin } from "@/hooks/login";
import { useState } from "react";
import { Profile } from "@/element/profile";
import { SearchBar } from "./search";
import { NavLinkIcon } from "./nav-icon";
import { useLayout } from "./context";
import { WHITELIST } from "@/const";

export function HeaderNav() {
  const navigate = useNavigate();
  const login = useLogin();
  const [showLogin, setShowLogin] = useState(false);
  const { lang, setLang } = useLang();
  const country = lang.split(/[-_]/i)[1]?.toLowerCase();
  const layoutState = useLayout();
  const [showSearch, setShowSearch] = useState(false);

  function langSelector() {
    return (
      <Menu
        menuClassName="ctx-menu"
        menuButton={
          <div className="flex gap-2 items-center">
            {/* {country && <div className={`fi fi-${country}`}></div>} */}
            <div className="uppercase pointer">
              <b>{lang.includes("-") ? lang.split("-")[0] : lang}</b>
            </div>
          </div>
        }
        align="end"
        gap={5}>
        {AllLocales.sort().map(l => (
          <MenuItem className="capitalize" onClick={() => setLang(l)} key={l}>
            {new Intl.DisplayNames([l], {
              type: "language",
            }).of(l)}
          </MenuItem>
        ))}
      </Menu>
    );
  }

  function loggedIn() {
    if (!login) return;

    return (
      <div className="flex gap-2 items-center pr-4 py-1">
        {/* {(!WHITELIST || WHITELIST.includes(login.pubkey)) && (
          <Menu
            menuClassName="ctx-menu"
            menuButton={
              <IconButton iconName="plus-circle" iconSize={20} className="px-3 py-2 hover:bg-layer-1 rounded-xl" />
            }
            align="end"
            gap={5}>
            <MenuItem onClick={() => navigate("/upload")}>
              <Icon name="upload" size={24} />
              <FormattedMessage defaultMessage="Upload" />
            </MenuItem>
            <MenuItem onClick={() => navigate("/dashboard")}>
              <Icon name="signal" size={24} />
              <FormattedMessage defaultMessage="Dashboard" />
            </MenuItem>
          </Menu>
        )} */}
        <Menu
          menuClassName="ctx-menu"
          menuButton={
            <div className="profile-menu">
              <Profile
                avatarSize={32}
                pubkey={login.pubkey}
                options={{
                  showName: false,
                }}
                linkToProfile={false}
              />
            </div>
          }
          align="end"
          gap={5}>
          <MenuItem onClick={() => navigate(profileLink(undefined, login.pubkey))}>
            <Icon name="user" size={24} />
            <FormattedMessage defaultMessage="Profile" />
          </MenuItem>
          <MenuItem onClick={() => navigate("/settings")}>
            <Icon name="settings" size={24} />
            <FormattedMessage defaultMessage="Settings" />
          </MenuItem>
          <MenuItem onClick={() => navigate("/widgets")}>
            <Icon name="widget" size={24} />
            <FormattedMessage defaultMessage="Widgets" />
          </MenuItem>
          <MenuItem onClick={() => Login.logout()}>
            <Icon name="logout" size={24} />
            <FormattedMessage defaultMessage="Logout" />
          </MenuItem>
          {(!WHITELIST || WHITELIST.includes(login.pubkey)) && (
            <>
            <hr/>
            <MenuItem onClick={() => navigate("/upload")}>
              <Icon name="upload" size={24} />
              <FormattedMessage defaultMessage="Upload" />
            </MenuItem>
            <MenuItem onClick={() => navigate("/dashboard")}>
              <Icon name="signal" size={24} />
              <FormattedMessage defaultMessage="Dashboard" />
            </MenuItem>
            </>
          )}
        </Menu>
      </div>
    );
  }

  function loggedOut() {
    if (login) return;
    return (
      <div className="pr-4">
        <BorderButton onClick={() => setShowLogin(true)}>
          <FormattedMessage defaultMessage="Login" id="AyGauy" />
          <Icon name="login" />
        </BorderButton>
        {showLogin && (
          <Modal
            id="login"
            onClose={() => setShowLogin(false)}
            bodyClassName="relative bg-layer-1 rounded-3xl overflow-hidden my-auto lg:w-[500px] max-lg:w-full"
            showClose={false}>
            <LoginSignup close={() => setShowLogin(false)} />
          </Modal>
        )}
      </div>
    );
  }

  function tunestrContactUs() {
    return (
      <div className="fixed right-0 bottom-0 p-1 pt-3 mb-1 mr-1 border border-primary rounded-full bg-layer-1">
        {/* To update the email address, run `btoa('new@domain.com')` in a JS console to generate a Base64 encoded address, and replace data-e with the result. */}
      <a
        href="#contact"
        aria-label="Contact us"
        rel="nofollow noopener noreferrer"
        data-e="djR2QHR1bmVzdHIuaW8="
        onClick={e => {
          e.preventDefault();
          const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || "");
          if (addr) window.location.href = `mailto:${addr}`;
        }}
        className="text-primary hover:text-primary-hover font-medium px-2 uppercase whitespace-nowrap inline-flex items-center gap-2">
        <Icon name="envelope" size={32} />
      </a>
      </div>
    )
  }

  if (!layoutState.showHeader) return;
  return (
    <>
    <div className="flex justify-between items-center gap-4">
      <div className="flex gap-4 items-center m-2">
        {layoutState.leftNav && (
          <NavLinkIcon
            name="hamburger"
            className="!opacity-100"
            onClick={() => {
              layoutState.update(c => {
                c.leftNavExpand = !c.leftNavExpand;
                return { ...c };
              });
            }}
          />
        )}
        <Link to="/">
          <img src="/logo.svg" width={130} />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <IconButton
          iconName="search"
          iconSize={20}
          className="md:hidden rounded-xl w-10 h-10"
          onClick={() => setShowSearch(s => !s)}
        />
        {tunestrContactUs()}
        {langSelector()}
        {loggedIn()}
        {loggedOut()}
      </div>
    </div>
    {showSearch && (
      <div className="md:hidden px-3 pb-2">
        <SearchBar className="w-full" autoFocus />
      </div>
    )}
    </>
  );
}
