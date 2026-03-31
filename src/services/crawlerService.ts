// src/services/crawlerService.ts
import * as cheerio from "cheerio";

interface CrawledPage {
  url: string;
  title: string;
  content: string;
  publishedAt?: Date;
}

export const crawlerService = {
  async crawl(url: string): Promise<CrawledPage | null> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "HandwerkAI-Bot/1.0 (+https://handwerkai.de/bot)",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "de-DE,de;q=0.9",
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) return null;

      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove noise
      $("script, style, nav, footer, header, .cookie-banner, .advertisement").remove();

      const title = $("h1").first().text().trim() || $("title").text().trim();

      // Extract main content heuristically
      const contentSelectors = ["article", "main", ".post-content", ".entry-content", "#content", "body"];
      let content = "";
      for (const sel of contentSelectors) {
        const el = $(sel);
        if (el.length && el.text().trim().length > 200) {
          content = el.text().replace(/\s+/g, " ").trim();
          break;
        }
      }

      // Try to detect publish date
      const dateStr =
        $('meta[property="article:published_time"]').attr("content") ||
        $('time[datetime]').attr("datetime") ||
        $('meta[name="date"]').attr("content");

      const publishedAt = dateStr ? new Date(dateStr) : undefined;

      if (!content || content.length < 100) return null;

      return { url, title, content: content.slice(0, 5000), publishedAt };
    } catch (err) {
      console.error(`[crawlerService] Failed to crawl ${url}:`, err);
      return null;
    }
  },

  async crawlMultiple(urls: string[]): Promise<CrawledPage[]> {
    const results = await Promise.allSettled(urls.map((u) => this.crawl(u)));
    return results
      .filter((r): r is PromiseFulfilledResult<CrawledPage | null> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((p): p is CrawledPage => p !== null);
  },
};
