import { useStreamsFeed } from '@/hooks/live-streams'
import VideoGridSorted from '@/element/video-grid-sorted'

export function StreamsPage() {
  // Show all whitelisted streams PLUS any music-tagged stream from anyone.
  // Tag values are case-sensitive at the relay layer, so we match common variants.
  const streams = useStreamsFeed(undefined, { includeTagFromAnyone: ['music', 'Music', 'MUSIC'] })

  return (
    <div className="flex flex-col gap-6 p-4 min-w-0">
      <VideoGridSorted evs={streams} showEnded={true} showPopular={false} showRecentClips={false} />
    </div>
  )
}
