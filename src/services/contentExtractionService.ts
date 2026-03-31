// src/services/contentExtractionService.ts
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const client = new Anthropic();

const TopicSchema = z.object({
  topic: z.string(),
  keywords: z.array(z.string()),
  sentiment: z.number().min(-1).max(1),
  relevanceScore: z.number().min(0).max(1),
  summary: z.string(),
});

const ExtractionResponseSchema = z.object({
  topics: z.array(TopicSchema),
});

export type ExtractedTopicData = z.infer<typeof TopicSchema>;

export const contentExtractionService = {
  async extractTopics(content: string, keywords: string[] = []): Promise<ExtractedTopicData[]> {
    const prompt = `Du bist ein Experte für Content-Analyse im deutschen Handwerksbereich.

Analysiere den folgenden Text und extrahiere die wichtigsten Themen, die für Social-Media-Content eines Handwerksbetriebs relevant sein könnten.

Fokus-Keywords (falls vorhanden): ${keywords.join(", ") || "Allgemein"}

Text:
${content.slice(0, 3000)}

Antworte NUR mit gültigem JSON in diesem Format (kein anderer Text):
{
  "topics": [
    {
      "topic": "Kurzer Thementitel (max 10 Wörter)",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "sentiment": 0.5,
      "relevanceScore": 0.8,
      "summary": "2-3 Sätze warum dieses Thema für Handwerker relevant ist"
    }
  ]
}

Extrahiere maximal 3 Themen. Nur Themen mit relevanceScore > 0.4 aufnehmen.`;

    try {
      const response = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content.find((b) => b.type === "text")?.text ?? "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return [];

      const parsed = ExtractionResponseSchema.safeParse(JSON.parse(jsonMatch[0]));
      return parsed.success ? parsed.data.topics : [];
    } catch (err) {
      console.error("[contentExtractionService] Extraction failed:", err);
      return [];
    }
  },
};
