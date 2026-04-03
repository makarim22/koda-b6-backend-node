import pool from '../db/index.js';

async function seedProductImages() {
  try {
    // Get all products
    const productsResult = await pool.query('SELECT id, product_name FROM products');
    const products = productsResult.rows;

    if (products.length === 0) {
      console.log('No products found. Please run the original seeder first.');
      process.exit(1);
    }

    // Coffee product images - using Picsum (stable placeholder service)
    const coffeeImages = [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6',
      'https://picsum.photos/400/400?random=7',
      'https://picsum.photos/400/400?random=8',
      'https://picsum.photos/400/400?random=9',
      'https://picsum.photos/400/400?random=10',
      'https://picsum.photos/400/400?random=11',
      'https://picsum.photos/400/400?random=12',
      'https://picsum.photos/400/400?random=13',
      'https://picsum.photos/400/400?random=14',
      'https://picsum.photos/400/400?random=15',
    ];

    // Pastry product images - using Picsum (stable placeholder service)
    const pastryImages = [
      'https://picsum.photos/400/400?random=20',
      'https://picsum.photos/400/400?random=21',
      'https://picsum.photos/400/400?random=22',
      'https://picsum.photos/400/400?random=23',
      'https://picsum.photos/400/400?random=24',
      'https://picsum.photos/400/400?random=25',
      'https://picsum.photos/400/400?random=26',
      'https://picsum.photos/400/400?random=27',
      'https://picsum.photos/400/400?random=28',
      'https://picsum.photos/400/400?random=29',
      'https://picsum.photos/400/400?random=30',
      'https://picsum.photos/400/400?random=31',
      'https://picsum.photos/400/400?random=32',
      'https://picsum.photos/400/400?random=33',
      'https://picsum.photos/400/400?random=34',
    ];

    let imagesInserted = 0;

    // Insert images for each product
    for (const product of products) {
      const isCoffee = product.product_name.toLowerCase().includes('coffee') || 
                       product.product_name.toLowerCase().includes('espresso') || 
                       product.product_name.toLowerCase().includes('cappuccino') || 
                       product.product_name.toLowerCase().includes('latte') || 
                       product.product_name.toLowerCase().includes('americano');
      
      const imagePool = isCoffee ? coffeeImages : pastryImages;
      
      // Randomly select 2-4 images for each product
      const imageCount = Math.floor(Math.random() * 3) + 2; // 2-4 images
      const selectedImages = [];
      
      for (let i = 0; i < imageCount; i++) {
        const randomIndex = Math.floor(Math.random() * imagePool.length);
        selectedImages.push(imagePool[randomIndex]);
      }

      // Insert images, marking first as primary
      for (let i = 0; i < selectedImages.length; i++) {
        const isPrimary = i === 0;
        
        await pool.query(
          `INSERT INTO product_image (product_id, path, is_primary, created_at, updated_at)
           VALUES ($1, $2, $3, NOW(), NOW())`,
          [product.id, selectedImages[i], isPrimary]
        );
        
        imagesInserted++;
      }
    }

    console.log(`✓ Successfully seeded ${imagesInserted} product images`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding product images:', error);
    process.exit(1);
  }
}

seedProductImages();