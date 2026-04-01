
import pool from '../db/index.js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker/locale/id_ID';
import argon2 from 'argon2';

dotenv.config();

const coffeeTypes = [
  'Espresso', 'Americano', 'Latte', 'Cappuccino', 'Macchiato',
  'Flat White', 'Mocha', 'Cortado', 'Ristretto', 'Long Black',
  'Cold Brew', 'Iced Latte', 'Iced Cappuccino', 'Affogato'
];

const flavorModifiers = [
  'Vanilla', 'Caramel', 'Hazelnut', 'Cinnamon', 'Honey',
  'Maple', 'Coconut', 'Almond', 'Mocha', 'Chocolate'
];

const coffeeOrigins = [
  'Ethiopian', 'Colombian', 'Brazilian', 'Kenyan', 'Indonesian',
  'Costa Rican', 'Guatemalan', 'Rwandan', 'Tanzanian', 'Vietnamese'
];

const pastryTypes = [
  'Croissant', 'Muffin', 'Scone', 'Donut', 'Danish', 'Bagel',
  'Cookie', 'Brownie', 'Biscotti', 'Macaron', 'Éclair', 'Tart'
];

const pastryFlavors = [
  'Chocolate', 'Blueberry', 'Vanilla', 'Strawberry', 'Almond',
  'Cinnamon', 'Lemon', 'Raspberry', 'Honey', 'Espresso', 'Pistachio', 'Caramel'
];

const coffeeDescriptions = {
  'Espresso': 'Bold and concentrated espresso shot, perfect for a quick caffeine boost or as a base for other drinks.',
  'Americano': 'Smooth and strong espresso with hot water, delivering a full-bodied coffee experience.',
  'Latte': 'Creamy blend of espresso and steamed milk with a thin layer of foam.',
  'Cappuccino': 'Classic Italian coffee with equal parts espresso, steamed milk, and rich foam.',
  'Macchiato': 'Espresso marked with a small amount of foamed milk for a bold yet smooth taste.',
  'Flat White': 'Velvety microfoam milk combined with espresso for a silky, refined coffee.',
  'Mocha': 'Rich chocolate blended with espresso and steamed milk, a favorite for chocolate lovers.',
  'Cortado': 'Equal parts espresso and steamed milk, perfectly balanced and smooth.',
  'Ristretto': 'Concentrated espresso shot with a bold, intense flavor profile.',
  'Long Black': 'Similar to Americano, espresso topped with hot water for a longer drink.',
  'Cold Brew': 'Smooth, chilled coffee brewed overnight for a refreshing, less acidic taste.',
  'Iced Latte': 'Cool and creamy latte served over ice, perfect for warm days.',
  'Iced Cappuccino': 'Chilled cappuccino with espresso and frothy milk, great iced alternative.',
  'Affogato': 'Vanilla ice cream topped with hot espresso for a delightful dessert coffee.'
};

const generateProduct = () => {
  const isOrigin = faker.datatype.boolean();
  const hasModifier = faker.datatype.boolean();
  
  let name = '';
  let description = '';
  let priceRange = [10000, 100000];
  
  if (isOrigin) {
    const origin = faker.helpers.arrayElement(coffeeOrigins);
    const type = faker.helpers.arrayElement(coffeeTypes);
    name = `${origin} ${type}`;
    description = `Premium ${origin.toLowerCase()} ${type.toLowerCase()} beans with rich, complex flavor notes. Expertly roasted to bring out the best characteristics of these high-altitude beans.`;
    priceRange = [45000, 65000];
  } else if (hasModifier) {
    const modifier = faker.helpers.arrayElement(flavorModifiers);
    const type = faker.helpers.arrayElement(coffeeTypes);
    name = `${modifier} ${type}`;
    description = `Delicious ${type.toLowerCase()} infused with smooth ${modifier.toLowerCase()} flavor. A perfect blend for those who love a touch of sweetness in their coffee.`;
    priceRange = [45000, 60000];
  } else {
    name = faker.helpers.arrayElement(coffeeTypes);
    description = coffeeDescriptions[name] || `Expertly crafted ${name.toLowerCase()} coffee made with premium beans and precision.`;
    priceRange = [30000, 45000];
  }
  
  const [minPrice, maxPrice] = priceRange;
  const basePrice = Math.round((Math.random() * (maxPrice - minPrice) + minPrice) / 100) * 100;
  
  return {
    name,
    description,
    basePrice,
    stock: faker.number.int({ min: 40, max: 250 })
  };
};

const pastryDescriptions = {
  'Chocolate Croissant': 'Buttery, flaky croissant with rich chocolate bars inside. A French classic that is crispy outside and tender within.',
  'Blueberry Muffin': 'Moist blueberry muffin loaded with fresh berries and a light, fluffy crumb.',
  'Vanilla Scone': 'Traditional English scone with subtle vanilla flavor, perfect with jam and cream.',
  'Cinnamon Donut': 'Soft glazed donut rolled in warm cinnamon sugar, a morning favorite.',
  'Chocolate Cookie': 'Chewy chocolate chip cookies made with premium dark chocolate pieces.',
  'Honey Brownie': 'Dense, fudgy brownie with a hint of honey for added sweetness.',
  'Caramel Tart': 'Crispy pastry shell filled with smooth caramel custard, topped with sea salt.'
};

const generatePastry = () => {
  const pastryType = faker.helpers.arrayElement(pastryTypes);
  const flavor = faker.helpers.arrayElement(pastryFlavors);
  const name = `${flavor} ${pastryType}`;
  
  let description = pastryDescriptions[name];
  if (!description) {
    description = `Fresh-baked ${flavor.toLowerCase()} ${pastryType.toLowerCase()} made daily with premium ingredients. Perfect with coffee.`;
  }
  const basePrice = Math.round((Math.random() * (35000 - 10000) + 10000) / 100) * 100;
  const stock = faker.number.int({ min: 10, max: 80 });
  
  return { name, description, basePrice, stock };
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed with Faker.js...\n');

    // Clear existing data
    await pool.query('TRUNCATE TABLE products, users RESTART IDENTITY CASCADE');

    // Generate 5 random users with hashed passwords
    console.log('📝 Generating users...');
    for (let i = 0; i < 50; i++) {
      const fullName = faker.person.fullName();
      // Generate email from the user's name for consistency
      const nameParts = fullName.toLowerCase().split(' ');
      const emailBase = nameParts.join('.');
      const email = `${emailBase}@coffeeshop.id`;
      const password = await argon2.hash('password123');
      
      await pool.query(
        'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)',
        [fullName, email, password]
      );
      console.log(`  ✓ ${fullName} (${email})`);
    }

    // Generate 20 random coffee products
    console.log('\n☕ Generating coffee products...');
    for (let i = 0; i < 20; i++) {
      const product = generateProduct();
      
      await pool.query(
        'INSERT INTO products (product_name, description, stock, base_price) VALUES ($1, $2, $3, $4)',
        [product.name, product.description, product.stock, product.basePrice]
      );
      console.log(`  ✓ ${product.name} - Stock: ${product.stock}, Price: Rp${product.basePrice.toLocaleString('id-ID')}`);
    }

    // Generate 15 random pastries
    console.log('\n🥐 Generating pastries...');
    for (let i = 0; i < 15; i++) {
      const pastry = generatePastry();
      
      await pool.query(
        'INSERT INTO products (product_name, description, stock, base_price) VALUES ($1, $2, $3, $4)',
        [pastry.name, pastry.description, pastry.stock, pastry.basePrice]
      );
      console.log(`  ✓ ${pastry.name} - Stock: ${pastry.stock}, Price: Rp${pastry.basePrice.toLocaleString('id-ID')}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`  - 50 users created`);
    console.log(`  - 20 coffee products created`);
    console.log(`  - 15 pastries created (35 total products)\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();