const express = require('express');
const router = express.Router();
const {
  getPetTypes,
  getActivePetTypes,
  createPetType,
  updatePetType,
  deletePetType,
  togglePetTypeStatus
} = require('../controllers/petTypeController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPetTypes);
router.get('/active', getActivePetTypes);

// Admin routes
router.post('/', protect, authorize('admin'), createPetType);
router.put('/:id', protect, authorize('admin'), updatePetType);
router.delete('/:id', protect, authorize('admin'), deletePetType);
router.patch('/:id/toggle', protect, authorize('admin'), togglePetTypeStatus);

module.exports = router;
