/**
 * Single source for the details that appear across the legal and about pages.
 *
 * Contact routing: if contactFormUrl is set, the site shows the form and never
 * renders the raw address — that's the point of using a form, since a public
 * mailto gets harvested by spam crawlers. Clear contactFormUrl to fall back to
 * contactEmail; clear both to hide every contact line rather than leaving a
 * dead link behind.
 *
 * contactFormUrl wants the long Google Forms viewform URL, e.g.
 * "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform" — not a forms.gle
 * short link, which cannot be embedded.
 */
export const site = {
  name: "Centre Pullz",
  url: "https://centre-pullz.omochanochachacha11.workers.dev",
  contactFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdjrptzxsLo_jYX37yeZcUC1RGIJzKoYV3G_JktVvVQM191rg/viewform",
  contactEmail: "omochanochachacha11@gmail.com",
  sourceHandle: "@6eS8Jm4YNJpPA2D",
  sourceUrl: "https://x.com/6eS8Jm4YNJpPA2D",
  /** Set true once AdSense (or any ad/analytics tag) is actually live. */
  hasAds: false,
  legalUpdated: "4 October 2026",
} as const;

/** True when there is any published way to reach us. */
export const hasContact = Boolean(site.contactFormUrl || site.contactEmail);

/**
 * Google Forms only renders inside an iframe when asked to; the plain viewform
 * URL returns the full chrome-wrapped page.
 */
export function formEmbedUrl(url: string): string {
  return url.includes("embedded=true")
    ? url
    : url + (url.includes("?") ? "&" : "?") + "embedded=true";
}
