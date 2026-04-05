import express from "express";
import userRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import userReviewsRoutes from "./routes/user-review.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());

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
        message: "backend is running well"
    })
});

app.listen(3002, function(){
    console.log(`App listening on port 3002`)
});