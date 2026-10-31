const mongooose =require ("mongoose");

require ("dotenv").config();

const connectDB = async()=>{
    try {
        console.log("MONGO_URI loaded:",!!process.env.MONGO_URI)
        await mongooose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS:15000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed",error.message);
        console.error("Error Name:",error.name);
        process.exit(1);
    }
}
module.exports = connectDB