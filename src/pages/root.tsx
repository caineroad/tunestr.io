import { useStreamsFeed } from "@/hooks/live-streams";
import CategoryLink from "@/element/category/category-link";
import VideoGridSorted from "@/element/video-grid-sorted";
import { AllCategories } from "./category";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import useImgProxy from "@/hooks/img-proxy";

import { Bitcoin, Radio, Users, DollarSign, Music } from "lucide-react";
import TunestrMission from "@/element/tunestr-mission";

export function RootPage() {
  const streams = useStreamsFeed();

  return (
    <div className="flex flex-col gap-6 grow">
      <TunestrMission/>
      <div className="min-w-0 overflow-x-scroll scrollbar-hidden">
        <div className="flex gap-4 ">
          {AllCategories.filter(a => a.priority === 0).map(a => (
            <CategoryLink key={a.id} name={a.name} id={a.id} icon={a.icon} />
          ))}
        </div>
      </div>
      <VideoGridSorted evs={streams} showEnded={true} showPopular={false} showRecentClips={false} />
    </div>
  );
}
