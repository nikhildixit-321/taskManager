require('dotenv').config();
const express = require("express")
const cors = require("cors")
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const reportRoutes = require('./routes/reportRoutes')
const app  = express();

// middleware to handle cors
app.use(cors({
    origin:process.env.CLIENT_URL || "*",
    methods :["GET","POST","PUT","DELETE"],
    allowedHeaders : ["Content-Type", "Authorization"],

}));
// middlewares
app.use(express.json())

// connected
connectDB()

//  routes

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/reports",reportRoutes)



// start server 
const PORT = process.env.PORT || 8000;
app.listen (PORT,()=>{console.log(`server running on port: ${PORT}`)})