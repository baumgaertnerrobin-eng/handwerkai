// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { contentGenerationService } from "@/services/contentGenerationService";
import { z } from "zod";

const GenerateSchema = z.object({
  trendItemId: z.string().optional(),
  customTopic: z.string().optional(),
  platforms: z.array(z.enum(["INSTAGRAM", "FACEBOOK", "LINKEDIN", "TIKTOK"])),
  ctaType: z.string(),
  tone: z.enum(["PROFESSIONAL", "HERZLICH", "MODERN", "WERBEND"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = GenerateSchema.safeParse(body);
    if (!input.success) {
      return NextResponse.json({ error: "Invalid input", details: input.error.flatten() }, { status: 400 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    let trend = { title: input.data.customTopic ?? "Allgemein", summary: null, category: "ALLGEMEIN", keywords: [] as string[] };

    if (input.data.trendItemId) {
      const trendItem = await prisma.trendItem.findFirst({
        where: { id: input.data.trendItemId, companyId: company.id },
      });
      if (trendItem) {
        trend = {
          title: trendItem.title,
          summary: trendItem.summary,
          category: trendItem.category,
          keywords: [],
        };
      }
    }

    const generatedPosts = await Promise.all(
      input.data.platforms.map(async (platform) => {
        const result = await contentGenerationService.generatePost({
          trend,
          company: {
            name: company.name,
            trade: company.trade,
            city: company.city,
            region: company.region,
            tone: input.data.tone ?? company.tone,
            usps: company.usps,
            targetGroup: company.targetGroup,
          },
          platform: platform as any,
          ctaType: input.data.ctaType,
        });

        if (!result) return null;

        // Save to DB
        return prisma.generatedPost.create({
          data: {
            companyId: company.id,
            trendItemId: input.data.trendItemId ?? null,
            platform: platform as any,
            content: result.content,
            hashtags: result.hashtags,
            cta: result.cta,
            tone: input.data.tone ?? company.tone,
            imagePrompt: result.imagePrompt,
            score: result.score,
            status: "DRAFT",
          },
        });
      })
    );

    return NextResponse.json({
      posts: generatedPosts.filter(Boolean),
    });
  } catch (err) {
    console.error("[POST /api/generate]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
