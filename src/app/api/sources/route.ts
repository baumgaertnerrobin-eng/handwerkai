// src/app/api/sources/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SourceSchema = z.object({
  url: z.string().url(),
  type: z.enum(["WEBSITE", "RSS_FEED", "NEWS", "BLOG", "COMPETITOR", "LOCAL_PORTAL"]),
  label: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  region: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
  });

  if (!company) return NextResponse.json([]);

  const sources = await prisma.trendSource.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sources);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const input = SourceSchema.safeParse(body);
  if (!input.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
  });

  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const source = await prisma.trendSource.create({
    data: {
      companyId: company.id,
      ...input.data,
    },
  });

  return NextResponse.json(source, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
  });

  await prisma.trendSource.deleteMany({
    where: { id, companyId: company?.id },
  });

  return NextResponse.json({ success: true });
}
