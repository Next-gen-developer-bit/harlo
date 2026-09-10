export type PlatformBrand = { bg: string; fg: string };

// Approximate brand colors for each platform, used for colored icon badges.
export const platformBrand: Record<string, PlatformBrand> = {
  instagram: {
    bg: "linear-gradient(135deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)",
    fg: "#ffffff",
  },
  facebook: { bg: "#1877F2", fg: "#ffffff" },
  linkedin: { bg: "#0A66C2", fg: "#ffffff" },
  tiktok: { bg: "#010101", fg: "#ffffff" },
  youtube: { bg: "#FF0000", fg: "#ffffff" },
  threads: { bg: "#000000", fg: "#ffffff" },
  pinterest: { bg: "#E60023", fg: "#ffffff" },
  x: { bg: "#000000", fg: "#ffffff" },
  bluesky: { bg: "#0285FF", fg: "#ffffff" },
  "google-business-profile": { bg: "#4285F4", fg: "#ffffff" },
};

// Soft pastel tints of each brand color, for backgrounds where a full-saturation
// badge would be too loud (chips, list rows, subtle accents).
export const platformPastel: Record<string, PlatformBrand> = {
  instagram: { bg: "#FCE9F1", fg: "#C2296B" },
  facebook: { bg: "#E8F0FE", fg: "#1958C7" },
  linkedin: { bg: "#E7F1FB", fg: "#0A5FA6" },
  tiktok: { bg: "#EDEDEF", fg: "#26262B" },
  youtube: { bg: "#FDEBEB", fg: "#C22B2B" },
  threads: { bg: "#EEEEF0", fg: "#26262B" },
  pinterest: { bg: "#FCEAEA", fg: "#C21F26" },
  x: { bg: "#ECECEE", fg: "#1A1A1F" },
  bluesky: { bg: "#E6F3FF", fg: "#0270D6" },
  "google-business-profile": { bg: "#E8F0FE", fg: "#3367D6" },
};
