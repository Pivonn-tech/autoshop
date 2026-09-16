/**
 * upload.js — Multer middleware for car image uploads.
 *
 * All actual processing and storage is handled by src/lib/storage.js.
 * This file is kept thin: just multer config + the re-exported helpers.
 */

import multer from "multer";
import path from "path";

// Store files in memory; storage.js handles the rest
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const okExt = allowed.test(path.extname(file.originalname).toLowerCase());
    const okMime = allowed.test(file.mimetype);
    if (okMime && okExt) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
});

export const uploadCarImages = upload.array("images", 10);

// Re-export from storage.js so callers don't need to know which module owns them
export { storeCarImages as processCarImages, removeCarImages as deleteCarImages } from "../lib/storage.js";
