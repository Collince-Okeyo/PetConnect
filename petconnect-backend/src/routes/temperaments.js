const express = require('express');
const router = express.Router();
const {
  getTemperaments,
  getActiveTemperaments,
  createTemperament,
  updateTemperament,
  deleteTemperament,
  toggleTemperamentStatus
} = require('../controllers/temperamentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTemperaments);
router.get('/active', getActiveTemperaments);

// Admin routes
router.post('/', protect, authorize('admin'), createTemperament);
router.put('/:id', protect, authorize('admin'), updateTemperament);
router.delete('/:id', protect, authorize('admin'), deleteTemperament);
router.patch('/:id/toggle', protect, authorize('admin'), toggleTemperamentStatus);

module.exports = router;
