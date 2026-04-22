import { useStreamsFeed } from '@/hooks/live-streams'
import VideoGridSorted from '@/element/video-grid-sorted'

export function StreamsPage() {
  const streams = useStreamsFeed()

  return (
    <div className="flex flex-col gap-6 p-4 min-w-0">
      <VideoGridSorted evs={streams} showEnded={true} showPopular={false} showRecentClips={false} />
    </div>
  )
}
