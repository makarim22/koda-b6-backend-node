import express from "express";
import userRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import userReviewsRoutes from "./routes/user-review.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
import redisClient from './config/redis.js'

const app = express();
app.use(express.json());


const corsOptions = {
  origin: ['http://localhost:5173', 'http://68.183.226.223:21001', 'https://coffeeshop-jaka.my.id'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));

app.use("/api/admin/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews", userReviewsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payments", paymentRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", function(req, res){
    res.json({
        success: true,
        message: "backend is running well",
        redis: redisClient.isOpen ? 'connected' : 'disconnected'
    })
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', function(){
    console.log(`App listening on port ${PORT}`);
});

