import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const discountDescriptions = [
  'Weekend Special - Enjoy 20% off all coffee drinks',
  'Flash Sale - Limited time offer on selected pastries',
  'Member Exclusive - Extra discount for loyalty members',
  'Buy 2 Get 1 Free - Perfect for sharing with friends',
  'Happy Hour Special - Early morning discount',
  'Bundle Deal - Save more when you buy together',
  'New Customer Welcome - Special first-time buyer discount',
  'Seasonal Promo - Fresh flavors at lower prices',
  'Clearance Sale - Make room for new items',
  'Student Discount - Show valid ID for extra savings',
  'Senior Citizen Special - Exclusive discount for 60+',
  'Birthday Month Treat - Extra discount on your special month',
  'Referral Reward - Bring a friend and save',
  'Social Media Exclusive - Follow us for special codes',
  'Combo Offer - Save when paired with another item'
];

const generateDiscount = () => {
  // Generate random discount rate between 5% and 50%
  const discountRate = Math.floor(Math.random() * (50 - 5 + 1) + 5);
  
  // 40% chance of being a flash sale
  const isFlashSale = Math.random() < 0.4;
  
  // Pick random description
  const description = discountDescriptions[
    Math.floor(Math.random() * discountDescriptions.length)
  ];
  
  return {
    discountRate,
    description,
    isFlashSale
  };
};

const seedDatabase = async () => {
  try {
    console.log('🎉 Starting product discount seeder...\n');

    // Get all products
    const productsResult = await pool.query('SELECT id FROM products ORDER BY id');
    const products = productsResult.rows;

    if (products.length === 0) {
      console.error('❌ No products found. Run product seeder first!');
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products\n`);

    // Clear existing discounts
    await pool.query('TRUNCATE TABLE product_discount RESTART IDENTITY CASCADE');
    console.log('🗑️  Cleared existing discounts\n');

    // Generate discounts for 60% of products
    const discountCount = Math.ceil(products.length * 0.6);
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    const productsWithDiscount = shuffledProducts.slice(0, discountCount);

    console.log(`💰 Generating ${productsWithDiscount.length} discounts...\n`);

    for (const product of productsWithDiscount) {
      const discount = generateDiscount();
      
      const flashSaleLabel = discount.isFlashSale ? '⚡ FLASH' : '📌 REGULAR';
      
      await pool.query(
        'INSERT INTO product_discount (product_id, discount_rate, description, is_flash_sale) VALUES ($1, $2, $3, $4)',
        [product.id, discount.discountRate, discount.description, discount.isFlashSale]
      );
      
      console.log(
        `  ✓ Product ID ${product.id} - ${discount.discountRate}% off - ${flashSaleLabel}`
      );
    }

    const flashSaleCount = productsWithDiscount.filter(p => {
      const discount = generateDiscount();
      return discount.isFlashSale;
    }).length;

    console.log('\n✅ Discount seeding completed!');
    console.log(`  - ${productsWithDiscount.length} products with discounts`);
    console.log(`  - ${products.length - productsWithDiscount.length} products without discounts`);
    console.log(`\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();