import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// Configure multer for memory storage (we'll process images before saving)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  }
});

// Ensure upload directory exists
const ensureUploadDir = async (dir) => {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Process and save images
export const processCarImages = async (files) => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'cars');
  await ensureUploadDir(uploadDir);
  
  const processedImages = [];
  
  for (const file of files) {
    const imageId = uuidv4();
    const filename = `${imageId}.webp`;
    const filepath = path.join(uploadDir, filename);
    
    try {
      // Process image: resize, compress, and convert to webp
      await sharp(file.buffer)
        .resize(1200, 900, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ quality: 85 })
        .toFile(filepath);
      
      // Create thumbnail
      const thumbnailFilename = `${imageId}_thumb.webp`;
      const thumbnailPath = path.join(uploadDir, thumbnailFilename);
      
      await sharp(file.buffer)
        .resize(300, 225, { 
          fit: 'cover'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);
      
      processedImages.push({
        id: imageId,
        originalName: file.originalname,
        filename,
        thumbnailFilename,
        url: `/uploads/cars/${filename}`,
        thumbnailUrl: `/uploads/cars/${thumbnailFilename}`,
        size: file.size
      });
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error(`Failed to process image: ${file.originalname}`);
    }
  }
  
  return processedImages;
};

// Delete car images
export const deleteCarImages = async (images) => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'cars');
  
  for (const image of images) {
    try {
      const imagePath = path.join(uploadDir, image.filename);
      const thumbPath = path.join(uploadDir, image.thumbnailFilename);
      
      await fs.unlink(imagePath).catch(() => {}); // Ignore if file doesn't exist
      await fs.unlink(thumbPath).catch(() => {}); // Ignore if file doesn't exist
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};

export const uploadCarImages = upload.array('images', 10);