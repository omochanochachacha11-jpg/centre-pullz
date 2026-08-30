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

    // Who makes the prize
    manufacturer: z.string(), // e.g. "Taito", "Sega", "Banpresto (Bandai Spirits)"

    // Source — Merry☆An's measurement post on X
    sourceUrl: z.string().url(),
    publishedAt: z.date(),

    // Prize specs, exactly as stated in the post (numbers + units)
    figureSize: z.string().optional(), // e.g. "21cm"
    boxWeight: z.string().optional(), // e.g. "405g"
    boxSize: z.string().optional(), // e.g. "23 × 14 × 12.5cm (H×W×D)"

    // Measured center of gravity, bilingual per line
    cog: z
      .array(
        z.object({
          en: z.string(),
          zh: z.string(),
        })
      )
      .optional(),

    // The post's remarks (個体差 / 動く etc.), translated — not AI-written
    noteEn: z.string(),
    noteZh: z.string(),

    // AI-generated playing tips for a hashi-watashi attempt, grounded in the measured COG
    tipEn: z.string(),
    tipZh: z.string(),

    // Manufacturer thumbnail (linked directly, not re-uploaded)
    imageUrl: z.string().url(),
    imageCredit: z.string(),

    // Merry☆An's annotated photo of the measured COG (lines + text on the box)
    diagramUrl: z.string().url().optional(),
    diagramCredit: z.string().optional(),
  }),
});

export const collections = { prizes };
