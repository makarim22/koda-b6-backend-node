import express from "express";
import userRoutes from "./routes/users.routes.js";
// import db from './db/index.js';

const app = express();

// try {
//   await db.query('SELECT NOW()')
//   console.log('✓ Database connected')
// } catch (err) {
//   console.error('✗ Database connection failed:', err.message)
//   process.exit(1)
// }

app.use(express.json());

app.use("/admin/users", userRoutes);

app.get("/", function(req, res){
    res.json({
        success: true,
        message: "backend is running well"
    })
});

app.listen(3002, function(){
    console.log(`App listening on port 3002`)
});