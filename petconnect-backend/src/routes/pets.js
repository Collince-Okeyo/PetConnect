const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  addPet,
  getUserPets,
  getPetById,
  updatePet,
  deletePet,
  uploadPetPhoto,
  addVaccination,
  addMedicalHistory
} = require('../controllers/petController');
const { protect } = require('../middleware/auth');
const { validatePet, validateObjectId } = require('../middleware/validation');

// Configure multer for pet photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pets/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/pets
// @desc    Add a new pet
// @access  Private
router.post('/', protect, validatePet, addPet);

// @route   GET /api/pets
// @desc    Get user's pets
// @access  Private
router.get('/', protect, getUserPets);

// @route   GET /api/pets/:id
// @desc    Get pet by ID
// @access  Private
router.get('/:id', protect, validateObjectId('id'), getPetById);

// @route   PUT /api/pets/:id
// @desc    Update pet
// @access  Private
router.put('/:id', protect, validateObjectId('id'), validatePet, updatePet);

// @route   DELETE /api/pets/:id
// @desc    Delete pet
// @access  Private
router.delete('/:id', protect, validateObjectId('id'), deletePet);

// @route   POST /api/pets/:id/upload-photo
// @desc    Upload pet photo
// @access  Private
router.post('/:id/upload-photo', protect, validateObjectId('id'), upload.single('photo'), uploadPetPhoto);

// @route   POST /api/pets/:id/vaccinations
// @desc    Add vaccination record
// @access  Private
router.post('/:id/vaccinations', protect, validateObjectId('id'), addVaccination);

// @route   POST /api/pets/:id/medical-history
// @desc    Add medical history
// @access  Private
router.post('/:id/medical-history', protect, validateObjectId('id'), addMedicalHistory);

module.exports = router;
