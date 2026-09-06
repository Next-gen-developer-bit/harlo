import type { CSSProperties } from "react";
import UploadedIcon from "./UploadedIcon";
import type { IconName } from "@/lib/icon-library";

type IconProps = { className?: string; style?: CSSProperties };

/**
 * Every icon exported from this file renders one of the supplied Harlo icon
 * assets (see src/lib/icon-library.ts + public/icons/) — nothing here is
 * hand-drawn. Component names describe where each concept is used on the
 * site so call sites read clearly; the underlying artwork is always the
 * uploaded file referenced in `fromLibrary(...)`.
 */
function fromLibrary(name: IconName) {
  return function Icon({ className, style }: IconProps) {
    return <UploadedIcon name={name} className={className} style={style} />;
  };
}

export const CalendarIcon = fromLibrary("calendar");
export const CalendarDateIcon = fromLibrary("calendarDate");
export const EditIcon = fromLibrary("galleryEdit");
export const PlayIcon = fromLibrary("play");
export const FolderIcon = fromLibrary("folderWithFiles");
export const ChartIcon = fromLibrary("chart2");
export const TeamIcon = fromLibrary("usersGroup");
export const GlobeIcon = fromLibrary("globe");
export const AlbumIcon = fromLibrary("album");
export const ChecklistIcon = fromLibrary("checklistMinimal");
export const ClipboardListIcon = fromLibrary("clipboardList");
export const ClipboardIcon = fromLibrary("clipboard");
export const NotebookIcon = fromLibrary("notebook");
export const MonitorSmartphoneIcon = fromLibrary("monitorSmartphone");
export const MentionCircleIcon = fromLibrary("mentionCircle");
export const KeyIcon = fromLibrary("keyMinimal");
export const ShopIcon = fromLibrary("shop");
export const InfoSquareIcon = fromLibrary("infoSquare");
export const BoxIcon = fromLibrary("box");
export const HamburgerMenuIcon = fromLibrary("hamburgerMenu");
