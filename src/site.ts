/**
 * Single source for the details that appear across the legal and about pages.
 * Clearing contactEmail hides every contact line on the site rather than
 * leaving a dead mailto behind.
 */
export const site = {
  name: "Centre Pullz",
  url: "https://centre-pullz.omochanochachacha11.workers.dev",
  contactEmail: "omochanochachacha11@gmail.com",
  sourceHandle: "@6eS8Jm4YNJpPA2D",
  sourceUrl: "https://x.com/6eS8Jm4YNJpPA2D",
  /** Set true once AdSense (or any ad/analytics tag) is actually live. */
  hasAds: false,
  legalUpdated: "4 October 2026",
} as const;
