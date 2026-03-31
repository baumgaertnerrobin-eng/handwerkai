// src/services/trendService.ts
import { prisma } from "@/lib/prisma";
import { crawlerService } from "./crawlerService";
import { rssService } from "./rssService";
import { contentExtractionService } from "./contentExtractionService";
import { trendScoringService } from "./trendScoringService";
import { TrendSource, SourceType, TrendCategory } from "@prisma/client";

export const trendService = {
  async runFullScan(companyId: string) {
    const sources = await prisma.trendSource.findMany({
      where: { companyId, isActive: true },
    });

    const results = await Promise.allSettled(
      sources.map((source) => this.processSingleSource(source, companyId))
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { successful, failed, total: sources.length };
  },

  async processSingleSource(source: TrendSource, companyId: string) {
    let rawContent: { url: string; title: string; content: string; publishedAt?: Date }[] = [];

    if (source.type === SourceType.RSS_FEED) {
      rawContent = await rssService.fetchFeed(source.url);
    } else {
      const scraped = await crawlerService.crawl(source.url);
      rawContent = scraped ? [scraped] : [];
    }

    for (const item of rawContent) {
      const hash = Buffer.from(item.url + item.content.slice(0, 100)).toString("base64");

      const exists = await prisma.crawledContent.findUnique({ where: { hash } });
      if (exists) continue;

      const crawled = await prisma.crawledContent.create({
        data: {
          sourceId: source.id,
          url: item.url,
          title: item.title,
          content: item.content,
          publishedAt: item.publishedAt,
          hash,
        },
      });

      const topics = await contentExtractionService.extractTopics(
        item.content,
        source.keywords
      );

      for (const topic of topics) {
        const extracted = await prisma.extractedTopic.create({
          data: {
            crawledContentId: crawled.id,
            topic: topic.topic,
            keywords: topic.keywords,
            sentiment: topic.sentiment,
            relevanceScore: topic.relevanceScore,
          },
        });

        const score = await trendScoringService.score({
          topic: topic.topic,
          keywords: topic.keywords,
          sourceType: source.type,
          region: source.region,
          relevanceScore: topic.relevanceScore,
        });

        if (score.trendScore >= 50) {
          await prisma.trendItem.create({
            data: {
              companyId,
              sourceId: source.id,
              extractedTopicId: extracted.id,
              title: topic.topic,
              summary: topic.summary,
              trendScore: score.trendScore,
              engagementScore: score.engagementScore,
              isLocal: score.isLocal,
              isSeasonal: score.isSeasonal,
              category: score.category as TrendCategory,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }

      await prisma.trendSource.update({
        where: { id: source.id },
        data: { lastCrawl: new Date(), crawlError: null },
      });
    }
  },

  async getTopTrends(companyId: string, limit = 10) {
    return prisma.trendItem.findMany({
      where: {
        companyId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { trendScore: "desc" },
      take: limit,
      include: { source: true },
    });
  },

  async getTrendById(id: string, companyId: string) {
    return prisma.trendItem.findFirst({
      where: { id, companyId },
      include: { source: true, extractedTopic: { include: { crawledContent: true } } },
    });
  },
};
