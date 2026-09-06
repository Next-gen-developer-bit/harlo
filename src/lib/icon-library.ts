// Canonical registry of the uploaded Harlo icon asset library.
// Every value here is a filename under public/icons/, saved byte-for-byte
// from the supplied source files. Do not add entries that aren't backed by
// an actual uploaded file — this registry is the single source of truth for
// "is this icon allowed on the site."
export const iconLibrary = {
  calendar: "calendar-svgrepo-com.svg",
  calendarDate: "calendar-date-svgrepo-com.svg",
  galleryEdit: "gallery-edit-svgrepo-com.svg",
  galleryAdd: "gallery-add-svgrepo-com.svg",
  folderWithFiles: "folder-with-files-svgrepo-com.svg",
  chart: "chart-svgrepo-com.svg",
  chart2: "chart-2-svgrepo-com.svg",
  globe: "global-svgrepo-com.svg",
  album: "album-svgrepo-com.svg",
  checklistMinimal: "checklist-minimalistic-svgrepo-com.svg",
  checklist: "checklist-svgrepo-com.svg",
  clipboardList: "clipboard-list-svgrepo-com.svg",
  clipboard: "clipboard-svgrepo-com.svg",
  notebook: "notebook-svgrepo-com.svg",
  usersGroup: "users-group-two-rounded-svgrepo-com.svg",
  monitorSmartphone: "monitor-smartphone-svgrepo-com.svg",
  mentionCircle: "mention-circle-svgrepo-com.svg",
  keyMinimal: "key-minimalistic-2-svgrepo-com.svg",
  shop: "shop-2-svgrepo-com.svg",
  play: "play-svgrepo-com.svg",
  clapperboardPlay: "clapperboard-play-svgrepo-com.svg",
  infoSquare: "info-square-svgrepo-com.svg",
  box: "box-svgrepo-com.svg",
  hamburgerMenu: "hamburger-menu-svgrepo-com.svg",
  database: "database-svgrepo-com.svg",
  settings: "settings-svgrepo-com.svg",
  tuningSquare: "tuning-square-svgrepo-com.svg",
  gps: "gps-svgrepo-com.svg",
  bill: "bill-svgrepo-com.svg",
  cursorSquare: "cursor-square-svgrepo-com.svg",
  codeScan: "code-scan-svgrepo-com.svg",
  addCircle: "add-circle-svgrepo-com.svg",
  heartAngle: "heart-angle-svgrepo-com.svg",
  cup: "cup-1-svgrepo-com.svg",
} as const;

export type IconName = keyof typeof iconLibrary;
