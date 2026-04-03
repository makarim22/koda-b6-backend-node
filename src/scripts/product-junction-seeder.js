import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Coffee keywords to identify coffee products
const coffeeKeywords = ['Espresso', 'Americano', 'Latte', 'Cappuccino', 'Macchiato', 'Flat White', 'Mocha', 'Cortado', 'Ristretto', 'Long Black', 'Cold Brew', 'Iced'];

// Pastry keywords to identify pastry products
const pastryKeywords = ['Croissant', 'Muffin', 'Scone', 'Donut', 'Danish', 'Bagel', 'Cookie', 'Brownie', 'Biscotti', 'Macaron', 'Éclair', 'Tart'];

const isCoffeeProduct = (productName) => {
  return coffeeKeywords.some(keyword => productName.includes(keyword));
};

const seedJunctions = async () => {
  try {
    console.log('🔗 Starting junction tables seeding...\n');

    // Clear existing junction data
    await pool.query('TRUNCATE TABLE product_variant, product_sizes RESTART IDENTITY CASCADE');

    // Fetch all products, variants, and sizes
    const productsResult = await pool.query('SELECT id, product_name FROM products');
    const variantsResult = await pool.query('SELECT id FROM variants');
    const sizesResult = await pool.query('SELECT id FROM sizes');

    const products = productsResult.rows;
    const variants = variantsResult.rows;
    const sizes = sizesResult.rows;

    console.log(`📦 Found ${products.length} products`);
    console.log(`🎨 Found ${variants.length} variants`);
    console.log(`📏 Found ${sizes.length} sizes\n`);

    // Separate variants and sizes by type
    // Assuming first 10 variants are coffee, next 10 are pastry
    // Assuming first 4 sizes are coffee, next 4 are pastry
    const coffeeVariants = variants.slice(0, 10);
    const pastryVariants = variants.slice(10, 20);
    const coffeeSizes = sizes.slice(0, 4);
    const pastrySizes = sizes.slice(4, 8);

    // Assign variants to each product
    console.log('🔗 Linking products with variants...');
    for (const product of products) {
      const isCoffee = isCoffeeProduct(product.product_name);
      const applicableVariants = isCoffee ? coffeeVariants : pastryVariants;
      const randomVariantCount = Math.floor(Math.random() * 3) + 2; // 2-4 variants per product
      const selectedVariants = new Set();

      while (selectedVariants.size < randomVariantCount && selectedVariants.size < applicableVariants.length) {
        const randomVariant = applicableVariants[Math.floor(Math.random() * applicableVariants.length)];
        selectedVariants.add(randomVariant.id);
      }

      for (const variantId of selectedVariants) {
        await pool.query(
          'INSERT INTO product_variant (product_id, variant_id) VALUES ($1, $2)',
          [product.id, variantId]
        );
      }
      const type = isCoffee ? '☕' : '🥐';
      console.log(`  ${type} ${product.product_name}: ${selectedVariants.size} variants assigned`);
    }

    // Assign sizes to each product
    console.log('\n🔗 Linking products with sizes...');
    for (const product of products) {
      const isCoffee = isCoffeeProduct(product.product_name);
      const applicableSizes = isCoffee ? coffeeSizes : pastrySizes;
      const randomSizeCount = Math.floor(Math.random() * 2) + 2; // 2-3 sizes per product
      const selectedSizes = new Set();

      while (selectedSizes.size < randomSizeCount && selectedSizes.size < applicableSizes.length) {
        const randomSize = applicableSizes[Math.floor(Math.random() * applicableSizes.length)];
        selectedSizes.add(randomSize.id);
      }

      for (const sizeId of selectedSizes) {
        await pool.query(
          'INSERT INTO product_sizes (product_id, size_id) VALUES ($1, $2)',
          [product.id, sizeId]
        );
      }
      const type = isCoffee ? '☕' : '🥐';
      console.log(`  ${type} ${product.product_name}: ${selectedSizes.size} sizes assigned`);
    }

    console.log('\n✅ Junction tables seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedJunctions();
