const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PetType = require('../models/PetType');
const Temperament = require('../models/Temperament');

dotenv.config();

const defaultPetTypes = [
  { name: 'Dog', description: 'Domestic dog', icon: '🐕' },
  { name: 'Cat', description: 'Domestic cat', icon: '🐈' },
  { name: 'Bird', description: 'Pet bird', icon: '🐦' },
  { name: 'Rabbit', description: 'Pet rabbit', icon: '🐰' },
  { name: 'Other', description: 'Other pet types', icon: '🐾' }
];

const defaultTemperaments = [
  { name: 'Calm', description: 'Peaceful and relaxed', icon: '😌' },
  { name: 'Energetic', description: 'Active and playful', icon: '⚡' },
  { name: 'Aggressive', description: 'Can be hostile', icon: '😠' },
  { name: 'Friendly', description: 'Social and welcoming', icon: '😊' },
  { name: 'Shy', description: 'Timid and reserved', icon: '😳' },
  { name: 'Playful', description: 'Loves to play', icon: '🎾' }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await PetType.deleteMany({});
    await Temperament.deleteMany({});
    console.log('Cleared existing data');

    // Seed pet types
    const petTypes = await PetType.insertMany(defaultPetTypes);
    console.log(`✅ Seeded ${petTypes.length} pet types`);

    // Seed temperaments
    const temperaments = await Temperament.insertMany(defaultTemperaments);
    console.log(`✅ Seeded ${temperaments.length} temperaments`);

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
