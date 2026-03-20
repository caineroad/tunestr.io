import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
import { MapPin, Calendar, Music, Zap, ArrowRight, ChevronUp, Radio } from "lucide-react";
import { useStreamsFeed } from "@/hooks/live-streams";
import { StreamState } from "@/const";
import { findTag } from "@/utils";
import { StreamTile } from "@/element/stream/stream-tile";
import VideoGrid from "@/element/video-grid";

interface EventVenue {
  name: string;
  city: string;
  state: string;
  description: string;
  photo?: string;
  url?: string;
}

const pastEvents: EventVenue[] = [
  {
    name: "First Avenue",
    city: "Minneapolis",
    state: "MN",
    description:
      "More than just four walls, a soundboard, and a stage — First Avenue is the epicenter of live music and entertainment in Minneapolis. Made famous by Prince and home to decades of legendary performances.",
    url: "https://first-avenue.com",
  },
  {
    name: "Antone's Nightclub",
    city: "Austin",
    state: "TX",
    description:
      "An iconic blues venue in downtown Austin where B.B. King, Muddy Waters, Jimmy Reed, Ray Charles, and James Brown have all graced the stage. Antone's is where tunestr hosted the Boostagram Ball — racking up millions of sats in live zaps.",
    photo: "/tunestr/antones.jpg",
    url: "https://antonesnightclub.com",
  },
  {
    name: "Maggie Mae's",
    city: "Austin",
    state: "TX",
    description:
      "A staple of Austin's legendary 6th Street live music scene. Multiple stages, multiple vibes — and now, live-streamed to the world on tunestr.",
    url: "https://www.maggiemaesaustin.com",
  },
  {
    name: "LAUNCH Music Conference & Festival",
    city: "Lancaster",
    state: "PA",
    description:
      "A developing artist and industry professional conference taking place over three days and three nights biannually. LAUNCH brings together emerging talent, industry veterans, and new technology — including live streaming with bitcoin payments via tunestr.",
    photo: "/tunestr/launch-event-duo.jpg",
    url: "https://launchfestival.com",
  },
  {
    name: "The Vinyl Lounge",
    city: "Nashville",
    state: "TN",
    description:
      "Nashville's hottest live music venue, bar, and nightclub. EDM, rock & roll, and everything in between — now live-streamed worldwide with tunestr and powered by bitcoin zaps.",
    photo: "/tunestr/vinyllounge.jpg",
    url: "https://www.thevinyloungenashville.com",
  },
  {
    name: "We All Scream",
    city: "Las Vegas",
    state: "NV",
    description:
      "Downtown Vegas's ice cream-fueled dance riot. Rooftop, courtyard, and chaos. Art, DJs, sugar rush — where street party meets nightclub. Nostr's wildest event meets tunestr's live streaming.",
    photo: "/tunestr/dj-booth-duo.jpg",
    url: "https://www.weallscream.com",
  },
];

function EventCard({ event }: { event: EventVenue }) {
  return (
    <div className="bg-layer-1 rounded-2xl border border-layer-2 overflow-hidden hover:border-primary/30 transition-colors group">
      {event.photo && (
        <div className="overflow-hidden aspect-video">
          <img
            src={event.photo}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold">{event.name}</h3>
        </div>
        <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-4">
          <MapPin className="w-4 h-4" />
          {event.city}, {event.state}
        </div>
        <p className="text-layer-5 leading-relaxed">{event.description}</p>
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-semibold mt-4"
          >
            visit venue
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const streams = useStreamsFeed();

  const upcomingStreams = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    return streams
      .filter(a => {
        const status = findTag(a, "status");
        if (status !== StreamState.Planned) return false;
        const starts = Number(findTag(a, "starts") ?? a.created_at);
        return starts > now;
      })
      .sort((a, b) => {
        const startA = Number(findTag(a, "starts") ?? a.created_at);
        const startB = Number(findTag(b, "starts") ?? b.created_at);
        return startA - startB;
      });
  }, [streams]);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const h = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Floating buttons */}
      <div className="fixed right-3 bottom-3 z-10 flex flex-col gap-3 items-center">
        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-layer-3 bg-layer-1 text-layer-5 hover:text-primary hover:border-primary transition-colors shadow-lg"
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 text-primary mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <FormattedMessage defaultMessage="tunestr live events" />
        </h1>
        <p className="text-xl text-layer-5 max-w-2xl mx-auto leading-relaxed">
          <FormattedMessage defaultMessage="tunestr brings bitcoin-powered live streaming to legendary venues across the country. real stages, real artists, real zaps." />
        </p>
      </div>

      {/* Upcoming streams */}
      {upcomingStreams.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Radio className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              <FormattedMessage defaultMessage="upcoming streams" />
            </h2>
          </div>
          <VideoGrid>
            {upcomingStreams.map(e => (
              <StreamTile ev={e} key={e.id} style="grid" />
            ))}
          </VideoGrid>
        </div>
      )}

      {/* No upcoming? Show message */}
      {upcomingStreams.length === 0 && (
        <div className="bg-layer-1 rounded-2xl border border-layer-2 p-8 text-center">
          <Calendar className="w-10 h-10 text-layer-4 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            <FormattedMessage defaultMessage="no upcoming streams scheduled" />
          </h3>
          <p className="text-layer-5 max-w-md mx-auto">
            <FormattedMessage defaultMessage="check back soon or follow tunestr artists on nostr to get notified when they go live." />
          </p>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "17M sats", label: "zapped at our first concert" },
          { value: "beat Spotify", label: "artists earned more in one night than 5 years streaming" },
          { value: "album funded", label: "from one tunestr show" },
          { value: "zero fees", label: "every sat goes to the artist" },
        ].map(stat => (
          <div key={stat.label} className="bg-layer-1 rounded-xl p-5 text-center border border-layer-2">
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <div className="text-layer-5 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Past events */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <FormattedMessage defaultMessage="where we've been" />
        </h2>
        <p className="text-layer-5 mb-8">
          <FormattedMessage defaultMessage="legendary venues. unforgettable nights. millions of sats zapped." />
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastEvents.map(event => (
            <EventCard key={event.name} event={event} />
          ))}

          {/* Want us at your venue? */}
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/30 p-6 flex flex-col justify-center items-center text-center">
            <div className="bg-primary/20 rounded-full p-4 mb-4">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">your venue here?</h3>
            <p className="text-layer-5 mb-6 max-w-sm">
              we're always looking for venues and events that want to bring bitcoin-powered live streaming to their stage.
            </p>
            {/* biome-ignore lint/a11y/useValidAnchor: obfuscated mailto */}
            <a
              href="#contact"
              data-e="djR2QHR1bmVzdHIuaW8="
              onClick={e => {
                e.preventDefault();
                const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || "");
                if (addr) window.location.href = `mailto:${addr}`;
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-layer-0 font-bold hover:brightness-110 transition-all"
            >
              <Zap className="w-4 h-4" />
              let's talk
            </a>
          </div>
        </div>
      </div>

      {/* What happens at a tunestr event */}
      <div className="bg-layer-1/50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          <FormattedMessage defaultMessage="what happens at a tunestr event?" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/15 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Music className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">artists perform live</h3>
            <p className="text-layer-5 text-sm leading-relaxed">
              musicians take the stage at a real venue while tunestr streams the show to fans around the world.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/15 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">fans zap from anywhere</h3>
            <p className="text-layer-5 text-sm leading-relaxed">
              viewers at home send bitcoin tips directly to the artists while they perform. a giant leaderboard shows the zaps rolling in live.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/15 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold mb-2">the crowd goes wild</h3>
            <p className="text-layer-5 text-sm leading-relaxed">
              the energy in the room is electric when artists see sats pouring in from fans across the globe. it's a concert experience like no other.
            </p>
          </div>
        </div>
      </div>

      {/* Photo highlights */}
      <div>
        <h2 className="text-2xl font-bold mb-8">
          <FormattedMessage defaultMessage="highlights" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { src: "/tunestr/antones-crowd.jpg", alt: "Crowd at Antone's during Boostagram Ball" },
            { src: "/tunestr/zap-leaderboard-antones.jpg", alt: "4.8 million sats on the leaderboard" },
            { src: "/tunestr/ainsley-boostagram-ball.jpg", alt: "Ainsley Costello at Boostagram Ball" },
            { src: "/tunestr/launch-event-band.jpg", alt: "Full band at LAUNCH Music Conference" },
            { src: "/tunestr/launch-event-zaps.jpg", alt: "367K sats zapped live" },
            { src: "/tunestr/pleblab-stage-duo.jpg", alt: "Live duo with zap screen" },
            { src: "/tunestr/dj-booth-lights.jpg", alt: "DJ booth at We All Scream in Las Vegas" },
            { src: "/tunestr/vinyllounge.jpg", alt: "The Vinyl Lounge in Nashville" },
            { src: "/tunestr/grow-nostr-band.jpg", alt: "Band at Grow Nostr event" },
          ].map(photo => (
            <div key={photo.src} className="overflow-hidden rounded-xl group">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold mb-4">
          <FormattedMessage defaultMessage="want tunestr at your next event?" />
        </h2>
        <p className="text-layer-5 text-lg mb-8 max-w-xl mx-auto">
          <FormattedMessage defaultMessage="whether you're a venue, festival, or event organizer — we'll bring the live stream, the zaps, and the leaderboard. your artists get paid. your audience goes global." />
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* biome-ignore lint/a11y/useValidAnchor: obfuscated mailto */}
          <a
            href="#contact"
            data-e="djR2QHR1bmVzdHIuaW8="
            onClick={e => {
              e.preventDefault();
              const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || "");
              if (addr) window.location.href = `mailto:${addr}`;
            }}
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-primary text-layer-0 font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-primary/25"
          >
            <Zap className="w-5 h-5" />
            book tunestr
          </a>
          <Link
            to="/about"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl border-2 border-layer-3 text-white font-bold text-lg hover:border-primary hover:text-primary transition-colors"
          >
            learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
