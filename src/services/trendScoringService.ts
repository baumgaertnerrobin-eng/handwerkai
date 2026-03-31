// src/services/trendScoringService.ts
import { SourceType, TrendCategory } from "@prisma/client";

interface ScoreInput {
  topic: string;
  keywords: string[];
  sourceType: SourceType;
  region?: string | null;
  relevanceScore: number;
}

interface ScoreOutput {
  trendScore: number;
  engagementScore: number;
  isLocal: boolean;
  isSeasonal: boolean;
  category: TrendCategory;
}

const SEASONAL_KEYWORDS = {
  winter: ["heizung", "dämmung", "frost", "schnee", "kälte", "winterdienst"],
  spring: ["frühjahr", "renovierung", "frühjahrsputz", "garten", "außenanstrich"],
  summer: ["sommer", "hitze", "sonnenschutz", "terrasse", "fassade"],
  autumn: ["herbst", "sanierung", "energiesparen", "wintervorbereitung"],
};

const CATEGORY_MAP: Record<string, TrendCategory> = {
  energie: TrendCategory.ENERGIE,
  heizung: TrendCategory.ENERGIE,
  förderung: TrendCategory.FOERDERUNG,
  kfw: TrendCategory.FOERDERUNG,
  bafa: TrendCategory.FOERDERUNG,
  fachkräfte: TrendCategory.FACHKRAEFTE,
  ausbildung: TrendCategory.FACHKRAEFTE,
  lokal: TrendCategory.LOKAL,
};

export const trendScoringService = {
  score(input: ScoreInput): ScoreOutput {
    const lowerTopic = (input.topic + " " + input.keywords.join(" ")).toLowerCase();
    const currentMonth = new Date().getMonth();

    let trendScore = Math.round(input.relevanceScore * 100);

    // Source type bonus
    const sourceBonus: Record<SourceType, number> = {
      NEWS: 15, RSS_FEED: 10, LOCAL_PORTAL: 12,
      WEBSITE: 5, BLOG: 8, COMPETITOR: 5,
    };
    trendScore = Math.min(100, trendScore + (sourceBonus[input.sourceType] || 0));

    // Local detection
    const isLocal = !!(input.region && lowerTopic.includes(input.region.toLowerCase().split(",")[0].toLowerCase()));
    if (isLocal) trendScore = Math.min(100, trendScore + 8);

    // Seasonal detection
    const seasonKeywords = this.getCurrentSeasonKeywords(currentMonth);
    const isSeasonal = seasonKeywords.some((kw) => lowerTopic.includes(kw));
    if (isSeasonal) trendScore = Math.min(100, trendScore + 5);

    // Category detection
    const category = this.detectCategory(lowerTopic);

    // Engagement score (slightly different weighting)
    const engagementScore = Math.min(100, Math.round(trendScore * 0.9 + (isLocal ? 10 : 0)));

    return { trendScore, engagementScore, isLocal, isSeasonal, category };
  },

  getCurrentSeasonKeywords(month: number): string[] {
    if (month >= 11 || month <= 1) return SEASONAL_KEYWORDS.winter;
    if (month >= 2 && month <= 4) return SEASONAL_KEYWORDS.spring;
    if (month >= 5 && month <= 7) return SEASONAL_KEYWORDS.summer;
    return SEASONAL_KEYWORDS.autumn;
  },

  detectCategory(text: string): TrendCategory {
    for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
      if (text.includes(keyword)) return category;
    }
    return TrendCategory.ALLGEMEIN;
  },
};
