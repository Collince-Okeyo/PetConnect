const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Check if Cloudinary credentials are available
const hasCloudinaryCredentials = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryCredentials) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured successfully');
} else {
  console.log('⚠️  Cloudinary credentials not found - using local storage for verification documents');
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/verification');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
let idStorage, selfieStorage;

if (hasCloudinaryCredentials) {
  // Use Cloudinary storage
  idStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'verification_documents/ids',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' }
      ]
    }
  });

  selfieStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'verification_documents/selfies',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    }
  });
} else {
  // Use local disk storage as fallback
  idStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadsDir, 'ids'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'id-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  selfieStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadsDir, 'selfies'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'selfie-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  // Create subdirectories
  ['ids', 'selfies'].forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

// Multer upload middleware
const uploadId = multer({
  storage: idStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const uploadSelfie = multer({
  storage: selfieStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// Delete image from Cloudinary or local storage
const deleteImage = async (imageUrl) => {
  try {
    if (hasCloudinaryCredentials && imageUrl.includes('cloudinary')) {
      // Delete from Cloudinary
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split('.')[0];
      const folder = urlParts.slice(-3, -1).join('/');
      const fullPublicId = `${folder}/${publicId}`;
      
      await cloudinary.uploader.destroy(fullPublicId);
      return { success: true };
    } else {
      // Delete from local storage
      const filename = path.basename(imageUrl);
      const filepath = path.join(uploadsDir, filename.startsWith('id-') ? 'ids' : 'selfies', filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      return { success: true };
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  cloudinary: hasCloudinaryCredentials ? cloudinary : null,
  uploadId,
  uploadSelfie,
  deleteImage,
  hasCloudinaryCredentials
};
