/**
 * storage.js — S3-compatible object storage abstraction
 *
 * Supports:
 *   - Cloudflare R2  (set S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com)
 *   - AWS S3         (set S3_ENDPOINT=https://s3.<region>.amazonaws.com  OR leave blank)
 *   - MinIO / local  (set S3_ENDPOINT=http://localhost:9000)
 *
 * Falls back to local disk upload when S3_BUCKET is not configured.
 *
 * Required env vars for object storage:
 *   S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *   S3_ENDPOINT   (optional — for R2/MinIO; omit for standard AWS S3)
 *   S3_PUBLIC_URL (optional — CDN/public base URL, e.g. https://cdn.autofixkenya.co.ke)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import logger from "./logger.js";

// ── Determine mode ────────────────────────────────────────────────────────────
const USE_S3 = Boolean(
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
);

// ── S3 client (created lazily only when USE_S3 is true) ───────────────────────
let s3Client = null;

function getS3Client() {
  if (!s3Client) {
    const config = {
      region: process.env.S3_REGION || "auto",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    };
    if (process.env.S3_ENDPOINT) {
      config.endpoint = process.env.S3_ENDPOINT;
      config.forcePathStyle = true; // needed for R2 and MinIO
    }
    s3Client = new S3Client(config);
  }
  return s3Client;
}

function publicUrl(key) {
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  // Construct from S3 endpoint or default AWS URL
  const endpoint = process.env.S3_ENDPOINT
    ? process.env.S3_ENDPOINT.replace(/\/$/, "")
    : `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com`;
  return `${endpoint}/${process.env.S3_BUCKET}/${key}`;
}

// ── Image processing ──────────────────────────────────────────────────────────
async function processBuffer(buffer) {
  const [full, thumb] = await Promise.all([
    sharp(buffer)
      .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
    sharp(buffer)
      .resize(300, 225, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer(),
  ]);
  return { full, thumb };
}

// ── S3 upload ─────────────────────────────────────────────────────────────────
async function uploadToS3(buffer, key, contentType = "image/webp") {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return publicUrl(key);
}

async function deleteFromS3(key) {
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
}

// ── Local disk upload (fallback) ──────────────────────────────────────────────
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "uploads", "cars");

async function ensureLocalDir() {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
}

async function uploadToLocal(buffer, filename) {
  await ensureLocalDir();
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return `/uploads/cars/${filename}`;
}

async function deleteFromLocal(filename) {
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fs.unlink(filepath).catch(() => {}); // ignore missing files
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Process and store car images.
 * Returns an array of image metadata objects compatible with the CarListing schema.
 */
export async function storeCarImages(files) {
  const results = [];

  for (const file of files) {
    const id = uuidv4();
    const key = `cars/${id}`;

    try {
      const { full, thumb } = await processBuffer(file.buffer);

      let url, thumbnailUrl;

      if (USE_S3) {
        [url, thumbnailUrl] = await Promise.all([
          uploadToS3(full, `${key}.webp`),
          uploadToS3(thumb, `${key}_thumb.webp`),
        ]);
        logger.debug({ key }, "Image uploaded to S3");
      } else {
        [url, thumbnailUrl] = await Promise.all([
          uploadToLocal(full, `${id}.webp`),
          uploadToLocal(thumb, `${id}_thumb.webp`),
        ]);
        logger.debug({ id }, "Image saved to local disk");
      }

      results.push({
        id,
        originalName: file.originalname,
        filename: `${id}.webp`,
        thumbnailFilename: `${id}_thumb.webp`,
        url,
        thumbnailUrl,
        size: file.size,
        storage: USE_S3 ? "s3" : "local",
      });
    } catch (err) {
      logger.error({ err, file: file.originalname }, "Failed to process/store image");
      throw new Error(`Failed to process image: ${file.originalname}`);
    }
  }

  return results;
}

/**
 * Delete car images from wherever they were stored.
 */
export async function removeCarImages(images) {
  for (const img of images) {
    try {
      if (img.storage === "s3" || USE_S3) {
        await Promise.all([
          deleteFromS3(`cars/${img.id}.webp`),
          deleteFromS3(`cars/${img.id}_thumb.webp`),
        ]);
      } else {
        await Promise.all([
          deleteFromLocal(img.filename),
          deleteFromLocal(img.thumbnailFilename),
        ]);
      }
    } catch (err) {
      logger.error({ err, imgId: img.id }, "Failed to delete image");
    }
  }
}

export const isUsingObjectStorage = USE_S3;
