import express from 'express';
import { uploadCarImages, processCarImages, deleteCarImages } from '../middleware/upload.js';

const router = express.Router();

// In-memory storage for car listings (replace with database in production)
const carListings = new Map();

// Get all car listings with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      make,
      model,
      minPrice,
      maxPrice,
      year,
      fuelType,
      transmission,
      bodyType,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'active'
    } = req.query;

    let listings = Array.from(carListings.values());

    // Apply filters
    if (status) listings = listings.filter(l => l.status === status);
    if (make) listings = listings.filter(l => l.make.toLowerCase().includes(make.toLowerCase()));
    if (model) listings = listings.filter(l => l.model.toLowerCase().includes(model.toLowerCase()));
    if (minPrice) listings = listings.filter(l => l.price >= parseFloat(minPrice));
    if (maxPrice) listings = listings.filter(l => l.price <= parseFloat(maxPrice));
    if (year) listings = listings.filter(l => l.year === parseInt(year));
    if (fuelType) listings = listings.filter(l => l.fuelType === fuelType);
    if (transmission) listings = listings.filter(l => l.transmission === transmission);
    if (bodyType) listings = listings.filter(l => l.bodyType === bodyType);
    if (location) listings = listings.filter(l => 
      l.location && l.location.county && l.location.county.toLowerCase().includes(location.toLowerCase())
    );

    // Sort listings
    listings.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = listings.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedListings = listings.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedListings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching car listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car listings',
      error: error.message
    });
  }
});

// Get single car listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = carListings.get(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found'
      });
    }

    // Increment view count
    listing.viewCount = (listing.viewCount || 0) + 1;
    carListings.set(id, listing);

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error fetching car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car listing',
      error: error.message
    });
  }
});

// Create new car listing
router.post('/', uploadCarImages, async (req, res) => {
  try {
    const {
      userId,
      make,
      model,
      year,
      mileage,
      color,
      bodyType,
      fuelType,
      transmission,
      engineSize,
      condition,
      price,
      negotiable,
      title,
      description,
      features,
      location,
      contactPhone,
      contactEmail
    } = req.body;

    // Validate required fields
    if (!userId || !make || !model || !year || !price || !title || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Process uploaded images
    let processedImages = [];
    if (req.files && req.files.length > 0) {
      try {
        processedImages = await processCarImages(req.files);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Failed to process images: ' + error.message
        });
      }
    }

    // Parse JSON fields
    let parsedFeatures = [];
    let parsedLocation = {};
    
    try {
      if (features) parsedFeatures = JSON.parse(features);
      if (location) parsedLocation = JSON.parse(location);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format for features or location'
      });
    }

    // Generate unique ID
    const id = `car_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create car listing
    const listing = {
      id,
      userId,
      make,
      model,
      year: parseInt(year),
      mileage: parseInt(mileage) || 0,
      color,
      bodyType,
      fuelType,
      transmission,
      engineSize,
      condition,
      price: parseFloat(price),
      currency: 'KSH',
      negotiable: negotiable === 'true',
      title,
      description,
      features: parsedFeatures,
      images: processedImages,
      primaryImage: processedImages.length > 0 ? processedImages[0].url : null,
      location: parsedLocation,
      contactPhone,
      contactEmail,
      status: 'pending', // Require admin approval
      viewCount: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    carListings.set(id, listing);

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully. It will be reviewed before going live.',
      data: listing
    });
  } catch (error) {
    console.error('Error creating car listing:', error);
    
    // Clean up uploaded images if database operation failed
    if (req.files && req.files.length > 0) {
      try {
        const processedImages = await processCarImages(req.files);
        await deleteCarImages(processedImages);
      } catch (cleanupError) {
        console.error('Error cleaning up images:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create car listing',
      error: error.message
    });
  }
});

// Update car listing
router.put('/:id', uploadCarImages, async (req, res) => {
  try {
    const { id } = req.params;
    const existingListing = carListings.get(id);

    if (!existingListing) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found'
      });
    }

    const updateData = { ...req.body };

    // Process new images if uploaded
    let newImages = [];
    if (req.files && req.files.length > 0) {
      try {
        newImages = await processCarImages(req.files);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Failed to process images: ' + error.message
        });
      }
    }

    // Handle image removal
    let currentImages = existingListing.images || [];
    if (updateData.removeImages) {
      try {
        const imagesToRemove = JSON.parse(updateData.removeImages);
        const imagesToDelete = currentImages.filter(img => imagesToRemove.includes(img.id));
        await deleteCarImages(imagesToDelete);
        currentImages = currentImages.filter(img => !imagesToRemove.includes(img.id));
      } catch (error) {
        console.error('Error removing images:', error);
      }
    }

    // Combine existing and new images
    const allImages = [...currentImages, ...newImages];
    
    // Parse JSON fields
    if (updateData.features) {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (error) {
        updateData.features = existingListing.features;
      }
    }
    
    if (updateData.location) {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (error) {
        updateData.location = existingListing.location;
      }
    }

    // Update listing
    const updatedListing = {
      ...existingListing,
      ...updateData,
      images: allImages,
      primaryImage: allImages.length > 0 ? allImages[0].url : null,
      status: 'pending', // Reset to pending for re-approval
      updatedAt: new Date().toISOString()
    };

    // Convert numeric fields
    if (updateData.year) updatedListing.year = parseInt(updateData.year);
    if (updateData.mileage) updatedListing.mileage = parseInt(updateData.mileage);
    if (updateData.price) updatedListing.price = parseFloat(updateData.price);
    if (updateData.negotiable !== undefined) updatedListing.negotiable = updateData.negotiable === 'true';

    carListings.set(id, updatedListing);

    res.json({
      success: true,
      message: 'Car listing updated successfully',
      data: updatedListing
    });
  } catch (error) {
    console.error('Error updating car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update car listing',
      error: error.message
    });
  }
});

// Delete car listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = carListings.get(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found'
      });
    }

    // Delete images from filesystem
    if (listing.images && listing.images.length > 0) {
      try {
        await deleteCarImages(listing.images);
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    }

    // Delete listing from memory
    carListings.delete(id);

    res.json({
      success: true,
      message: 'Car listing deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete car listing',
      error: error.message
    });
  }
});

// Get user's car listings
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let listings = Array.from(carListings.values()).filter(l => l.userId === userId);
    
    if (status) {
      listings = listings.filter(l => l.status === status);
    }

    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Error fetching user car listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user car listings',
      error: error.message
    });
  }
});

// Admin: Approve car listing
router.patch('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = carListings.get(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found'
      });
    }

    listing.status = 'active';
    listing.approvedAt = new Date().toISOString();
    listing.rejectedAt = null;
    listing.rejectionReason = null;

    carListings.set(id, listing);

    res.json({
      success: true,
      message: 'Car listing approved successfully',
      data: listing
    });
  } catch (error) {
    console.error('Error approving car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve car listing',
      error: error.message
    });
  }
});

// Admin: Reject car listing
router.patch('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const listing = carListings.get(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Car listing not found'
      });
    }

    listing.status = 'rejected';
    listing.rejectedAt = new Date().toISOString();
    listing.rejectionReason = reason || 'No reason provided';
    listing.approvedAt = null;

    carListings.set(id, listing);

    res.json({
      success: true,
      message: 'Car listing rejected',
      data: listing
    });
  } catch (error) {
    console.error('Error rejecting car listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject car listing',
      error: error.message
    });
  }
});

export default router;