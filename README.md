# Coffee Shop API

A full-featured Node.js/Express backend API for a coffee shop management system with JWT authentication, role-based authorization, product management, shopping cart, orders, and reviews.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Contributing](#contributing)

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (admin, user)
  - Secure password hashing with argon2

- **User Management**
  - User registration and login
  - Admin user creation and management
  - User profile updates

- **Product Management**
  - Product catalog with variants
  - Product images and discounts
  - Product filtering and search

- **Shopping Cart**
  - Add/remove items from cart
  - Cart persistence
  - Real-time cart updates

- **Orders**
  - Order creation and management
  - Order history tracking
  - Order items details

- **Reviews & Ratings**
  - Product reviews
  - User ratings
  - Review management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** argon2
- **API Documentation:** Swagger/OpenAPI
- **Containerization:** Docker & Docker Compose
- **Development:** npm with watch mode

## Prerequisites

- Node.js (v14 or higher)
- Docker & Docker Compose
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee-shop-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3005
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5434
DB_NAME=coffee_shop
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600000
JWT_ISSUER=coffee-shop-api

# Other
LOG_LEVEL=debug
```

## Docker Setup

This application uses Docker Compose to orchestrate PostgreSQL, Redis, and the Node.js backend service.

### Docker Compose Architecture

The `docker-compose.yml` file defines three services running on a custom network called `coffee-network`:

**Services:**
- **PostgreSQL (db):** Database service on port `5434`
  - Database: `coffee_shop`
  - Volume: `postgres_data` (persistent storage)

- **Redis (cache):** Caching service on port `6379`
  - Volume: `redis_data` (persistent storage)

- **Backend (api):** Node.js Express server on port `3005`
  - Command: `npm run dev` (development watch mode)
  - Depends on: PostgreSQL and Redis services
  - Volume: Current directory mounted for live code updates

### Network Configuration

All services communicate via `coffee-network` bridge network:
- Backend connects to PostgreSQL at `db:5432` (internal Docker DNS)
- Backend connects to Redis at `cache:6379` (internal Docker DNS)

### Volume Persistence

- `postgres_data`: Persists PostgreSQL database files
- `redis_data`: Persists Redis data

**Important:** Do NOT use `docker-compose down -v` as it will delete volumes and lose all data. Use `docker-compose down` instead to preserve database volumes.

### Starting Docker Compose

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f db
docker-compose logs -f cache

# Stop services
docker-compose stop

# Remove containers (preserves volumes)
docker-compose down
```

### Health Checks

All services are configured with health checks. Verify service status:

```bash
docker-compose ps
```

Expected output shows all services as `healthy` or `Up`.

### Known Issues

- WSL2-related "C variable not set" warnings may appear in docker-compose output — these are non-critical and can be safely ignored.

## Running the Application

### Development Mode (with Docker)

```bash
# Start Docker services
docker-compose up -d

# Backend runs automatically on port 3005
# API will be available at http://localhost:3005
```

### Development Mode (local)

```bash
# Ensure PostgreSQL and Redis are running locally
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Database Setup

### Initialize Database

The application includes seed scripts to populate the database with initial data:

```bash
# Run all seed scripts
npm run seed

# Or run individual seeds
npm run seed:variants
npm run seed:product-junction
npm run seed:product-images
npm run seed:product-discount
npm run seed:reviews
npm run seed:orders
npm run seed:orders-items
npm run seed:cart
```


```

### Database Tables

Core tables include:
- `users` — User accounts
- `user_roles` — User role assignments (admin, user)
- `products` — Product catalog
- `product_variants` — Product variants
- `product_images` — Product images
- `product_discounts` — Product discounts
- `reviews` — Product reviews
- `orders` — Customer orders
- `order_items` — Order line items
- `cart` — Shopping cart items

## API Documentation

API documentation is available via Swagger/OpenAPI at:

```
http://localhost:3005/api-docs
```

### Key Endpoints

**Authentication:**
- `POST /auth/register` — Register new user
- `POST /auth/login` — User login (returns JWT token)

**Protected Admin Routes:**
- `GET /admin/users` — Get all users (admin only)
- `GET /admin/users/:id` — Get user by ID (admin only)
- `POST /admin/users` — Create new user (admin only)
- `PUT /admin/users/:id` — Update user (admin only)
- `DELETE /admin/users/:id` — Delete user (admin only)

**Products:**
- `GET /products` — Get all products
- `GET /products/:id` — Get product by ID

**Orders:**
- `GET /orders` — Get user's orders
- `POST /orders` — Create order

**Reviews:**
- `GET /products/:id/reviews` — Get product reviews
- `POST /products/:id/reviews` — Add review

##todo: will be updated later

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with role-based authorization.

### JWT Token Structure

```javascript
{
  user_id: number,
  email: string,
  role: 'admin' | 'user',
  iat: number,
  exp: number,
  iss: 'coffee-shop-api'
}
```

### Protected Routes

Protected endpoints require a `Bearer` token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3005/admin/users
```

### Role-Based Access

- **admin** — Full access to user management and system administration
- **user** — Standard user access to products, orders, reviews, and cart

## Project Structure

```
coffee-shop-api/
├── controllers/          # Request handlers
│   └── users.controller.js
├── models/              # Database models and queries
│   └── users.model.js
├── routes/              # API route definitions
│   ├── auth.router.js
│   └── users.router.protected.js
├── middleware/          # Express middleware
│   └── auth-middleware.js
├── config/              # Configuration files
│   └── config.js
├── seeds/               # Database seed scripts
│   ├── seed.js
│   └── ...
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables (local)
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
└── server.js            # Application entry point
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
