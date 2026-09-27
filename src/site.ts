/**
 * Single source for the details that appear across the legal and about pages.
 *
 * contactEmail is intentionally blank: Google AdSense and most privacy laws
 * expect a reachable contact method, and publishing an address is the site
 * owner's call. Set it before applying for ads — the pages adapt either way.
 */
export const site = {
  name: "Centre Pullz",
  url: "https://centre-pullz.omochanochachacha11.workers.dev",
  contactEmail: "",
  sourceHandle: "@6eS8Jm4YNJpPA2D",
  sourceUrl: "https://x.com/6eS8Jm4YNJpPA2D",
  /** Set true once AdSense (or any ad/analytics tag) is actually live. */
  hasAds: false,
  legalUpdated: "27 September 2026",
} as const;
