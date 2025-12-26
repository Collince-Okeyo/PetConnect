const Pet = require('../models/Pet');

// @desc    Get all pets (Admin only)
// @route   GET /api/admin/pets
// @access  Private/Admin
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({ isActive: true })
      .populate('owner', 'name email phone')
      .populate('petType', 'name icon')
      .populate('temperament', 'name icon')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: pets.length,
      byType: {},
      activeToday: 0 // Placeholder - would need walk data
    };

    // Count pets by type
    pets.forEach(pet => {
      const typeName = pet.petType.name.toLowerCase();
      stats.byType[typeName] = (stats.byType[typeName] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        pets,
        stats
      }
    });
  } catch (error) {
    console.error('Get all pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pets'
    });
  }
};

// @desc    Get pet statistics (Admin only)
// @route   GET /api/admin/pets/stats
// @access  Private/Admin
const getPetStats = async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments({ isActive: true });
    const pets = await Pet.find({ isActive: true }).populate('petType', 'name');

    const statsByType = {};
    pets.forEach(pet => {
      const typeName = pet.petType.name.toLowerCase();
      statsByType[typeName] = (statsByType[typeName] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        total: totalPets,
        byType: statsByType,
        activeToday: 0 // Placeholder
      }
    });
  } catch (error) {
    console.error('Get pet stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

module.exports = {
  getAllPets,
  getPetStats
};
