import express from "express";
import userRoutes from "./routes/users.routes.js";


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", function(req, res){
    res.json({
        success: true,
        message: "backend is running well"
    })
});

app.listen(3002, function(){
    console.log(`App listening on port 3002`)
});