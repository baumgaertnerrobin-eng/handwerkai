// src/app/api/images/watermark/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { watermarkService } from "@/services/watermarkService";
import path from "path";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "./uploads";
const OUTPUTS_DIR = process.env.OUTPUTS_DIR ?? "./public/generated";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageAssetId } = await req.json();

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        watermarkSettings: { include: { logoAsset: true } },
      },
    });

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const wmSettings = company.watermarkSettings;
    if (!wmSettings?.logoAsset || !wmSettings.isEnabled) {
      return NextResponse.json({ error: "Watermark not configured" }, { status: 400 });
    }

    const imageAsset = await prisma.imageAsset.findFirst({
      where: { id: imageAssetId, companyId: company.id },
    });

    if (!imageAsset) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    const imagePath = path.join(UPLOADS_DIR, imageAsset.storagePath);
    const logoPath = path.join(UPLOADS_DIR, wmSettings.logoAsset.storagePath);
    const outputPath = path.join(OUTPUTS_DIR, `${imageAsset.id}_watermarked.jpg`);

    await prisma.imageAsset.update({
      where: { id: imageAsset.id },
      data: { status: "PROCESSING" },
    });

    const result = await watermarkService.applyWatermark(
      imagePath,
      {
        logoPath,
        position: wmSettings.position,
        opacity: wmSettings.opacity,
        sizePercent: wmSettings.sizePercent,
      },
      outputPath
    );

    const publicUrl = `/generated/${path.basename(result.outputPath)}`;

    await prisma.imageAsset.update({
      where: { id: imageAsset.id },
      data: {
        watermarkedUrl: publicUrl,
        hasWatermark: true,
        status: "READY",
        width: result.width,
        height: result.height,
      },
    });

    return NextResponse.json({ url: publicUrl, width: result.width, height: result.height });
  } catch (err) {
    console.error("[POST /api/images/watermark]", err);
    return NextResponse.json({ error: "Watermark processing failed" }, { status: 500 });
  }
}
