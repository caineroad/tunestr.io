import { useStreamsFeed } from '@/hooks/live-streams'
import VideoGridSorted from '@/element/video-grid-sorted'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Radio,
  Music,
  Users,
  Zap,
  Heart,
  DollarSign,
  ArrowRight,
  Tv,
  Globe,
  Shield,
  Wallet,
  Mic,
  Building2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react'

import { StreamState, FEATURED_VIDEOS } from '@/const'
import { findTag } from '@/utils'

const photos = [
  { src: '/tunestr/antones.jpg', alt: "Boostagram Ball Live at Antone's in Austin, TX" },
  { src: '/tunestr/pleblab-stage-duo.jpg', alt: 'Live duo performing at PlebLab with tunestr zap screen' },
  { src: '/tunestr/vinyllounge.jpg', alt: 'The Vinyl Lounge in Nashville, TN' },
  { src: '/tunestr/sara-jade-salon.jpg', alt: 'Sara Jade performing at Salon of Beauty with tunestr' },
  { src: '/tunestr/tunestr.jpg', alt: 'Ainsley Costello on tunestr' },
  { src: '/tunestr/antones-crowd.jpg', alt: "Crowd at Antone's in Austin for Boostagram Ball" },
  { src: '/tunestr/ainsley.jpg', alt: 'Ainsley Costello performing' },
  { src: '/tunestr/grow-nostr-band.jpg', alt: 'Band performing at Grow Nostr event with tunestr' },
  { src: '/tunestr/dj-valerie-antones.jpg', alt: "DJ Valerie B performing at Antone's" },
  { src: '/tunestr/tunestr-banner-performer.jpg', alt: 'Artist performing under tunestr.io banner' },
  { src: '/tunestr/launch-event-vocalist.jpg', alt: 'Vocalist on stage at tunestr launch event' },
  { src: '/tunestr/zap-leaderboard-antones.jpg', alt: "4.8 million sats raised — zap leaderboard at Antone's" },
  { src: '/tunestr/grow-nostr-duo.jpg', alt: 'Duo performing at Grow Nostr event' },
  { src: '/tunestr/launch-event-band.jpg', alt: 'Full band at tunestr launch event' },
  { src: '/tunestr/dj-booth-lights.jpg', alt: 'DJ booth with neon lights' },
  { src: '/tunestr/launch-event-duo.jpg', alt: 'Guitar and vocals duo at launch event with crowd filming' },
  { src: '/tunestr/ainsley-boostagram-ball.jpg', alt: 'Ainsley Costello at Boostagram Ball with 5M sats zapped' },
  { src: '/tunestr/launch-event-zaps.jpg', alt: '367K sats zapped live during performance' },
  { src: '/tunestr/dj-booth-duo.jpg', alt: 'DJs at the booth with colorful lights' },
]

function ContactButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    // biome-ignore lint/a11y/useValidAnchor: obfuscated mailto link
    <a
      href="#contact"
      aria-label="Contact us"
      data-e="djR2QHR1bmVzdHIuaW8="
      onClick={e => {
        e.preventDefault()
        const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || '')
        if (addr) window.location.href = `mailto:${addr}`
      }}
      className={className}
    >
      {children}
    </a>
  )
}

export function RootPage() {
  const streams = useStreamsFeed()
  const [galleryExpanded, setGalleryExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const h = () => setShowBackToTop(window.scrollY > 800)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [])
  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : null))
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    }
    document.body.classList.add('scroll-lock')
    window.addEventListener('keydown', h)
    return () => {
      document.body.classList.remove('scroll-lock')
      window.removeEventListener('keydown', h)
    }
  }, [lightboxIndex, lightboxPrev, lightboxNext])

  const live = streams.filter(a => findTag(a, 'status') === StreamState.Live)
  const ended = streams
    .filter(a => findTag(a, 'status') === StreamState.Ended)
    .filter(a => !FEATURED_VIDEOS || FEATURED_VIDEOS?.includes(findTag(a, 'd')))

  const visiblePhotos = galleryExpanded ? photos : photos.slice(0, 8)

  return (
    <div className="flex flex-col grow">
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
        <ContactButton className="w-12 h-12 flex items-center justify-center rounded-full border border-primary bg-layer-1 text-primary hover:bg-primary hover:text-layer-0 transition-colors shadow-lg">
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
        </ContactButton>
      </div>

      {live.length > 0 && (
        <section className="relative">
          <VideoGridSorted
            evs={live}
            showPlanned={false}
            showEnded={false}
            showPopular={false}
            showRecentClips={false}
          />
        </section>
      )}

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center pt-20 pb-16 px-4">
          <img src="/tunestr-logo-t.png" alt="tunestr" className="w-36 h-36 md:w-44 md:h-44 drop-shadow-2xl" />
          <h1 className="mt-10 text-5xl md:text-7xl font-bold text-center leading-tight tracking-tight">
            <span className="text-primary">independent</span> music
            <br />
            <span className="text-layer-5">+</span> <span className="text-primary">independent</span> money
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <ContactButton className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary text-layer-0 font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/25">
              <Zap className="w-5 h-5" />
              <FormattedMessage defaultMessage="start streaming" />
            </ContactButton>
            <Link
              to="/streams"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border-2 border-layer-3 text-white font-bold text-lg hover:border-primary hover:text-primary transition-colors"
            >
              <Radio className="w-5 h-5" />
              <FormattedMessage defaultMessage="watch live" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <FormattedMessage defaultMessage="how it works" />
          </h2>
          <p className="text-center text-layer-5 text-lg mb-16 max-w-2xl mx-auto">
            <FormattedMessage defaultMessage="tunestr connects artists and fans through the power of free, open networks. no sign-up fees. no monthly subscriptions. no catch." />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-layer-1 rounded-2xl p-8 border border-layer-2 hover:border-primary/50 transition-colors group">
              <div className="absolute -top-5 left-8 bg-primary text-layer-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <Tv className="w-10 h-10 text-primary mb-4 mt-2" />
              <h3 className="text-xl font-bold mb-3">
                <FormattedMessage defaultMessage="artist goes live" />
              </h3>
              <p className="text-layer-5 leading-relaxed">
                <FormattedMessage defaultMessage="a musician sets up their stream and goes live on tunestr. the performance is broadcast to anyone in the world." />
              </p>
            </div>
            <div className="relative bg-layer-1 rounded-2xl p-8 border border-layer-2 hover:border-primary/50 transition-colors group">
              <div className="absolute -top-5 left-8 bg-primary text-layer-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <Zap className="w-10 h-10 text-primary mb-4 mt-2" />
              <h3 className="text-xl font-bold mb-3">
                <FormattedMessage defaultMessage="fans support" />
              </h3>
              <p className="text-layer-5 leading-relaxed">
                <FormattedMessage defaultMessage="viewers watch for free. when the music moves them, they send tips called 'zaps' — instantly, from anywhere on earth. whatever feels right." />
              </p>
            </div>
            <div className="relative bg-layer-1 rounded-2xl p-8 border border-layer-2 hover:border-primary/50 transition-colors group">
              <div className="absolute -top-5 left-8 bg-primary text-layer-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <Wallet className="w-10 h-10 text-primary mb-4 mt-2" />
              <h3 className="text-xl font-bold mb-3">
                <FormattedMessage defaultMessage="artist gets paid" />
              </h3>
              <p className="text-layer-5 leading-relaxed">
                <FormattedMessage defaultMessage="every zap goes directly to the artist's bitcoin wallet. no 30% platform cut. no waiting 90 days for a check. no minimum payout. instant, direct, yours." />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES TUNESTR DIFFERENT ===== */}
      <section className="py-20 px-4 bg-layer-1/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <FormattedMessage defaultMessage="why tunestr?" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'no risk',
                desc: 'artists keep what they earn. no sign-up fees or subscription needed.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'instant payments',
                desc: 'payments arrive in seconds via the network.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'you own your audience',
                desc: 'your followers are yours. no algorithm decides who sees you.',
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'new fans, new revenue',
                desc: 'worldwide exposure to fans who want to see artists thrive through technology.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 text-primary mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-layer-5 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR ARTISTS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-6">
                <Mic className="w-4 h-4" />
                <FormattedMessage defaultMessage="for musicians" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                <FormattedMessage defaultMessage="your music. your fans. your money." />
              </h2>
              <p className="text-layer-5 text-lg mb-8 leading-relaxed">
                <FormattedMessage defaultMessage="stop giving 30-50% of your earnings to platforms that don't care about your art. on tunestr, every tip from every fan goes straight to your wallet." />
              </p>
              <div className="space-y-4">
                {[
                  'unlock a new potential revenue opportunity for your live performances',
                  'earn in real time & receive instant feedback',
                  'build a fanbase that no platform can take away',
                  'get a tunestr.io identity (yourname@tunestr.io) and join the movement',
                  'learn about a new way to approach social media monetization',
                  'discover which fans support you the most',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-layer-5">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <ContactButton className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-layer-0 font-bold hover:brightness-110 transition-all">
                  <FormattedMessage defaultMessage="apply to stream" />
                  <ArrowRight className="w-4 h-4" />
                </ContactButton>
              </div>
            </div>
            <div className="relative">
              <img
                src="/tunestr/antones.jpg"
                alt="Live music at Antone's"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-layer-1 border border-layer-3 rounded-xl p-4 shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-zap" />
                  <div>
                    <div className="text-sm text-layer-5">live tip received</div>
                    <div className="font-bold text-zap">+2,100 sats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR VENUES ===== */}
      <section className="py-20 px-4 bg-layer-1/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="/tunestr/vinyllounge.jpg"
                alt="The Vinyl Lounge"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -right-6 bg-layer-1 border border-layer-3 rounded-xl p-4 shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-layer-5">viewers watching</div>
                    <div className="font-bold text-primary">247 worldwide</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-6">
                <Building2 className="w-4 h-4" />
                <FormattedMessage defaultMessage="for venues" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                <FormattedMessage defaultMessage="put your stage on the world stage." />
              </h2>
              <p className="text-layer-5 text-lg mb-8 leading-relaxed">
                <FormattedMessage defaultMessage="give touring artists a reason to choose your venue. live streaming on tunestr makes a statement — and gives artists an extra revenue stream they can't get anywhere else." />
              </p>
              <div className="space-y-4">
                {[
                  'attract artists who want to remain independent',
                  'promote your venue to fans far beyond your city',
                  'create an interactive online concert experience',
                  'minimal effort beyond traditional streaming setup',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-layer-5">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR FANS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-6">
                <Heart className="w-4 h-4" />
                <FormattedMessage defaultMessage="for fans" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                <FormattedMessage defaultMessage="support the music you love. directly." />
              </h2>
              <p className="text-layer-5 text-lg mb-8 leading-relaxed">
                <FormattedMessage defaultMessage="on tunestr, your money goes to the artist — not to a corporation. zap your favorite musicians while they're performing and watch the tips roll in live. this is what it feels like to actually support independent music." />
              </p>
              <div className="space-y-4">
                {[
                  'watch live shows for free — no account needed',
                  'tip artists directly and know they get 100%',
                  "prove you're their #1 fan on the leaderboard",
                  'chat with other fans and the artist during the show',
                  "join a community where you aren't the product",
                  'keep the independent music community thriving',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-layer-5">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/streams"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-layer-0 transition-colors"
                >
                  <FormattedMessage defaultMessage="watch a stream" />
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/tunestr/tunestr.jpg"
                alt="Ainsley Costello on tunestr"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUE FOR VALUE ===== */}
      <section className="py-20 px-4 bg-layer-1/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 text-primary mb-8">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <FormattedMessage defaultMessage="value for value" />
          </h2>
          <p className="text-xl text-layer-5 mb-8 leading-relaxed max-w-2xl mx-auto">
            <FormattedMessage defaultMessage="the tunestr model is simple: everything is free to watch. if the music moves you, give value back. no subscriptions. no paywalls. just artists and fans, connected directly." />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="bg-layer-2/50 rounded-2xl p-6 border border-layer-3">
              <Radio className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">free to watch</h3>
              <p className="text-layer-5 text-sm">always. no paywall. no sign-up required.</p>
            </div>
            <div className="bg-layer-2/50 rounded-2xl p-6 border border-layer-3">
              <Zap className="w-8 h-8 text-zap mx-auto mb-3" />
              <h3 className="font-bold mb-1">pay what it's worth</h3>
              <p className="text-layer-5 text-sm">zap when the music moves you. any amount.</p>
            </div>
            <div className="bg-layer-2/50 rounded-2xl p-6 border border-layer-3">
              <Music className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">artists get 100%</h3>
              <p className="text-layer-5 text-sm">every zap goes directly to the content streamers.</p>
            </div>
          </div>
          <div className="mt-10">
            <Link to="/about" className="text-primary hover:underline font-semibold inline-flex items-center gap-2">
              <FormattedMessage defaultMessage="learn about bitcoin, nostr, and value for value" />
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <FormattedMessage defaultMessage="the vibe" />
          </h2>
          <p className="text-center text-layer-5 text-lg mb-12">
            <FormattedMessage defaultMessage="real artists. real venues. real fans. real money. real independence." />
          </p>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {visiblePhotos.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setLightboxIndex(photos.indexOf(photo))}
                className="break-inside-avoid overflow-hidden rounded-xl group cursor-pointer w-full text-left"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
              </button>
            ))}
          </div>

          {/* Lightbox */}
          {lightboxIndex !== null && (
            // biome-ignore lint/a11y/noStaticElementInteractions: lightbox backdrop dismiss
            // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled via useEffect
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setLightboxIndex(null)
                }}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
              >
                <X className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  lightboxPrev()
                }}
                className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  lightboxNext()
                }}
                className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled via useEffect */}
              <img
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                onClick={e => e.stopPropagation()}
              />
              <div className="absolute bottom-6 text-white/60 text-sm">
                {lightboxIndex + 1} / {photos.length}
              </div>
            </div>
          )}
          {photos.length > 8 && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setGalleryExpanded(!galleryExpanded)}
                className="px-8 py-3 rounded-xl border border-layer-3 text-layer-5 hover:border-primary hover:text-primary transition-colors font-semibold"
              >
                {galleryExpanded ? (
                  <FormattedMessage defaultMessage="show less" />
                ) : (
                  <FormattedMessage defaultMessage="see all photos" />
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <FormattedMessage defaultMessage="independent music deserves independent money." />
          </h2>
          <p className="text-xl text-layer-5 mb-10 leading-relaxed">
            <FormattedMessage defaultMessage="whether you're an artist, a venue, or a fan — tunestr is where live music meets the future of money and social media." />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactButton className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary text-layer-0 font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/25">
              <Zap className="w-5 h-5" />
              <FormattedMessage defaultMessage="get in touch" />
            </ContactButton>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border-2 border-layer-3 text-white font-bold text-lg hover:border-primary hover:text-primary transition-colors"
            >
              <FormattedMessage defaultMessage="come be part of it" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RECENT STREAMS ===== */}
      {ended.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              <FormattedMessage defaultMessage="recent streams" />
            </h2>
            <VideoGridSorted evs={ended} showEnded={true} showPopular={false} showRecentClips={false} />
          </div>
        </section>
      )}
    </div>
  )
}
