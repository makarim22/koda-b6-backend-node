import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Coffee & Pastry Variants (20 total)
const variants = [
  // Coffee Variants (10)
  { name: 'Original', additionalPrice: 0 },
  { name: 'Dengan Susu', additionalPrice: 5000 },
  { name: 'Dengan Coklat', additionalPrice: 8000 },
  { name: 'Triple Shot', additionalPrice: 12000 },
  { name: 'Sugar Free', additionalPrice: 3000 },
  { name: 'Dengan Karamel', additionalPrice: 7000 },
  { name: 'Dengan Vanilla', additionalPrice: 6000 },
  { name: 'Double Shot', additionalPrice: 8000 },
  { name: 'Extra Foam', additionalPrice: 2000 },
  { name: 'Dengan Hazelnut', additionalPrice: 7000 },
  // Pastry Variants (10)
  { name: 'Plain', additionalPrice: 0 },
  { name: 'Dengan Cream Cheese', additionalPrice: 10000 },
  { name: 'Dengan Chocolate Spread', additionalPrice: 8000 },
  { name: 'Vegan', additionalPrice: 5000 },
  { name: 'Keto', additionalPrice: 12000 },
  { name: 'Gluten Free', additionalPrice: 15000 },
  { name: 'Dengan Filling Buah', additionalPrice: 7000 },
  { name: 'Extra Toping', additionalPrice: 6000 },
  { name: 'Dengan Almond', additionalPrice: 8000 },
  { name: 'Dengan Moka', additionalPrice: 9000 }
];

// Sizes
const sizes = [
  { name: 'Small', additionalPrice: 0 },
  { name: 'Medium', additionalPrice: 5000 },
  { name: 'Large', additionalPrice: 10000 },
  { name: 'Extra Large', additionalPrice: 15000 },
  { name: 'Individual', additionalPrice: 0 },
  { name: 'Small Box', additionalPrice: 8000 },
  { name: 'Medium Box', additionalPrice: 15000 },
  { name: 'Large Box', additionalPrice: 25000 }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting variants and sizes seeding...\n');

    // Clear existing data
    await pool.query('TRUNCATE TABLE variants, sizes RESTART IDENTITY CASCADE');

    // Seed Variants (20 total)
    console.log('🎨 Generating variants...');
    for (const variant of variants) {
      await pool.query(
        'INSERT INTO variants (name, additional_price) VALUES ($1, $2)',
        [variant.name, variant.additionalPrice]
      );
      console.log(`  ✓ ${variant.name} - Additional Price: Rp${variant.additionalPrice.toLocaleString('id-ID')}`);
    }

    // Seed Sizes (8 total)
    console.log('\n📏 Generating sizes...');
    for (const size of sizes) {
      await pool.query(
        'INSERT INTO sizes (name, additional_price) VALUES ($1, $2)',
        [size.name, size.additionalPrice]
      );
      console.log(`  ✓ ${size.name} - Additional Price: Rp${size.additionalPrice.toLocaleString('id-ID')}`);
    }

    console.log('\n✅ Variants and sizes seeded successfully!');
    console.log(`  - 20 variants created`);
    console.log(`  - 8 sizes created\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
