// src/services/contentGenerationService.ts
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { Platform, Tone, Trade } from "@prisma/client";

const client = new Anthropic();

const GeneratedPostSchema = z.object({
  content: z.string(),
  hashtags: z.array(z.string()),
  cta: z.string(),
  imagePrompt: z.string(),
  score: z.number(),
});

export type GeneratedPostData = z.infer<typeof GeneratedPostSchema>;

interface GenerationInput {
  trend: { title: string; summary?: string | null; keywords?: string[]; category: string };
  company: {
    name: string;
    trade: Trade;
    city: string;
    region: string;
    tone: Tone;
    usps: string[];
    targetGroup: string;
  };
  platform: Platform;
  ctaType: string;
}

const TRADE_LABELS: Record<Trade, string> = {
  MALER: "Malerbetrieb",
  ELEKTRIKER: "Elektriker",
  SANITAER: "Sanitär- und Heizungsbetrieb",
  DACHDECKER: "Dachdeckerbetrieb",
  SCHREINER: "Schreinerei",
  ZIMMERER: "Zimmerei",
  FLIESENLEGER: "Fliesenlegerbetrieb",
  HEIZUNG: "Heizungsbau",
  SONSTIGES: "Handwerksbetrieb",
};

const TONE_LABELS: Record<Tone, string> = {
  PROFESSIONAL: "professionell und vertrauenswürdig",
  HERZLICH: "herzlich und nahbar",
  MODERN: "modern und direkt",
  WERBEND: "überzeugend und werbend",
};

const PLATFORM_GUIDES: Record<Platform, string> = {
  INSTAGRAM: "Instagram: max 150 Wörter, 1-2 Emojis, starker erster Satz, CTA am Ende",
  FACEBOOK: "Facebook: max 200 Wörter, persönlicher Ton, kann etwas länger sein, CTA",
  LINKEDIN: "LinkedIn: professionell, max 250 Wörter, Mehrwert für Geschäftskunden, kein Slang",
  TIKTOK: "TikTok: sehr kurz, max 80 Wörter, energetisch, trendy, hashtag-heavy",
};

export const contentGenerationService = {
  async generatePost(input: GenerationInput): Promise<GeneratedPostData | null> {
    const tradeLabel = TRADE_LABELS[input.company.trade];
    const toneLabel = TONE_LABELS[input.company.tone];
    const platformGuide = PLATFORM_GUIDES[input.platform];

    const prompt = `Du bist ein Social-Media-Experte für deutsches Handwerk.

Erstelle einen ${input.platform}-Post für diesen Betrieb:

BETRIEB:
- Name: ${input.company.name}
- Branche: ${tradeLabel}
- Stadt: ${input.company.city}, ${input.company.region}
- Tonalität: ${toneLabel}
- USPs: ${input.company.usps.join(", ")}
- Zielgruppe: ${input.company.targetGroup}

TREND-GRUNDLAGE:
- Thema: ${input.trend.title}
- Kategorie: ${input.trend.category}
- Zusammenfassung: ${input.trend.summary || "Kein weiterer Kontext"}

PLATTFORM-VORGABEN:
${platformGuide}

CTA-TYP: ${input.ctaType}

Antworte NUR mit gültigem JSON:
{
  "content": "Der vollständige Post-Text",
  "hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3", "#Hashtag4", "#Hashtag5"],
  "cta": "Konkreter Call-to-Action Satz",
  "imagePrompt": "Englischer Bildprompt für KI-Bildgenerierung, photorealistic, professional",
  "score": 75
}

Wichtig:
- Lokal denken: ${input.company.city} erwähnen wenn sinnvoll
- Authentisch für Handwerker, nicht corporate
- Hashtags: Mix aus lokal und Branche
- score: geschätztes Engagement-Potenzial (0-100)`;

    try {
      const response = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content.find((b) => b.type === "text")?.text ?? "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = GeneratedPostSchema.safeParse(JSON.parse(jsonMatch[0]));
      return parsed.success ? parsed.data : null;
    } catch (err) {
      console.error("[contentGenerationService] Generation failed:", err);
      return null;
    }
  },

  async generateWeekPlan(companyId: string, trends: any[], company: any) {
    const prompt = `Du bist ein Social-Media-Stratege für Handwerksbetriebe.

Erstelle einen optimalen 7-Tage-Posting-Plan für:
- Betrieb: ${company.name} (${TRADE_LABELS[company.trade as Trade]})
- Stadt: ${company.city}
- Verfügbare Trends: ${trends.map((t) => t.title).join(", ")}

Antworte NUR mit JSON:
{
  "week": [
    {
      "dayOfWeek": 1,
      "dayName": "Montag",
      "posts": [
        {
          "platform": "INSTAGRAM",
          "time": "09:00",
          "trendTitle": "Passender Trend",
          "reason": "Kurze Begründung"
        }
      ]
    }
  ]
}

Regeln:
- Max 2 Posts pro Tag
- Abwechslungsreiche Plattformen
- Donnerstag und Wochenende reduziert
- Beste Posting-Zeiten für Handwerker: 7-9h, 12h, 18-20h`;

    try {
      const response = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content.find((b) => b.type === "text")?.text ?? "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      return JSON.parse(jsonMatch[0]);
    } catch {
      return null;
    }
  },

  async generateImagePrompt(topic: string, company: any): Promise<string> {
    const tradeLabel = TRADE_LABELS[company.trade as Trade];
    return `Professional photography of ${tradeLabel.toLowerCase()} work in ${company.city} Germany, ${topic}, high quality craftsmanship, natural lighting, realistic, 4k, architectural photography style, authentic German residential setting`;
  },
};
