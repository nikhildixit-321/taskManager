const mongoose = require("mongoose")

const connectDB = async (retries = 3, delay = 2000) => {
    if (!process.env.MONGO_URL) {
        console.error("❌ MONGO_URL is not defined in environment variables")
        console.error("Please create a .env file with: MONGO_URL=your_mongodb_connection_string")
        process.exit(1)
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 Attempting to connect to MongoDB (${attempt}/${retries})...`)
            
            const options = {
                serverSelectionTimeoutMS: 10000, 
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
            }
            
            await mongoose.connect(process.env.MONGO_URL, options)
            console.log("✅ MongoDB connected successfully")
            return
        } catch (error) {
            const errorMsg = error.message || error.toString()
            console.error(`❌ MongoDB connection attempt ${attempt} failed:`, errorMsg)
            
            if (attempt < retries) {
                console.log(`⏳ Retrying in ${delay/1000} seconds...`)
                await new Promise(resolve => setTimeout(resolve, delay))
            } else {
                console.error("\n🔍 Troubleshooting steps:")
                console.error("1. Check your internet connection")
                console.error("2. Verify MongoDB Atlas cluster is running (not paused)")
                console.error("   - Log into MongoDB Atlas and check cluster status")
                console.error("   - Free tier clusters auto-pause after inactivity")
                console.error("3. Verify your IP address is whitelisted in MongoDB Atlas")
                console.error("   - Go to Network Access in MongoDB Atlas")
                console.error("   - Add your current IP or use 0.0.0.0/0 (less secure)")
                console.error("4. Check MONGO_URL format in .env file")
                console.error("   - Should be: mongodb+srv://username:password@cluster.mongodb.net/database")
                console.error("5. Test DNS resolution:")
                console.error("   - Run: nslookup cluster0.g7qteye.mongodb.net")
                console.error("   - If this fails, it's a DNS/network issue")
                console.error("\n💡 Alternative: Use local MongoDB")
                console.error("   - Install MongoDB locally")
                console.error("   - Set MONGO_URL=mongodb://localhost:27017/taskmanager")
                console.error("\n⚠️  Server will continue but API endpoints will fail without database connection")
                // Don't exit - allow server to start for frontend development
                // process.exit(1)
            }
        }
    }
}

module.exports = connectDB