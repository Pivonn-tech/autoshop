import express from "express";
import { uploadCarImages, processCarImages, deleteCarImages } from "../middleware/upload.js";
import { prisma } from "../db/prisma.js";
import { carListingSchema, validate } from "../lib/schemas.js";
import logger from "../lib/logger.js";

const router = express.Router();
const IS_PROD = process.env.NODE_ENV === "production";

// ── GET all listings (with filters + pagination) ──────────────────────────────
router.get("/", async (req, res) => {
  try {
    const {
      page = "1",
      limit = "12",
      make,
      model,
      minPrice,
      maxPrice,
      year,
      fuelType,
      transmission,
      bodyType,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
      status = "active",
    } = req.query;

    const where = { status };
    if (make) where.make = { contains: make, mode: "insensitive" };
    if (model) where.model = { contains: model, mode: "insensitive" };
    if (year) where.year = parseInt(year);
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (bodyType) where.bodyType = bodyType;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const validSortFields = ["createdAt", "price", "year", "mileage", "viewCount"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      prisma.carListing.findMany({
        where,
        orderBy: { [orderField]: sortOrder === "asc" ? "asc" : "desc" },
        skip,
        take: limitNum,
      }),
      prisma.carListing.count({ where }),
    ]);

    return res.json({
      success: true,
      data: listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    logger.error({ err }, "Error fetching car listings");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── GET single listing ────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const listing = await prisma.carListing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ success: false, message: "Car listing not found" });

    // Increment view count without awaiting (best-effort)
    prisma.carListing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    return res.json({ success: true, data: listing });
  } catch (err) {
    logger.error({ err }, "Error fetching car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── POST create listing ───────────────────────────────────────────────────────
router.post("/", uploadCarImages, async (req, res) => {
  const validation = validate(carListingSchema, req.body);
  if (!validation.ok) {
    return res.status(400).json({ success: false, message: "Validation failed", fields: validation.errors });
  }

  const data = validation.data;

  let processedImages = [];
  if (req.files?.length) {
    try {
      processedImages = await processCarImages(req.files);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Failed to process images: " + err.message });
    }
  }

  let parsedFeatures = [];
  let parsedLocation = {};
  try {
    parsedFeatures = JSON.parse(data.features);
    parsedLocation = JSON.parse(data.location);
  } catch {
    return res.status(400).json({ success: false, message: "Invalid JSON in features or location" });
  }

  try {
    const listing = await prisma.carListing.create({
      data: {
        userId: data.userId,
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage ?? 0,
        color: data.color,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        engineSize: data.engineSize,
        condition: data.condition,
        price: data.price,
        currency: "KSH",
        negotiable: data.negotiable,
        title: data.title,
        description: data.description,
        features: parsedFeatures,
        images: processedImages,
        primaryImage: processedImages[0]?.url ?? null,
        location: parsedLocation,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail || null,
        status: "pending",
      },
    });

    logger.info({ listingId: listing.id, userId: data.userId }, "Car listing created");

    return res.status(201).json({
      success: true,
      message: "Car listing created. It will be reviewed before going live.",
      data: listing,
    });
  } catch (err) {
    // Clean up uploaded images on DB failure
    if (processedImages.length) deleteCarImages(processedImages).catch(() => {});
    logger.error({ err }, "Error creating car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── PUT update listing ────────────────────────────────────────────────────────
router.put("/:id", uploadCarImages, async (req, res) => {
  try {
    const existing = await prisma.carListing.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: "Car listing not found" });

    let newImages = [];
    if (req.files?.length) {
      try {
        newImages = await processCarImages(req.files);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Failed to process images: " + err.message });
      }
    }

    let currentImages = Array.isArray(existing.images) ? existing.images : [];
    if (req.body.removeImages) {
      try {
        const toRemove = JSON.parse(req.body.removeImages);
        const del = currentImages.filter((img) => toRemove.includes(img.id));
        await deleteCarImages(del);
        currentImages = currentImages.filter((img) => !toRemove.includes(img.id));
      } catch {
        /* ignore bad removeImages input */
      }
    }

    const allImages = [...currentImages, ...newImages];
    const updateData = { ...req.body };
    delete updateData.removeImages;

    if (updateData.features) {
      try { updateData.features = JSON.parse(updateData.features); } catch { delete updateData.features; }
    }
    if (updateData.location) {
      try { updateData.location = JSON.parse(updateData.location); } catch { delete updateData.location; }
    }
    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.mileage) updateData.mileage = parseInt(updateData.mileage);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.negotiable !== undefined) updateData.negotiable = updateData.negotiable === "true";

    const updated = await prisma.carListing.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        images: allImages,
        primaryImage: allImages[0]?.url ?? null,
        status: "pending", // reset to pending for re-review
      },
    });

    return res.json({ success: true, message: "Car listing updated", data: updated });
  } catch (err) {
    logger.error({ err }, "Error updating car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── DELETE listing ────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const listing = await prisma.carListing.findUnique({ where: { id: req.params.id } });
    if (!listing) return res.status(404).json({ success: false, message: "Car listing not found" });

    const images = Array.isArray(listing.images) ? listing.images : [];
    if (images.length) await deleteCarImages(images).catch(() => {});

    await prisma.carListing.delete({ where: { id: req.params.id } });

    return res.json({ success: true, message: "Car listing deleted" });
  } catch (err) {
    logger.error({ err }, "Error deleting car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── GET user's listings ───────────────────────────────────────────────────────
router.get("/user/:userId", async (req, res) => {
  try {
    const where = { userId: req.params.userId };
    if (req.query.status) where.status = req.query.status;

    const listings = await prisma.carListing.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: listings });
  } catch (err) {
    logger.error({ err }, "Error fetching user car listings");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── PATCH approve ─────────────────────────────────────────────────────────────
router.patch("/:id/approve", async (req, res) => {
  try {
    const listing = await prisma.carListing.update({
      where: { id: req.params.id },
      data: { status: "active", approvedAt: new Date(), rejectedAt: null, rejectionReason: null },
    });
    return res.json({ success: true, message: "Car listing approved", data: listing });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Car listing not found" });
    logger.error({ err }, "Error approving car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

// ── PATCH reject ──────────────────────────────────────────────────────────────
router.patch("/:id/reject", async (req, res) => {
  try {
    const listing = await prisma.carListing.update({
      where: { id: req.params.id },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
        rejectionReason: req.body.reason || "No reason provided",
        approvedAt: null,
      },
    });
    return res.json({ success: true, message: "Car listing rejected", data: listing });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Car listing not found" });
    logger.error({ err }, "Error rejecting car listing");
    return res.status(500).json({ success: false, message: IS_PROD ? "Server error" : err.message });
  }
});

export default router;
