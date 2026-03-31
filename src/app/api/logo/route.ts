// src/app/api/logo/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { createId } from "@paralleldrive/cuid2";
const id = createId();

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "./uploads";
const ALLOWED_TYPES = ["image/png", "image/svg+xml", "image/webp", "image/jpeg"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("logo") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use PNG, SVG, WebP or JPEG." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large. Max 2MB." }, { status: 400 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

   const filename = `logo_${createId()}.png`;
    const logoDir = path.join(UPLOADS_DIR, "logos", company.id);
    await fs.mkdir(logoDir, { recursive: true });

    const filePath = path.join(logoDir, filename);
    const storagePath = path.join("logos", company.id, filename);

    // Convert to PNG via Sharp for consistency
    let width: number | undefined;
    let height: number | undefined;

    if (file.type !== "image/svg+xml") {
      const meta = await sharp(buffer).metadata();
      width = meta.width;
      height = meta.height;
      await sharp(buffer).png().toFile(filePath);
    } else {
      await fs.writeFile(filePath, buffer);
    }

    // Deactivate old logos
    await prisma.logoAsset.updateMany({
      where: { companyId: company.id },
      data: { isActive: false },
    });

    const logo = await prisma.logoAsset.create({
      data: {
        companyId: company.id,
        filename,
        storagePath,
        mimeType: "image/png",
        sizeBytes: file.size,
        width,
        height,
        isActive: true,
      },
    });

    // Upsert watermark settings to reference this logo
    await prisma.watermarkSettings.upsert({
      where: { companyId: company.id },
      create: {
        companyId: company.id,
        logoAssetId: logo.id,
        position: "BOTTOM_LEFT",
        opacity: 0.8,
        sizePercent: 20,
        isEnabled: true,
      },
      update: { logoAssetId: logo.id },
    });

    return NextResponse.json({ logo });
  } catch (err) {
    console.error("[POST /api/logo/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
