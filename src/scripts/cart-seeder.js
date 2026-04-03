import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedCart() {
  try {
    console.log('Starting cart seeding...');

    // Get all users (customers)
    const usersResult = await pool.query('SELECT id FROM users');
    const userIds = usersResult.rows.map(u => u.id);

    if (userIds.length === 0) {
      console.log('No users found. Please run the original seeder first.');
      process.exit(1);
    }

    // Get all products
    const productsResult = await pool.query('SELECT id FROM products');
    const productIds = productsResult.rows.map(p => p.id);

    if (productIds.length === 0) {
      console.log('No products found. Please run the original seeder first.');
      process.exit(1);
    }

    // Get all sizes
    const sizesResult = await pool.query('SELECT id FROM sizes');
    const sizeIds = sizesResult.rows.map(s => s.id);

    if (sizeIds.length === 0) {
      console.log('No sizes found. Please run the variant-size seeder first.');
      process.exit(1);
    }

    // Get all variants
    const variantsResult = await pool.query('SELECT id FROM variants');
    const variantIds = variantsResult.rows.map(v => v.id);

    if (variantIds.length === 0) {
      console.log('No variants found. Please run the variant-size seeder first.');
      process.exit(1);
    }

    // Clear existing cart data
    await pool.query('DELETE FROM cart');
    console.log('Cleared existing cart data');

    // Create cart items
    const cartItems = [];
    const cartItemsPerCustomer = 3; // Each customer gets 2-4 items in cart

    for (let i = 0; i < userIds.length; i++) {
      const customerId = userIds[i];
      const itemsCount = Math.floor(Math.random() * 3) + 2; // 2-4 items per customer

      for (let j = 0; j < itemsCount; j++) {
        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const sizeId = sizeIds[Math.floor(Math.random() * sizeIds.length)];
        const variantId = variantIds[Math.floor(Math.random() * variantIds.length)];
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity

        const createdAt = new Date();

        cartItems.push({
          customer_id: customerId,
          product_id: productId,
          size_id: sizeId,
          variant_id: variantId,
          quantity,
          created_at: createdAt,
        });
      }
    }

    // Insert cart items
    for (const item of cartItems) {
      await pool.query(
        `INSERT INTO cart (customer_id, product_id, size_id, variant_id, quantity, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.customer_id,
          item.product_id,
          item.size_id,
          item.variant_id,
          item.quantity,
          item.created_at,
        ]
      );
    }

    console.log(`✓ Successfully seeded ${cartItems.length} cart items`);
    console.log(`  - Customers with items: ${userIds.length}`);
    console.log(`  - Average items per customer: ${(cartItems.length / userIds.length).toFixed(1)}`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding cart:', error.message);
    await pool.end();
    process.exit(1);
  }
}

seedCart();
