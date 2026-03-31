// src/app/api/trends/scan/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trendService } from "@/services/trendService";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const result = await trendService.runFullScan(company.id);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[POST /api/trends/scan]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// src/app/api/trends/route.ts
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (!company) return NextResponse.json([]);

    const trends = await trendService.getTopTrends(company.id, limit);
    return NextResponse.json(trends);
  } catch (err) {
    console.error("[GET /api/trends]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
