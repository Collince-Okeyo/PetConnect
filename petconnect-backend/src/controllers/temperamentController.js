const Temperament = require('../models/Temperament');
const Pet = require('../models/Pet');

// @desc    Get all temperaments
// @route   GET /api/temperaments
// @access  Public
const getTemperaments = async (req, res) => {
  try {
    const temperaments = await Temperament.find().sort({ name: 1 });
    
    res.json({
      success: true,
      data: {
        temperaments
      }
    });
  } catch (error) {
    console.error('Get temperaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get active temperaments only
// @route   GET /api/temperaments/active
// @access  Public
const getActiveTemperaments = async (req, res) => {
  try {
    const temperaments = await Temperament.getActiveTemperaments();
    
    res.json({
      success: true,
      data: {
        temperaments
      }
    });
  } catch (error) {
    console.error('Get active temperaments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new temperament
// @route   POST /api/temperaments
// @access  Private/Admin
const createTemperament = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if temperament already exists
    const existingTemperament = await Temperament.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingTemperament) {
      return res.status(400).json({
        success: false,
        message: 'Temperament already exists'
      });
    }

    const temperament = await Temperament.create({
      name,
      description,
      icon: icon || '😊'
    });

    res.status(201).json({
      success: true,
      message: 'Temperament created successfully',
      data: {
        temperament
      }
    });
  } catch (error) {
    console.error('Create temperament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update temperament
// @route   PUT /api/temperaments/:id
// @access  Private/Admin
const updateTemperament = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const temperament = await Temperament.findById(req.params.id);
    if (!temperament) {
      return res.status(404).json({
        success: false,
        message: 'Temperament not found'
      });
    }

    // Check if new name conflicts with existing
    if (name && name !== temperament.name) {
      const existingTemperament = await Temperament.findOne({ 
        name: new RegExp(`^${name}$`, 'i'),
        _id: { $ne: req.params.id }
      });
      if (existingTemperament) {
        return res.status(400).json({
          success: false,
          message: 'Temperament name already exists'
        });
      }
    }

    temperament.name = name || temperament.name;
    temperament.description = description !== undefined ? description : temperament.description;
    temperament.icon = icon || temperament.icon;

    await temperament.save();

    res.json({
      success: true,
      message: 'Temperament updated successfully',
      data: {
        temperament
      }
    });
  } catch (error) {
    console.error('Update temperament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete temperament
// @route   DELETE /api/temperaments/:id
// @access  Private/Admin
const deleteTemperament = async (req, res) => {
  try {
    const temperament = await Temperament.findById(req.params.id);
    if (!temperament) {
      return res.status(404).json({
        success: false,
        message: 'Temperament not found'
      });
    }

    // Check if any pets are using this temperament
    const petCount = await Pet.countDocuments({ temperament: req.params.id });
    if (petCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete temperament. ${petCount} pet(s) have this temperament.`
      });
    }

    await temperament.deleteOne();

    res.json({
      success: true,
      message: 'Temperament deleted successfully'
    });
  } catch (error) {
    console.error('Delete temperament error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle temperament status
// @route   PATCH /api/temperaments/:id/toggle
// @access  Private/Admin
const toggleTemperamentStatus = async (req, res) => {
  try {
    const temperament = await Temperament.findById(req.params.id);
    if (!temperament) {
      return res.status(404).json({
        success: false,
        message: 'Temperament not found'
      });
    }

    temperament.isActive = !temperament.isActive;
    await temperament.save();

    res.json({
      success: true,
      message: `Temperament ${temperament.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        temperament
      }
    });
  } catch (error) {
    console.error('Toggle temperament status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTemperaments,
  getActiveTemperaments,
  createTemperament,
  updateTemperament,
  deleteTemperament,
  toggleTemperamentStatus
};
