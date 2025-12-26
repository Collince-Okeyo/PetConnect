const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllPets,
  getPetStats
} = require('../controllers/adminPetController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/pets
// @desc    Get all pets in the system
// @access  Private/Admin
router.get('/pets', getAllPets);

// @route   GET /api/admin/pets/stats
// @desc    Get pet statistics
// @access  Private/Admin
router.get('/pets/stats', getPetStats);

module.exports = router;
