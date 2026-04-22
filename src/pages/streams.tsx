import { useStreamsFeed } from '@/hooks/live-streams'
import VideoGridSorted from '@/element/video-grid-sorted'

const MUSIC_TAGS = ['music', 'Music', 'MUSIC']

export function StreamsPage() {
  // Show all whitelisted streams PLUS any music-tagged stream from anyone.
  // Tag values are case-sensitive at the relay layer, so we match common variants
  // both at the relay query (includeTagFromAnyone) and at the post-fetch
  // sort/filter stage (allowTags) since useSortedStreams re-applies WHITELIST.
  const streams = useStreamsFeed(undefined, { includeTagFromAnyone: MUSIC_TAGS })

  return (
    <div className="flex flex-col gap-6 p-4 min-w-0">
      <VideoGridSorted
        evs={streams}
        showEnded={true}
        showPopular={false}
        showRecentClips={false}
        allowTags={MUSIC_TAGS}
      />
    </div>
  )
}
