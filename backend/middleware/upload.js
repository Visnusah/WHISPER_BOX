import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
const profileImagesDir = path.join(uploadsDir, 'profile-images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir, { recursive: true });
}

// Configure multer for profile image uploads
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and user ID
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `profile-${req.user.id}-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

// Create multer upload instances
export const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFileFilter
});

// Helper function to delete old profile image
export const deleteOldProfileImage = (imagePath) => {
  if (imagePath && imagePath !== '/uploads/profile-images/default-avatar.png') {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/uploads/profile-images/default-avatar.png';
  }
  return imagePath.startsWith('/uploads') ? imagePath : `/uploads/profile-images/${imagePath}`;
};
