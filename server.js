require ("dotenv").config();

const express = require("express");
const connectDB =require("./config/db")
const cors =require("cors")
const cookieParser = require("cookie-parser");


const productRoutes =require("./routes/productRoutes")
const authRoutes = require("./routes/authRoutes");

const app =express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
    })
)



const PORT = process .env.PORT 



// test route
app.get("/",(req,res)=>{
    res.json({
        success :true,
        message :"Capstone backend is running"
    })
})

//Routes
app.use("/api/products",productRoutes); 
app.use("/api/auth", authRoutes);

// data base
connectDB(); 


app.listen (PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})