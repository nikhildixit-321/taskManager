require('dotenv').config();
const express = require("express")
const cors = require("cors")
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const reportRoutes = require('./routes/reportRoutes')
const commentRoutes = require('./routes/commentRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const templateRoutes = require('./routes/templateRoutes')
const recurringTaskRoutes = require('./routes/recurringTaskRoutes')
const passport = require('./config/passport');
const cron = require('node-cron');
const { processRecurringTasks } = require('./utils/recurringTaskProcessor');
const path = require('path');

const app  = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set('io', io);

// middleware to handle cors
app.use(cors({
    origin:process.env.CLIENT_URL || "*",
    methods :["GET","POST","PUT","DELETE"],
    allowedHeaders : ["Content-Type", "Authorization"],
}));

// middlewares
app.use(express.json())
app.use(session({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// connected to database (non-blocking - server will start even if DB fails)
connectDB().catch(err => {
    console.error("⚠️  Database connection failed, but server will continue running")
    console.error("⚠️  API endpoints will not work until database is connected")
})

//  routes
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/reports",reportRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/templates", templateRoutes)
app.use("/api/recurring-tasks", recurringTaskRoutes)

// serve uploads
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Cron job for recurring tasks (runs every hour)
cron.schedule('0 * * * *', async () => {
    console.log('Processing recurring tasks...');
    await processRecurringTasks(io);
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// start server 
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})