const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddleware");

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

// Place a new order
router.post("/", authMiddleware, createOrder);

// Get logged-in customer's orders
router.get("/my-orders", authMiddleware, getMyOrders);

module.exports = router;