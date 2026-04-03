import pool from '../db/index.js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker/locale/id_ID';

dotenv.config();

// Indonesian review messages for different rating levels
const excellentReviews = [
  'Sangat memuaskan! Kopi dan pastrynya fresh banget, rasa premium. Pasti pesan lagi!',
  'Wow, ini kopi terbaik yang pernah saya coba. Aroma dan rasanya sempurna, layanan juga cepat.',
  'Luar biasa! Kualitas produk benar-benar terjamin. Rekomendasi buat semua pecinta kopi.',
  'Sip yang pas, tidak terlalu pahit atau asam. Hasil brewing mereka sangat konsisten.',
  'Mantap! Harga sebanding dengan kualitas. Selalu jadi pilihan utama saya.',
  'Packaging rapi, produk sampai dalam kondisi sempurna. Sangat puas dengan pembelian ini!',
  'Ini kopi enak banget, cocok diminum kapan saja. Stok selalu habis, bukti kualitasnya.',
];

const goodReviews = [
  'Bagus, cukup memuaskan. Hanya sedikit kurang dalam hal konsistensi rasa.',
  'Produk berkualitas, tapi harga agak mahal untuk ukurannya.',
  'Lumayan oke, tapi ada yang lebih enak di tempat lain. Masih dalam batas standard.',
  'Cocok untuk pecinta kopi, meski bukan yang terbaik.',
  'Rasa okaylah, nilai uang cukup terpenuhi.',
  'Pengiriman cepat, produknya juga bagus. Cuma sedikit kecewa dengan rasa yang kurang intense.',
];

const averageReviews = [
  'Standar aja, tidak istimewa tapi juga tidak mengecewakan.',
  'Biasa saja, harga sebanding dengan kualitas.',
  'Rasanya begini-begini saja, banyak pilihan lain yang lebih enak.',
  'Cukup, tapi ekspektasi saya lebih tinggi.',
  'Okaylah untuk sehari-hari, tapi tidak memorable.',
  'Tidak buruk, tapi tidak terlalu istimewa juga.',
];

const poorReviews = [
  'Mengecewakan, rasa tidak sesuai ekspektasi. Uang saya terbuang percuma.',
  'Produk kurang fresh, seperti sudah lama disimpan.',
  'Packaging bagus tapi isinya tidak sesuai. Harga mahal kualitas jelek.',
  'Tidak rekomen, ada cacat pada produk yang saya terima.',
  'Rasa pahit berlebihan, tidak enak diminum.',
];

const terribleReviews = [
  'Sangat tidak puas! Produk rusak sampai tujuan, layanan customer service juga buruk.',
  'Ini pemborosan uang total. Jangan beli di tempat ini!',
  'Parah banget, rasa tidak selera. Uang saya seharusnya buat beli yang lebih bagus.',
  'Kecewa besar dengan kualitas dan pelayanan. Satu bintang sesuai merit.',
];

const getReviewMessage = (rating) => {
  switch (rating) {
    case 5:
      return faker.helpers.arrayElement(excellentReviews);
    case 4:
      return faker.helpers.arrayElement(goodReviews);
    case 3:
      return faker.helpers.arrayElement(averageReviews);
    case 2:
      return faker.helpers.arrayElement(poorReviews);
    case 1:
      return faker.helpers.arrayElement(terribleReviews);
    default:
      return faker.helpers.arrayElement(averageReviews);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Memulai seeding database ulasan pengguna...\n');

    // Clear existing reviews
    await pool.query('TRUNCATE TABLE user_review RESTART IDENTITY CASCADE');

    // Get total users, products, and orders
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const productsResult = await pool.query('SELECT COUNT(*) as count FROM products');
    const ordersResult = await pool.query('SELECT COUNT(*) as count FROM orders');
    
    const userCount = parseInt(usersResult.rows[0].count);
    const productCount = parseInt(productsResult.rows[0].count);
    const orderCount = parseInt(ordersResult.rows[0].count);
    
    if (userCount === 0 || productCount === 0 || orderCount === 0) {
      throw new Error('Tidak ada data di tabel users, products, atau orders. Silahkan seed data tersebut terlebih dahulu.');
    }

    console.log(`📊 Data yang tersedia:`);
    console.log(`   - ${userCount} pengguna`);
    console.log(`   - ${productCount} produk`);
    console.log(`   - ${orderCount} pesanan\n`);

    // Generate 100 user reviews
    console.log('⭐ Menghasilkan ulasan pengguna...');
    for (let i = 0; i < 100; i++) {
      const userId = faker.number.int({ min: 1, max: userCount });
      const productId = faker.number.int({ min: 1, max: productCount });
      const orderId = faker.number.int({ min: 1, max: orderCount });
      
      // Rating distribution: 30% excellent, 30% good, 20% average, 12% poor, 8% terrible
      let rating;
      const random = Math.random();
      if (random < 0.30) rating = 5;
      else if (random < 0.60) rating = 4;
      else if (random < 0.80) rating = 3;
      else if (random < 0.92) rating = 2;
      else rating = 1;
      
      const message = getReviewMessage(rating);
      
      // Generate timestamp from past 6 months
      const createdAt = faker.date.past({ years: 0.5 });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
      
      await pool.query(
        'INSERT INTO user_review (user_id, product_id, order_id, message, rating, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [userId, productId, orderId, message, rating, createdAt, updatedAt]
      );
      
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ ${i + 1}/100 ulasan dibuat...`);
      }
    }

    console.log('\n✅ Database berhasil di-seed!');
    console.log(`  - 100 ulasan pengguna dibuat`);
    console.log(`  - Distribusi rating: 30 bintang ⭐⭐⭐⭐⭐, 30 bintang ⭐⭐⭐⭐, 20 bintang ⭐⭐⭐, 12 bintang ⭐⭐, 8 bintang ⭐\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding gagal:', error.message);
    process.exit(1);
  }
};

seedDatabase();