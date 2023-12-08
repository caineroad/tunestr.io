import "./badge.css";
import type { NostrEvent } from "@snort/system";
import { findTag } from "@/utils";

export function Badge({ ev }: { ev: NostrEvent }) {
  const name = findTag(ev, "name") || findTag(ev, "d");
  const description = findTag(ev, "description") ?? "";
  const thumb = findTag(ev, "thumb");
  const image = findTag(ev, "image");
  return (
    <div className="badge">
      <img className="badge-thumbnail" src={thumb || image} alt={name} />
      <div className="badge-details">
        <h4 className="badge-name">{name}</h4>
        {description?.length > 0 && <p className="badge-description">{description}</p>}
      </div>
    </div>
  );
}
