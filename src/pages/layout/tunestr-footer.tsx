export function TunestrFooter() {

  const columns = [
    {
      title: "ESSENTIALS",
      items: [
        { name: "VALUE FOR VALUE", url: "https://value4value.info" },
        { name: "PROTOCOL", url: "https://nostr.com" },
      ],
    },
    {
      title: "THANKS",
      items: [
        { name: "SANTOS", url: "#" },
        { name: "KIERAN", url: "#" },
        { name: "KARNAGE", url: "#" },
        { name: "HODLBOD", url: "#" },
        { name: "NABISMOPRIME", url: "#" },
        { name: "SHAWN (YAEGER)", url: "#" },
      ],
    },
    {
      title: "ARTISTS",
      items: [
        { name: "TIP-NZ", url: "#" },
        { name: "SARA JADE", url: "#" },
        { name: "JOE MARTIN", url: "#" },
        { name: "12 RODS", url: "#" },
        { name: "MELLOW CASSETTE", url: "#" },
        { name: "DR. ORANGE PILL", url: "#" },
        { name: "DJ VALERIE B", url: "#" },
        { name: "YOU?", url: "email:v4v@tunestr.io" },
      ],
    },
  ];

  return (
    <footer className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-2xl font-bold">{column.title}</h2>
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