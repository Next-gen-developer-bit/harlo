import type { CSSProperties } from "react";
import { iconLibrary, type IconName } from "@/lib/icon-library";

type Props = {
  name: IconName;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders one of the supplied Harlo icon assets directly from public/icons/
 * — never redrawn or recreated. This is the only way icon artwork should
 * reach the page; nothing here alters paths, shapes or stroke style.
 */
export default function UploadedIcon({ name, className = "", style }: Props) {
  return (
    <img
      src={`/icons/${iconLibrary[name]}`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      style={style}
    />
  );
}
