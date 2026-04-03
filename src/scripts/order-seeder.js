import pool from '../db/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedOrders() {
  try {
    console.log('Starting orders seeding...');

    // Get all users (customers)
    const usersResult = await pool.query('SELECT id FROM users');
    const userIds = usersResult.rows.map(u => u.id);

    if (userIds.length === 0) {
      console.log('No users found. Please run the original seeder first.');
      process.exit(1);
    }

    // Clear existing orders data
    await pool.query('DELETE FROM orders');
    console.log('Cleared existing orders data');

    // Create orders
    const orders = [];
    const ordersPerCustomer = 3; // Each customer gets 2-5 orders

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    for (let i = 0; i < userIds.length; i++) {
      const customerId = userIds[i];
      const ordersCount = Math.floor(Math.random() * 4) + 2; // 2-5 orders per customer

      for (let j = 0; j < ordersCount; j++) {
        const subtotal = parseFloat((Math.random() * 150 + 20).toFixed(2)); // $20-$170
        const tax = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
        const deliveryFee = Math.random() > 0.3 ? 5.0 : 0; // 70% chance of delivery fee, otherwise free shipping
        const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

        // Random order date within last 6 months
        const daysAgo = Math.floor(Math.random() * 180);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const createdAt = new Date();
        const updatedAt = new Date();

        orders.push({
          customer_id: customerId,
          order_date: orderDate,
          subtotal,
          tax,
          delivery_fee: deliveryFee,
          status,
          created_at: createdAt,
          updated_at: updatedAt,
        });
      }
    }

    // Insert orders
    for (const order of orders) {
      await pool.query(
        `INSERT INTO orders (customer_id, order_date, subtotal, tax, delivery_fee, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.customer_id,
          order.order_date,
          order.subtotal,
          order.tax,
          order.delivery_fee,
          order.status,
          order.created_at,
          order.updated_at,
        ]
      );
    }

    console.log(`✓ Successfully seeded ${orders.length} orders`);
    console.log(`  - Customers with orders: ${userIds.length}`);
    console.log(`  - Average orders per customer: ${(orders.length / userIds.length).toFixed(1)}`);
    console.log(`  - Status distribution: ${statuses.map(s => `${s} (${orders.filter(o => o.status === s).length})`).join(', ')}`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error.message);
    process.exit(1);
  }
}

seedOrders();