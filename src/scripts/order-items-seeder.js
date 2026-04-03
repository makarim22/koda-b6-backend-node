import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedOrderItems() {
  try {
    console.log('Starting order items seeding...');

    // Get all products with their variants and sizes
    const productsResult = await pool.query('SELECT id FROM products');
    const productIds = productsResult.rows.map(p => p.id);

    const variantsResult = await pool.query('SELECT id FROM variants');
    const variantIds = variantsResult.rows.map(v => v.id);

    const sizesResult = await pool.query('SELECT id FROM sizes');
    const sizeIds = sizesResult.rows.map(s => s.id);

    const ordersResult = await pool.query('SELECT id, subtotal FROM orders ORDER BY id');
    const orders = ordersResult.rows;

    if (orders.length === 0) {
      console.log('No orders found. Please run the orders seeder first.');
      process.exit(1);
    }

    if (productIds.length === 0 || variantIds.length === 0 || sizeIds.length === 0) {
      console.log('Missing products, variants, or sizes. Please run the product seeders first.');
      process.exit(1);
    }

    // Clear existing order items data
    await pool.query('DELETE FROM order_items');
    console.log('Cleared existing order items data');

    // Create order items
    let totalItemsCreated = 0;
    const orderItemsByOrder = {};

    for (const order of orders) {
      const orderId = order.id;
      const orderSubtotal = parseFloat(order.subtotal);

      // Each order has 1-4 line items
      const itemCount = Math.floor(Math.random() * 4) + 1;
      const itemsForOrder = [];

      // Generate random prices that add up to approximately the order subtotal
      let remainingSubtotal = orderSubtotal;
      let priceDistribution = [];

      for (let i = 0; i < itemCount; i++) {
        if (i === itemCount - 1) {
          // Last item gets the remainder to match order subtotal
          priceDistribution.push(remainingSubtotal);
        } else {
          // Distribute remaining subtotal randomly
          const maxPrice = Math.min(remainingSubtotal * 0.7, 15); // Single item typically $3-$15
          const minPrice = 3;
          const price = parseFloat((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2));
          priceDistribution.push(price);
          remainingSubtotal -= price;
        }
      }

      // Create line items with the distributed prices
      for (let i = 0; i < itemCount; i++) {
        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        const variantId = Math.random() > 0.3 ? variantIds[Math.floor(Math.random() * variantIds.length)] : null; // 70% have variant
        const sizeId = sizeIds[Math.floor(Math.random() * sizeIds.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 qty per item
        const unitPrice = parseFloat((priceDistribution[i] / quantity).toFixed(2));
        const subtotal = parseFloat((unitPrice * quantity).toFixed(2));

        itemsForOrder.push({
          order_id: orderId,
          product_id: productId,
          variant_id: variantId,
          size_id: sizeId,
          quantity,
          unit_price: unitPrice,
          subtotal,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      orderItemsByOrder[orderId] = itemsForOrder;
    }

    // Insert all order items
    for (const [orderId, items] of Object.entries(orderItemsByOrder)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, variant_id, size_id, quantity, unit_price, subtotal, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            item.order_id,
            item.product_id,
            item.variant_id,
            item.size_id,
            item.quantity,
            item.unit_price,
            item.subtotal,
            item.created_at,
            item.updated_at,
          ]
        );
        totalItemsCreated++;
      }
    }

    console.log(`✓ Successfully seeded ${totalItemsCreated} order items`);
    console.log(`  - Total orders: ${orders.length}`);
    console.log(`  - Average items per order: ${(totalItemsCreated / orders.length).toFixed(1)}`);
    console.log(`  - Line items range: 1-4 per order`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding order items:', error.message);
    process.exit(1);
  }
}

seedOrderItems();