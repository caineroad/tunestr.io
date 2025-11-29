import { FormattedMessage } from "react-intl";

export function TunestrFooter() {
  const columns = [
    {
      titleId: "footerEssentials",
      items: [
        { name: "VALUE FOR VALUE", url: "https://value4value.info" },
        { name: "PROTOCOL", url: "https://nostr.com" },
      ],
    },
    {
      titleId: "footerThanks",
      items: [
        { name: "SANTOS", url: "https://santos.lol/" },
        { name: "KIERAN", url: "https://njump.me/npub1v0lxxxxutpvrelsksy8cdhgfux9l6a42hsj2qzquu2zk7vc9qnkszrqj49" },
        { name: "KARNAGE", url: "https://njump.me/npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac" },
        { name: "HODLBOD", url: "https://njump.me/npub1jlrs53pkdfjnts29kveljul2sm0actt6n8dxrrzqcersttvcuv3qdjynqn" },
        { name: "NABISMOPRIME", url: "https://njump.me/npub1g5pm4gf8hh7skp2rsnw9h2pvkr32sdnuhkcx9yte7qxmrg6v4txqqudjqv" },
        { name: "SHAWN (YEAGER)", url: "https://shawnyeager.com/" },
      ],
    },
    {
      titleId: "footerArtists",
      items: [
        { name: "AINSLEY COSTELLO", url: "https://ainsleycostello.com/" },
        { name: "TIP-NZ", url: "https://www.tipnz.com/" },
        { name: "SARA JADE", url: "https://sarajademusic.com/" },
        { name: "JOE MARTIN", url: "https://www.joemartinmusic.com/" },
        { name: "DJ VALERIE B", url: "https://www.djvalerieblove.com/" },
        { name: "YOU?", url: "mailto:v4v@tunestr.io" },
      ],
    },
  ];

  return (
    <footer className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-bold">
                {column.titleId === "footerEssentials" && (
                  <FormattedMessage
                    id="footerEssentials"
                    defaultMessage="ESSENTIALS"
                  />
                )}
                {column.titleId === "footerThanks" && (
                  <FormattedMessage
                    id="footerThanks"
                    defaultMessage="THANKS"
                  />
                )}
                {column.titleId === "footerArtists" && (
                  <FormattedMessage
                    id="footerArtists"
                    defaultMessage="ARTISTS"
                  />
                )}
              </h2>
              <ul className="space-y-2">
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-lg">
                    <a href={item.url} className="hover:underline transition-colors duration-300 ease-in-out">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
