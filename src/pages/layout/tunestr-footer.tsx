import { FormattedMessage } from "react-intl";
import { Link } from "react-router";
import { Zap, Heart, Music } from "lucide-react";

export function TunestrFooter() {
  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative py-16 px-4">
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          {/* Top section — logo + tagline + CTA */}
          <div className="flex flex-col items-center text-center mb-14">
            <img src="/tunestr-logo-t.png" alt="tunestr" className="w-16 h-16 mb-4" />
            <p className="text-xl font-bold mb-2">independent music + independent money</p>
            <p className="text-layer-5 mb-6 max-w-md">
              <FormattedMessage
                defaultMessage="live music streaming powered by bitcoin. artists get paid directly."
                id="footerTagline"
              />
            </p>
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
              <FormattedMessage defaultMessage="get in touch" id="footerCta" />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">
            {/* Essentials */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                <FormattedMessage id="footerEssentials" defaultMessage="Essentials" />
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/streams" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                    Streams
                  </Link>
                </li>
                <li>
                  <a href="https://value4value.info" target="_blank" rel="noopener noreferrer" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                    Value for Value                  </a>
                </li>
                <li>
                  <a href="https://nostr.org" target="_blank" rel="noopener noreferrer" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                    Nostr Protocol                  </a>
                </li>
                <li>
                  <a href="https://soapbox.pub/blog/zapping-101" target="_blank" rel="noopener noreferrer" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                    Zapping 101                  </a>
                </li>
              </ul>
            </div>

            {/* Artists */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 inline-flex items-center gap-2">
                <Music className="w-4 h-4" />
                <FormattedMessage id="footerArtists" defaultMessage="Artists" />
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Ainsley Costello", url: "https://ainsleycostello.com/" },
                  { name: "Tip-NZ", url: "https://www.tipnz.com/" },
                  { name: "Sara Jade", url: "https://sarajademusic.com/" },
                  { name: "Joe Martin", url: "https://www.joemartinmusic.com/" },
                  { name: "DJ Valerie B", url: "https://www.djvalerieblove.com/" },
                ].map((artist) => (
                  <li key={artist.name}>
                    <a href={artist.url} target="_blank" rel="noopener noreferrer" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                      {artist.name}                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#contact"
                    data-e="djR2QHR1bmVzdHIuaW8="
                    onClick={e => {
                      e.preventDefault();
                      const addr = atob((e.currentTarget as HTMLAnchorElement).dataset.e || "");
                      if (addr) window.location.href = `mailto:${addr}`;
                    }}
                    className="text-primary hover:text-white transition-colors font-semibold"
                  >
                    You? Apply to stream →
                  </a>
                </li>
              </ul>
            </div>

            {/* Thanks */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 inline-flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <FormattedMessage id="footerThanks" defaultMessage="Thanks" />
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Santos", url: "https://santos.lol/" },
                  { name: "Kieran", url: "https://njump.me/npub1v0lxxxxutpvrelsksy8cdhgfux9l6a42hsj2qzquu2zk7vc9qnkszrqj49" },
                  { name: "Karnage", url: "https://njump.me/npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac" },
                  { name: "Hodlbod", url: "https://njump.me/npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn" },
                  { name: "NabismoPrime", url: "https://njump.me/npub1g5pm4gf8hh7skp2rsnw9h2pvkr32sdnuhkcx9yte7qxmrg6v4txqqudjqv" },
                  { name: "Shawn Yeager", url: "https://shawnyeager.com/" },
                ].map((person) => (
                  <li key={person.name}>
                    <a href={person.url} target="_blank" rel="noopener noreferrer" className="text-layer-5 hover:text-white transition-colors inline-flex items-center gap-2">
                      {person.name}                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-layer-3/50 flex items-center justify-center">
            <p className="text-layer-4 text-sm">
              built with 💜 on{" "}
              <a href="https://nostr.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">nostr</a>
              {" "}+{" "}
              <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bitcoin</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
