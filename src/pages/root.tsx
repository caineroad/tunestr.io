import { useStreamsFeed } from "@/hooks/live-streams";
import CategoryLink from "@/element/category/category-link";
import VideoGridSorted from "@/element/video-grid-sorted";
import { AllCategories } from "./category";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import useImgProxy from "@/hooks/img-proxy";

import { Bitcoin, Radio, Users, DollarSign, Music } from "lucide-react";
import TunestrMission from "@/element/tunestr-mission";

import { StreamState, DAY, WHITELIST, FEATURED_VIDEOS } from "@/const";
import { findTag, getHost } from "@/utils";
import { unixNow } from "@snort/shared";

export function RootPage() {
  const streams = useStreamsFeed();

  const live = streams
    .filter(a => findTag(a, "status") === StreamState.Live);

  const ended = streams
    .filter(a => findTag(a, "status") === StreamState.Ended)
    .filter(a => !FEATURED_VIDEOS || FEATURED_VIDEOS?.includes(findTag(a, "d")));

  return (
    <div className="flex flex-col gap-6 grow">
      <div className="-mt-4">
        <VideoGridSorted
          evs={live}
          showPlanned={false}
          showEnded={false}
          showPopular={false}
          showRecentClips={false}
        />
      </div>
      <TunestrMission />
      <VideoGridSorted
        evs={ended}
        showEnded={true}
        showPopular={false}
        showRecentClips={false}
      />
    </div>
  );
}
