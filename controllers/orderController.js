const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

// place an order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, customer, userEmail } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Validate delivery details
    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "pincode",
    ];

    if (
      !customer ||
      requiredFields.some(
        (field) => !String(customer[field] || "").trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all delivery details",
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    // Validate product IDs and quantities
    const requestedItems = items.map((item) => {
      const productId =
        item.productId || item._id || item.id;

      const quantity = Number(item.quantity);

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        throw new Error("Invalid product ID or quantity");
      }

      return { productId, quantity };
    });

    // Get actual products from MongoDB
    const productIds = requestedItems.map(
      (item) => item.productId
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== new Set(productIds.map(String)).size) {
      return res.status(400).json({
        success: false,
        message: "One or more products are unavailable",
      });
    }

    // Create order items using database prices
    const orderItems = requestedItems.map((requestedItem) => {
      const product = products.find(
        (p) =>
          p._id.toString() === requestedItem.productId.toString()
      );

      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: requestedItem.quantity,
        imageUrl: product.imageUrl,
      };
    });

    // Calculate total on backend
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save order
    const order = await Order.create({
      userId,
      userEmail,
      items: orderItems,
      customer,
      total,
      status: "Processing",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to place order",
    });
  }
};


// get logged in customer order
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders",
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
};