const Pet = require('../models/Pet');
const { validationResult } = require('express-validator');

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const petData = {
      ...req.body,
      owner: req.user.id
    };

    const pet = await Pet.create(petData);

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      data: {
        pet
      }
    });
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during pet creation'
    });
  }
};

// @desc    Get user's pets
// @route   GET /api/pets
// @access  Private
const getUserPets = async (req, res) => {
  try {
    const pets = await Pet.find({ 
      owner: req.user.id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        pets
      }
    });
  } catch (error) {
    console.error('Get user pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Private
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email phone');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet or is authorized to view it
    if (pet.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this pet'
      });
    }

    res.json({
      success: true,
      data: {
        pet
      }
    });
  } catch (error) {
    console.error('Get pet by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pet'
      });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Pet updated successfully',
      data: {
        pet: updatedPet
      }
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during pet update'
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pet'
      });
    }

    // Soft delete - mark as inactive
    pet.isActive = false;
    await pet.save();

    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during pet deletion'
    });
  }
};

// @desc    Upload pet photo
// @route   POST /api/pets/:id/upload-photo
// @access  Private
const uploadPetPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload photo for this pet'
      });
    }

    // Add photo to pet's photos array
    pet.photos.push({
      url: req.file.path,
      caption: req.body.caption || '',
      uploadedAt: new Date()
    });

    await pet.save();

    res.json({
      success: true,
      message: 'Pet photo uploaded successfully',
      data: {
        pet
      }
    });
  } catch (error) {
    console.error('Upload pet photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during photo upload'
    });
  }
};

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccinations
// @access  Private
const addVaccination = async (req, res) => {
  try {
    const { name, date, nextDue, veterinarian } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add vaccination for this pet'
      });
    }

    pet.vaccinations.push({
      name,
      date: new Date(date),
      nextDue: nextDue ? new Date(nextDue) : null,
      veterinarian
    });

    await pet.save();

    res.json({
      success: true,
      message: 'Vaccination record added successfully',
      data: {
        pet
      }
    });
  } catch (error) {
    console.error('Add vaccination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vaccination addition'
    });
  }
};

// @desc    Add medical history
// @route   POST /api/pets/:id/medical-history
// @access  Private
const addMedicalHistory = async (req, res) => {
  try {
    const { condition, treatment, date, veterinarian, notes } = req.body;

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add medical history for this pet'
      });
    }

    pet.medicalHistory.push({
      condition,
      treatment,
      date: new Date(date),
      veterinarian,
      notes
    });

    await pet.save();

    res.json({
      success: true,
      message: 'Medical history added successfully',
      data: {
        pet
      }
    });
  } catch (error) {
    console.error('Add medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during medical history addition'
    });
  }
};

module.exports = {
  addPet,
  getUserPets,
  getPetById,
  updatePet,
  deletePet,
  uploadPetPhoto,
  addVaccination,
  addMedicalHistory
};
