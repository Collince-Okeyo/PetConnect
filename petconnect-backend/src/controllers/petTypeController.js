const PetType = require('../models/PetType');
const Pet = require('../models/Pet');

// @desc    Get all pet types
// @route   GET /api/pet-types
// @access  Public
const getPetTypes = async (req, res) => {
  try {
    const petTypes = await PetType.find().sort({ name: 1 });
    
    res.json({
      success: true,
      data: {
        petTypes
      }
    });
  } catch (error) {
    console.error('Get pet types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get active pet types only
// @route   GET /api/pet-types/active
// @access  Public
const getActivePetTypes = async (req, res) => {
  try {
    const petTypes = await PetType.getActiveTypes();
    
    res.json({
      success: true,
      data: {
        petTypes
      }
    });
  } catch (error) {
    console.error('Get active pet types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new pet type
// @route   POST /api/pet-types
// @access  Private/Admin
const createPetType = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if pet type already exists
    const existingType = await PetType.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Pet type already exists'
      });
    }

    const petType = await PetType.create({
      name,
      description,
      icon: icon || '🐾'
    });

    res.status(201).json({
      success: true,
      message: 'Pet type created successfully',
      data: {
        petType
      }
    });
  } catch (error) {
    console.error('Create pet type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update pet type
// @route   PUT /api/pet-types/:id
// @access  Private/Admin
const updatePetType = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const petType = await PetType.findById(req.params.id);
    if (!petType) {
      return res.status(404).json({
        success: false,
        message: 'Pet type not found'
      });
    }

    // Check if new name conflicts with existing
    if (name && name !== petType.name) {
      const existingType = await PetType.findOne({ 
        name: new RegExp(`^${name}$`, 'i'),
        _id: { $ne: req.params.id }
      });
      if (existingType) {
        return res.status(400).json({
          success: false,
          message: 'Pet type name already exists'
        });
      }
    }

    petType.name = name || petType.name;
    petType.description = description !== undefined ? description : petType.description;
    petType.icon = icon || petType.icon;

    await petType.save();

    res.json({
      success: true,
      message: 'Pet type updated successfully',
      data: {
        petType
      }
    });
  } catch (error) {
    console.error('Update pet type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete pet type
// @route   DELETE /api/pet-types/:id
// @access  Private/Admin
const deletePetType = async (req, res) => {
  try {
    const petType = await PetType.findById(req.params.id);
    if (!petType) {
      return res.status(404).json({
        success: false,
        message: 'Pet type not found'
      });
    }

    // Check if any pets are using this type
    const petCount = await Pet.countDocuments({ petType: req.params.id });
    if (petCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete pet type. ${petCount} pet(s) are using this type.`
      });
    }

    await petType.deleteOne();

    res.json({
      success: true,
      message: 'Pet type deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle pet type status
// @route   PATCH /api/pet-types/:id/toggle
// @access  Private/Admin
const togglePetTypeStatus = async (req, res) => {
  try {
    const petType = await PetType.findById(req.params.id);
    if (!petType) {
      return res.status(404).json({
        success: false,
        message: 'Pet type not found'
      });
    }

    petType.isActive = !petType.isActive;
    await petType.save();

    res.json({
      success: true,
      message: `Pet type ${petType.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        petType
      }
    });
  } catch (error) {
    console.error('Toggle pet type status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPetTypes,
  getActivePetTypes,
  createPetType,
  updatePetType,
  deletePetType,
  togglePetTypeStatus
};
