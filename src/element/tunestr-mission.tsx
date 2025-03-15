import { Bitcoin, Radio, Users, DollarSign, Music } from "lucide-react";

export default function TunestrMission() {
  const missions = [
    {
      text: "Promote the growth of sovereign technology through onboarding & educating both, creators and fans to the power of Bitcoin & Nostr through V4V live performance broadcasts",
      icon: <Bitcoin className="w-6 h-6 text-white" />,
    },
    {
      text: "Create a low-risk & no-cost experience for bitcoin-curious onboarding",
      icon: <Radio className="w-6 h-6 text-white" />,
    },
    {
      text: "Provide a discovery platform for bitcoiners to connect & support like-minded artists",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      text: 'Introduce an additional, independent revenue stream for live performances by enabling bitcoin micropayment "tips" to performing artists worldwide',
      icon: <DollarSign className="w-6 h-6 text-white" />,
    },
    {
      text: "Keeping the art and performer as the focus of the in-person performing space and entertainment experience, while allowing the technology to enhance and expand it online",
      icon: <Music className="w-6 h-6 text-white" />,
    },
  ];

  const bulletPoints = [
    "On bitcoin, there are no middle men or payment processors.",
    "On lightning, there are minimal network fees and instant confirmation.",
    "On Nostr, there is no censorship of artistic expression and you own all of your content and identity.",
    "On Tunestr, all artists who represent the ethos of independent art and V4V are welcome.",
  ];

  return (
    <div className="homepage">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img src="/tunestr-logo-t.png" alt="Logo" className="w-48 h-48" />
        <h1 className="mt-8 text-4xl font-bold text-center">
          INDEPENDENT MUSIC MEETS <br /> INDEPENDENT MONEY
        </h1>
        <p className="mt-4 text-lg text-center text-muted-foreground">
          Empowering Live Stream Musicians to New Heights
        </p>
      </div>
      <div className="mb-8 text-center">
        <div className="flex flex-col items-center justify-center ">
          <h1 className="text-4xl font-bold mb-2">Interactive experience</h1>
          <p className="text-lg">
            Connect directly with other fans through the Tunestr live chat room, see your tips on ‘top fan’ leaderboards
            in real-time, and even control on-site lights through your bitcoin contributions.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 md:p-8 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Mission</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <ul className="space-y-4">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-[#FF5500] p-3 rounded-lg">{mission.icon}</div>
                  </div>
                  <p className="text-sm md:text-base pt-1 max-w-xl">{mission.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://i.imgur.com/UmgnWV4.jpeg"
              alt="Mission visualization"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4 md:p-8 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center lg:text-left">How It Works</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img
              src="https://i.imgur.com/OdvbII4.jpeg"
              alt="How It Works Visualization"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="lg:w-1/2 space-y-4">
            <p className="text-lg">
              On Tunestr, artists can provide a free stream of their performance while fans access for free on Nostr.
            </p>
            <p className="text-lg">
              If value is exchanged, the fans can contribute tips in this value-for-value system. In the V4V
              environment, fans support artists with direct micropayments using bitcoin.
            </p>

            <ul className="list-disc pl-6 space-y-2 mt-4">
              {bulletPoints.map((point, index) => (
                <li key={index} className="text-lg">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
