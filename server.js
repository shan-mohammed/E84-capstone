


require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const recommendationRoutes =require("./routes/recommendationRoutes")
const userRoutes =require("./routes/userRoutes")
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173"
    ].filter(Boolean),
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Capstone backend is running"
    });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/users",userRoutes);

// Start server after MongoDB connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};
startServer();