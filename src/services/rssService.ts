// src/services/rssService.ts
import * as xml2js from "xml2js";

interface FeedItem {
  url: string;
  title: string;
  content: string;
  publishedAt?: Date;
}

export const rssService = {
  async fetchFeed(feedUrl: string): Promise<FeedItem[]> {
    try {
      const response = await fetch(feedUrl, {
        headers: { "User-Agent": "HandwerkAI-Bot/1.0", Accept: "application/rss+xml,application/xml,text/xml" },
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) return [];

      const xml = await response.text();
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xml);

      const channel = result?.rss?.channel || result?.feed;
      if (!channel) return [];

      const rawItems: any[] = Array.isArray(channel.item)
        ? channel.item
        : channel.item
        ? [channel.item]
        : Array.isArray(channel.entry)
        ? channel.entry
        : channel.entry
        ? [channel.entry]
        : [];

      return rawItems.slice(0, 20).map((item: any) => {
        const title = this.extractText(item.title);
        const description = this.extractText(item.description || item.summary || item["content:encoded"] || "");
        const link = this.extractText(item.link) || item.link?.["_"] || item.link?.["$"]?.href || "";
        const pubDate = item.pubDate || item.published || item.updated;

        return {
          url: link,
          title,
          content: this.stripHtml(description).slice(0, 3000),
          publishedAt: pubDate ? new Date(pubDate) : undefined,
        };
      }).filter((i) => i.url && i.content.length > 50);
    } catch (err) {
      console.error(`[rssService] Failed to fetch ${feedUrl}:`, err);
      return [];
    }
  },

  extractText(val: any): string {
    if (typeof val === "string") return val.trim();
    if (val && typeof val === "object") return (val["_"] || val["#text"] || "").trim();
    return "";
  },

  stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  },
};
