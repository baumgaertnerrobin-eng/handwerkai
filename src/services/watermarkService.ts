// src/services/watermarkService.ts
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { WatermarkPosition } from "@prisma/client";

interface WatermarkOptions {
  logoPath: string;
  position: WatermarkPosition;
  opacity: number; // 0-1
  sizePercent: number; // 5-50
}

interface ProcessResult {
  outputPath: string;
  width: number;
  height: number;
}

export const watermarkService = {
  async applyWatermark(
    imagePath: string,
    options: WatermarkOptions,
    outputPath: string
  ): Promise<ProcessResult> {
    const imageBuffer = await fs.readFile(imagePath);
    const logoBuffer = await fs.readFile(options.logoPath);

    const image = sharp(imageBuffer);
    const { width: imgWidth = 1080, height: imgHeight = 1080 } = await image.metadata();

    // Scale logo to % of image width
    const logoTargetWidth = Math.round(imgWidth * (options.sizePercent / 100));

    const scaledLogo = await sharp(logoBuffer)
      .resize({ width: logoTargetWidth, withoutEnlargement: true })
      .png()
      .toBuffer();

    const { width: logoW = 100, height: logoH = 100 } = await sharp(scaledLogo).metadata();

    // Apply opacity by compositing with transparent PNG
    const transparentLogo = await sharp(scaledLogo)
      .composite([
        {
          input: Buffer.from([0, 0, 0, Math.round(255 * (1 - options.opacity))]),
          raw: { width: 1, height: 1, channels: 4 },
          tile: true,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    const padding = 20;
    const gravity = this.getGravity(options.position);
    const offset = this.getOffset(options.position, imgWidth, imgHeight, logoW, logoH, padding);

    const outputBuffer = await image
      .composite([
        {
          input: transparentLogo,
          gravity,
          ...offset,
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, outputBuffer);

    const meta = await sharp(outputBuffer).metadata();

    return {
      outputPath,
      width: meta.width ?? imgWidth,
      height: meta.height ?? imgHeight,
    };
  },

  getGravity(position: WatermarkPosition): sharp.Gravity {
    const map: Record<WatermarkPosition, sharp.Gravity> = {
      TOP_LEFT: "northwest",
      TOP_RIGHT: "northeast",
      BOTTOM_LEFT: "southwest",
      BOTTOM_RIGHT: "southeast",
      CENTER: "center",
    };
    return map[position];
  },

  getOffset(
    position: WatermarkPosition,
    imgW: number,
    imgH: number,
    logoW: number,
    logoH: number,
    padding: number
  ): { top?: number; left?: number } {
    if (position === WatermarkPosition.CENTER) return {};
    const isLeft = position === WatermarkPosition.TOP_LEFT || position === WatermarkPosition.BOTTOM_LEFT;
    const isTop = position === WatermarkPosition.TOP_LEFT || position === WatermarkPosition.TOP_RIGHT;
    return {
      left: isLeft ? padding : imgW - logoW - padding,
      top: isTop ? padding : imgH - logoH - padding,
    };
  },

  async processForAllSizes(imagePath: string, options: WatermarkOptions, baseOutputPath: string) {
    const sizes = [
      { name: "instagram_square", width: 1080, height: 1080 },
      { name: "instagram_story", width: 1080, height: 1920 },
      { name: "facebook_post", width: 1200, height: 630 },
    ];

    const results: Record<string, ProcessResult> = {};

    for (const size of sizes) {
      const resizedPath = `${baseOutputPath}_${size.name}_orig.jpg`;
      const outputPath = `${baseOutputPath}_${size.name}.jpg`;

      await sharp(imagePath)
        .resize(size.width, size.height, { fit: "cover" })
        .jpeg({ quality: 90 })
        .toFile(resizedPath);

      results[size.name] = await this.applyWatermark(resizedPath, options, outputPath);
      await fs.unlink(resizedPath).catch(() => {});
    }

    return results;
  },
};
