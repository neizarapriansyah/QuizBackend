require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./core/config');

const connectionString = new URL(config.database.connection);
connectionString.pathname += config.database.name;

const RewardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quota: { type: Number, required: true },
    claimed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Reward = mongoose.model('Reward', RewardSchema);

const rewards = [
  { name: 'Emas 10 gram', quota: 1, claimed: 0 },
  { name: 'Smartphone X', quota: 5, claimed: 0 },
  { name: 'Smartwatch Y', quota: 10, claimed: 0 },
  { name: 'Voucher Rp100.000', quota: 100, claimed: 0 },
  { name: 'Pulsa Rp50.000', quota: 500, claimed: 0 },
];

async function seed() {
  try {
    await mongoose.connect(connectionString.toString());
    console.log('Connected to MongoDB');

    await Reward.deleteMany({});
    console.log('Old rewards cleared');

    await Reward.insertMany(rewards);
    console.log('Rewards seeded successfully!');
    console.table(rewards);
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
