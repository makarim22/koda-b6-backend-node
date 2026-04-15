const config = {
  Secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  Expiration: 86400000, // 24 hours in milliseconds
  Issuer: 'coffee-shop-api',
};

export default config;