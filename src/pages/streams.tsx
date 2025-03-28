import { useStreamsFeed } from "@/hooks/live-streams";
import VideoGridSorted from "@/element/video-grid-sorted";
import { getTagValues } from "@/utils";
import { findTag, getHost } from "@/utils";
import { TUNESTR_ID } from "@/tunestr-const";

export function StreamsPage() {
  const streams = useStreamsFeed().filter(a =>
    getHost(a) === TUNESTR_ID ||
    getTagValues(a.tags, 't').some(t => t.toLowerCase() === 'music')
  );

  return (
    <div className="flex flex-col gap-6 p-4 min-w-0">
      <VideoGridSorted evs={streams} showEnded={true} showPopular={false} showRecentClips={false} />
    </div>
  );
}
