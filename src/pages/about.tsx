import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ChevronUp } from 'lucide-react'
import { Bitcoin, Zap, Globe, Music, Heart, ExternalLink, Radio, Users, Shield, Wallet } from 'lucide-react'

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-layer-1 rounded-2xl p-6 md:p-8 border border-layer-3">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 rounded-full p-3">{icon}</div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-primary hover:underline"
    >
      {children}
      <ExternalLink className="w-4 h-4" />
    </a>
  )
}

function StepItem({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-layer-0 font-bold flex items-center justify-center text-sm">
        {number}
      </div>
      <div className="text-lg">{children}</div>
    </div>
  )
}

export default function AboutPage() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const h = () => setShowBackToTop(window.scrollY > 800)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Floating buttons */}
      <div className="fixed right-3 bottom-3 z-10 flex flex-col gap-3 items-center">
        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-layer-3 bg-layer-1 text-layer-5 hover:text-primary hover:border-primary transition-colors shadow-lg"
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
        {/* biome-ignore lint/a11y/useValidAnchor: obfuscated mailto */}
        <a
          href="#contact"
          aria-label="Contact us"
          data-e="djR2QHR1bmVzdHIuaW8="
          onClick={e => {
            e.preventDefault()
            const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || '')
            if (addr) window.location.href = `mailto:${addr}`
          }}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-primary bg-layer-1 text-primary hover:bg-primary hover:text-layer-0 transition-colors shadow-lg"
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Email"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </div>

      {/* Hero */}
      <div className="text-center mb-4">
        <img src="/tunestr-logo-t.png" alt="tunestr" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <FormattedMessage defaultMessage="about tunestr" />
        </h1>
        <p className="text-xl text-layer-5 max-w-2xl mx-auto">
          <FormattedMessage defaultMessage="live music streaming powered by bitcoin and nostr" />
        </p>
      </div>

      {/* What is tunestr */}
      <SectionCard
        icon={<Music className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="what is tunestr?" />}
      >
        <div className="space-y-4 text-lg text-layer-5">
          <p>
            <FormattedMessage defaultMessage="tunestr is a live music streaming platform built on nostr — a decentralized, open protocol. unlike twitch or youtube, there is no company in the middle taking a cut of your earnings or deciding who gets seen." />
          </p>
          <p>
            <FormattedMessage defaultMessage="when fans send you bitcoin tips (called 'zaps'), the money goes directly to you — instantly, globally, with no fees to the platform. your audience, your music, your money." />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-layer-2 rounded-xl p-4 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-white">
                <FormattedMessage defaultMessage="censorship resistant" />
              </p>
              <p className="text-sm mt-1">
                <FormattedMessage defaultMessage="no deplatforming" />
              </p>
            </div>
            <div className="bg-layer-2 rounded-xl p-4 text-center">
              <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-white">
                <FormattedMessage defaultMessage="direct payments" />
              </p>
              <p className="text-sm mt-1">
                <FormattedMessage defaultMessage="no platform cut" />
              </p>
            </div>
            <div className="bg-layer-2 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-white">
                <FormattedMessage defaultMessage="you own your audience" />
              </p>
              <p className="text-sm mt-1">
                <FormattedMessage defaultMessage="no algorithms" />
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* What is Bitcoin */}
      <SectionCard
        icon={<Bitcoin className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="what is bitcoin?" />}
      >
        <div className="space-y-4 text-lg text-layer-5">
          <p>
            <FormattedMessage defaultMessage="bitcoin is digital money that works without banks. it's open, global, and anyone can use it. think of it like digital cash — you can send it to anyone in the world, instantly." />
          </p>
          <div className="bg-layer-2 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-white">
              <FormattedMessage defaultMessage="key concepts:" />
            </p>
            <p>
              <span className="text-primary font-semibold">
                <FormattedMessage defaultMessage="sats" />
              </span>{' '}
              —{' '}
              <FormattedMessage defaultMessage="the smallest unit of bitcoin (like cents to dollars). 100 million sats = 1 bitcoin. most tips on tunestr are in sats." />
            </p>
            <p>
              <span className="text-primary font-semibold">
                <FormattedMessage defaultMessage="lightning network" />
              </span>{' '}
              —{' '}
              <FormattedMessage defaultMessage="a layer on top of bitcoin that makes payments instant and nearly free. this is what powers zaps on tunestr." />
            </p>
            <p>
              <span className="text-primary font-semibold">
                <FormattedMessage defaultMessage="zaps" />
              </span>{' '}
              —{' '}
              <FormattedMessage defaultMessage="lightning payments sent through nostr. when a fan zaps an artist during a stream, the bitcoin arrives instantly in the artist's wallet." />
            </p>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-white mb-3">
              <FormattedMessage defaultMessage="learn more about bitcoin:" />
            </p>
            <ul className="space-y-2">
              <li>
                <ResourceLink href="https://bitcoin.org">bitcoin.org</ResourceLink>
              </li>
              <li>
                <ResourceLink href="https://www.lopp.net/bitcoin-information.html">
                  lopp.net — bitcoin information & resources
                </ResourceLink>
              </li>
              <li>
                <ResourceLink href="https://hope.com">hope.com — bitcoin basics</ResourceLink>
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-white mb-3">
              <FormattedMessage defaultMessage="recommended lightning wallets:" />
            </p>
            <ul className="space-y-2">
              <li>
                <ResourceLink href="https://phoenix.acinq.co/">Phoenix</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="simple, self-custodial lightning wallet" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://getalby.com/">Alby</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="browser extension for lightning & nostr" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://coinos.io/">Coinos</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="web-based bitcoin & lightning wallet" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://rizful.com/">Rizful</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="lightning wallet with nostr integration" />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* What is Nostr */}
      <SectionCard
        icon={<Globe className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="what is nostr?" />}
      >
        <div className="space-y-4 text-lg text-layer-5">
          <p>
            <FormattedMessage defaultMessage="nostr (Notes and Other Stuff Transmitted by Relays) is a simple, open protocol for decentralized social networking. no company owns it. no one can shut it down. your identity and your followers belong to you." />
          </p>
          <div className="bg-layer-2 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-white">
              <FormattedMessage defaultMessage="key concepts:" />
            </p>
            <p>
              <span className="text-primary font-semibold">
                <FormattedMessage defaultMessage="keys" />
              </span>{' '}
              —{' '}
              <FormattedMessage defaultMessage="your identity on nostr. you have a public key (like a username that works everywhere) and a private key (like a password — never share it). there's no sign-up form, no email required." />
            </p>
            <p>
              <span className="text-primary font-semibold">
                <FormattedMessage defaultMessage="relays" />
              </span>{' '}
              —{' '}
              <FormattedMessage defaultMessage="servers that pass messages around. your data isn't locked in one place — it's distributed across many relays. if one goes down, others still have your data." />
            </p>
            <p>
              <span className="text-primary font-semibold">NIP-05</span> —{' '}
              <FormattedMessage defaultMessage="a human-readable identity like you@tunestr.io. it's like a verified badge, but decentralized. tunestr artists get their own NIP-05 identity." />
            </p>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-white mb-3">
              <FormattedMessage defaultMessage="learn more about nostr:" />
            </p>
            <ul className="space-y-2">
              <li>
                <ResourceLink href="https://nostr.org">nostr.org</ResourceLink>
              </li>
              <li>
                <ResourceLink href="https://nostr.how">nostr.how — guides & tutorials</ResourceLink>
              </li>
              <li>
                <ResourceLink href="https://www.nostrapps.com/">nostrapps.com — discover nostr apps</ResourceLink>
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-white mb-3">
              <FormattedMessage defaultMessage="recommended nostr clients:" />
            </p>
            <ul className="space-y-2">
              <li>
                <ResourceLink href="https://ditto.pub/">Ditto</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="web" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://primal.net/">Primal</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="web, iOS, Android" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://damus.io/">Damus</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="iOS" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://www.amethyst.social/">Amethyst</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="Android" />
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="font-semibold text-white mb-3">
              <FormattedMessage defaultMessage="browser extensions:" />
            </p>
            <ul className="space-y-2">
              <li>
                <ResourceLink href="https://soapbox.pub/blog/announcing-soapbox-signer/">Soapbox Signer</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="nostr key manager for chrome" />
                </span>
              </li>
              <li>
                <ResourceLink href="https://getalby.com/">Alby</ResourceLink> —{' '}
                <span className="text-sm">
                  <FormattedMessage defaultMessage="lightning + nostr in one extension" />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Value for Value */}
      <SectionCard
        icon={<Heart className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="what is value for value?" />}
      >
        <div className="space-y-4 text-lg text-layer-5">
          <p>
            <FormattedMessage defaultMessage="value for value (v4v) is a simple idea: content is free to consume. if you enjoy it, you give value back — whatever it's worth to you. no subscriptions, no paywalls, no ads." />
          </p>
          <p>
            <FormattedMessage defaultMessage="on tunestr, this means fans can watch any stream for free. if the music moves them, they send sats directly to the artist while they perform. the artist gets 100% — tunestr takes nothing." />
          </p>
          <div className="bg-layer-2 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <Radio className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-white">
                  <FormattedMessage defaultMessage="free to watch" />
                </p>
                <p className="text-sm mt-1">
                  <FormattedMessage defaultMessage="no subscriptions or paywalls" />
                </p>
              </div>
              <div>
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-white">
                  <FormattedMessage defaultMessage="zap what it's worth" />
                </p>
                <p className="text-sm mt-1">
                  <FormattedMessage defaultMessage="pay what you feel, when you feel it" />
                </p>
              </div>
              <div>
                <Music className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-white">
                  <FormattedMessage defaultMessage="artists get 100%" />
                </p>
                <p className="text-sm mt-1">
                  <FormattedMessage defaultMessage="no platform fees, ever" />
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div>
              <ResourceLink href="https://soapbox.pub/blog/zapping-101">
                zapping 101 — a complete guide to zaps
              </ResourceLink>
            </div>
            <div>
              <ResourceLink href="https://value4value.info">
                value4value.info — learn more about the v4v model
              </ResourceLink>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Getting Started — Musicians */}
      <SectionCard
        icon={<Radio className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="getting started as a musician" />}
      >
        <div className="space-y-5 text-lg text-layer-5">
          <StepItem number={1}>
            <FormattedMessage defaultMessage="create a nostr identity — use any nostr client (Ditto, Primal, Damus, Amethyst) to generate your keys, or use a browser extension like Soapbox Signer or Alby." />
          </StepItem>
          <StepItem number={2}>
            <FormattedMessage defaultMessage="set up a lightning wallet to receive zaps — Phoenix and Alby are great options. connect it to your nostr profile." />
          </StepItem>
          <StepItem number={3}>
            <span>
              <FormattedMessage defaultMessage="reach out to get on tunestr — email" />{' '}
              {/* biome-ignore lint/a11y/useValidAnchor: obfuscated mailto */}
              <a
                href="#contact"
                data-e="djR2QHR1bmVzdHIuaW8="
                onClick={e => {
                  e.preventDefault()
                  const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || '')
                  if (addr) window.location.href = `mailto:${addr}`
                }}
                className="text-primary hover:underline"
              >
                v4v@tunestr.io
              </a>{' '}
              <FormattedMessage defaultMessage="and we'll get you set up with a NIP-05 identity and streaming access." />
            </span>
          </StepItem>
          <StepItem number={4}>
            <FormattedMessage defaultMessage="set up OBS (or your preferred streaming software) with your stream key from the tunestr dashboard." />
          </StepItem>
          <StepItem number={5}>
            <FormattedMessage defaultMessage="go live and start earning! your fans can zap you directly while you perform." />
          </StepItem>
        </div>
      </SectionCard>

      {/* Getting Started — Fans */}
      <SectionCard
        icon={<Users className="w-6 h-6 text-primary" />}
        title={<FormattedMessage defaultMessage="getting started as a fan" />}
      >
        <div className="space-y-5 text-lg text-layer-5">
          <StepItem number={1}>
            <FormattedMessage defaultMessage="create a nostr identity — sign up through any nostr client, or use the login button right here on tunestr." />
          </StepItem>
          <StepItem number={2}>
            <FormattedMessage defaultMessage="set up a lightning wallet to send zaps — Alby's browser extension makes it seamless. fund it with a small amount of bitcoin." />
          </StepItem>
          <StepItem number={3}>
            <FormattedMessage defaultMessage="browse live streams and watch for free — no account required to watch, but you'll need one to chat and zap." />
          </StepItem>
          <StepItem number={4}>
            <FormattedMessage defaultMessage="zap your favorite artists! hit the zap button during a performance to send sats directly to the musician on stage." />
          </StepItem>
        </div>
      </SectionCard>

      {/* Bottom CTA */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">
          <FormattedMessage defaultMessage="ready to join the revolution?" />
        </h2>
        <p className="text-layer-5 text-lg mb-6">
          <FormattedMessage defaultMessage="independent music deserves independent money." />
        </p>
        {/* biome-ignore lint/a11y/useValidAnchor: obfuscated mailto */}
        <a
          href="#contact"
          data-e="djR2QHR1bmVzdHIuaW8="
          onClick={e => {
            e.preventDefault()
            const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || '')
            if (addr) window.location.href = `mailto:${addr}`
          }}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-layer-0 font-bold text-lg hover:brightness-110 transition-all"
        >
          <Zap className="w-5 h-5" />
          <FormattedMessage defaultMessage="get in touch" />
        </a>
      </div>
    </div>
  )
}
