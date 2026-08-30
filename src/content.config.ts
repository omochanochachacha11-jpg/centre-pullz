import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const prizes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/prizes" }),
  schema: z.object({
    // Identity
    titleJa: z.string(),
    titleEn: z.string(),
    titleZh: z.string(),
    series: z.string().optional(),

    // Where this came from
    sourceType: z.enum(["prediction", "technique", "case_study"]),
    sourceUrl: z.string().url(),
    sourceName: z.literal("smacre.jp"),

    // When
    week: z.string(), // e.g. "2026-W35"
    weekLabelJa: z.string(), // e.g. "2026年8月第5週"
    publishedAt: z.date(),

    // Capture technique tags, e.g. hashi-watashi, suehirogari, kenzan
    techniques: z.array(
      z.object({
        slug: z.string(),
        labelJa: z.string(),
        labelEn: z.string(),
        labelZh: z.string(),
      })
    ),

    // Center-of-gravity target, as a % position inside the prize's bounding box
    // x/y are 0-100, measured from top-left. zone radius is a rough confidence blob size.
    centerOfGravity: z.object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
      zoneRadius: z.number().min(2).max(40).default(10),
      pushDirection: z.enum(["up", "down", "left", "right"]).optional(),
      confidence: z.enum(["low", "medium", "high"]).default("medium"),
    }),

    // Raw weight/size facts as given by the source (kept in original units)
    figureSize: z.string().optional(), // e.g. "26cm"
    boxWeight: z.string().optional(), // e.g. "424g"
    boxSize: z.string().optional(), // e.g. "25×15×14cm"

    // AI-generated targeting summary, one per language
    summaryEn: z.string(),
    summaryZh: z.string(),

    // Prize photo, pulled from the source post if one's available
    imageUrl: z.string().url().optional(),
    imageCredit: z.string().optional(), // e.g. "Photo via smacre.jp"

    featured: z.boolean().default(false),
  }),
});

export const collections = { prizes };
