import express from "express";
import userRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import { specs } from './swagger.js';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

app.use("/admin/users", userRoutes);

app.use("/auth", authRoutes);

app.use("/products", productsRoutes);

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