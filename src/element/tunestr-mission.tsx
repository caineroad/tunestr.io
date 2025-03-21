import { Bitcoin, Radio, Users, DollarSign, Music } from "lucide-react";
import { FormattedMessage } from "react-intl";

export default function TunestrMission() {
  return (
    <div className="homepage">
      <div className="flex flex-col items-center justify-center mt-14 mb-28">
        <img src="/tunestr-logo-t.png" alt="Tunestr Logo" className="w-48 h-48" />
        <h1 className="mt-8 text-4xl font-bold text-center">
          <p>
            <FormattedMessage
              defaultMessage="independent music"
              id="independentMusic"
            />
          </p>
          <p>+</p>
          <p>
            <FormattedMessage
              defaultMessage="independent money"
              id="independentMoney"
            />
          </p>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 mb-28 place-items-center lg:place-items-start justify-between">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold mb-8">
              <FormattedMessage
                defaultMessage="for independent artists"
                id="forIndependentArtists"
              />
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>
                <FormattedMessage
                  defaultMessage="generate extra revenue on your live performances"
                  id="generateExtraRevenue"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="discover a new way to approach social media"
                  id="discoverNewWay"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="engage a passionate, new fan base online"
                  id="engagePassionateFanBase"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="find who your biggest fans are and connect with them directly"
                  id="findBiggestFans"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="learn about a new monetization strategy for creators"
                  id="learnMonetizationStrategy"
                />
              </li>
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
              <FormattedMessage
                defaultMessage="for independent venues"
                id="forIndependentVenues"
              />
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>
                <FormattedMessage
                  defaultMessage="differentiate yourself to touring artists"
                  id="differentiateYourself"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="promote your venue and event to a broader audience"
                  id="promoteVenue"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="create a new, interactive concert experience online"
                  id="createInteractiveConcert"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="stream shows with minimal effort beyond traditional streaming"
                  id="streamShowsMinimalEffort"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="help keep the economics of touring healthy"
                  id="keepTouringEconomics"
                />
              </li>
            </ul>
          </div>
          <div className="max-w-lg order-3">
            <h1 className="text-3xl font-bold mb-8">
              <FormattedMessage
                defaultMessage="for independent music fans"
                id="forIndependentFans"
              />
            </h1>
            <ul className="space-y-4 list-disc list-inside text-lg">
              <li>
                <FormattedMessage
                  defaultMessage="prove to your favorite artists that you're their #1 supporter"
                  id="proveToFavoriteArtists"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="give live feedback and pay entertainers directly while they perform"
                  id="giveLiveFeedback"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="connect with other fans during the show"
                  id="connectWithFans"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="join a new social media community where you aren't the product"
                  id="joinNewCommunity"
                />
              </li>
              <li>
                <FormattedMessage
                  defaultMessage="keep the independent music community thriving"
                  id="keepMusicCommunity"
                />
              </li>
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
