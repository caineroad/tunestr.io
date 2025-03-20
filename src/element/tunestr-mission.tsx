import { Bitcoin, Radio, Users, DollarSign, Music } from "lucide-react";

export default function TunestrMission() {
  return (
    <div className="homepage">
      <div className="flex flex-col items-center justify-center mt-14 mb-28">
        <img src="/tunestr-logo-t.png" alt="Tunestr Logo" className="w-48 h-48" />
        <h1 className="mt-8 text-4xl font-bold text-center">
          <p>independent music</p>
          <p>+</p>
          <p>independent money</p>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 mb-28 place-items-center lg:place-items-start justify-between">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold mb-8">
              for independent artists
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>generate extra revenue on your live performances</li>
              <li>discover a new way to approach social media</li>
              <li>engage a passionate, new fan base online</li>
              <li>find who your biggest fans are and connect with them directly</li>
              <li>learn about a new monetization strategy for creators</li>
            </ul>
          </div>
          <div className="lg:w-full">
            <img
              src="tunestr/antones.jpg"
              alt="Boostagram Ball Live at Antone's in Austin, TX"
              className="object-cover rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-full order-2 lg:order-1">
            <img
              src="tunestr/vinyllounge.jpg"
              alt="The Vinyl Lounge in Nashville, TN"
              className="object-cover rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="max-w-xl order-1 lg:order-2">
            <h1 className="text-3xl font-bold mb-8">
              for independent venues &amp; promoters
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>differentiate yourself to touring artists</li>
              <li>promote your venue and event to a broader audience</li>
              <li>create a new, interactive concert experience online</li>
              <li>stream shows with minimal effort beyond traditional streaming</li>
              <li>help keep the economics of touring healthy</li>
            </ul>
          </div>
          <div className="max-w-lg order-3">
            <h1 className="text-3xl font-bold mb-8">
              for independent music fans
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>prove to your favorite artists that you’re their #1 supporter</li>
              <li>give live feedback and pay entertainers directly while they perform</li>
              <li>connect with other fans during the show</li>
              <li>join a new social media community where you aren’t the product</li>
              <li>keep the independent music community thriving</li>
            </ul>
          </div>
          <div className="lg:w-full order-4">
            <img
              src="tunestr/tunestr.jpg"
              alt="Ainsley Costello on Tunestr"
              className="object-cover rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
