import CategoryLink from "@/element/category/category-link";
import { CategoryTile } from "@/element/category/category-tile";
import { CategoryTopZapsStreamer } from "@/element/category/top-streamers";
import VideoGridSorted from "@/element/video-grid-sorted";
import { EventKind, RequestBuilder } from "@snort/system";
import { useRequestBuilder } from "@snort/system-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";

import IRLImage from "@/images/irl.jpeg";
import GamingImage from "@/images/gaming.jpeg";
import MusicImage from "@/images/music.jpeg";
import TalkImage from "@/images/talk.jpeg";
import ArtImage from "@/images/art.jpeg";
import { WHITELIST } from "@/const";

export const AllCategories = [
  {
    id: "irl",
    name: <FormattedMessage defaultMessage="IRL" />,
    icon: "face",
    tags: ["irl"],
    priority: 0,
    className: "bg-category-gradient-1",
    cover: IRLImage,
  },
  {
    id: "music",
    name: <FormattedMessage defaultMessage="Music" />,
    icon: "music",
    tags: ["music", "radio"],
    priority: 0,
    className: "bg-category-gradient-2",
    cover: MusicImage,
  },
  {
    id: "talk",
    name: <FormattedMessage defaultMessage="Talk" />,
    icon: "mic",
    tags: ["talk"],
    priority: 0,
    className: "bg-category-gradient-3",
    cover: TalkImage,
  },
];

export default function Category() {
  const params = useParams();
  const id = params.id ?? AllCategories[0].id;

  const sub = useMemo(() => {
    const cat = AllCategories.find(a => a.id === id);
    const rb = new RequestBuilder(`category:${id}`);
    rb.withFilter()
      .kinds([EventKind.LiveEvent])
      .authors(WHITELIST)
      .tag("t", cat?.tags ?? [id]);

    return rb;
  }, [id]);

  const results = useRequestBuilder(sub);
  return (
    <div className="px-2 py-4">
      <div className="min-w-0 w-[calc(100dvw-2rem)] overflow-x-scroll scrollbar-hidden">
        <div className="flex gap-4">
          {AllCategories.map(a => (
            <CategoryLink key={a.id} id={`internal:${a.id}`} name={a.name} icon={a.icon} />
          ))}
        </div>
      </div>
      {id && (
        <div className="py-8">
          <CategoryTile gameId={id} showDetail={true} extraDetail={<CategoryTopZapsStreamer gameId={id} />} />
        </div>
      )}
      <VideoGridSorted evs={results} showAll={true} />
    </div>
  );
}
