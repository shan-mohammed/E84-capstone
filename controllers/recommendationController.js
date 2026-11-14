const UserActivity = require("../models/UserActivity");
const Product = require("../models/Product");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the customer's activity history
    const activities = await UserActivity.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    // If the customer has no activity, show highly rated products
    if (activities.length === 0) {
      const products = await Product.find()
        .sort({ rating: -1 })
        .limit(8);

      return res.status(200).json({
        success: true,
        message: "Popular product recommendations",
        data: products,
      });
    }

    const categoryScores = {};
    const brandScores = {};
    const interactedProductIds = new Set();

    const weights = {
      view: 1,
      cart: 3,
      wishlist: 4,
      purchase: 5,
    };

    // Calculate customer interests
    activities.forEach((activity) => {
      const product = activity.productId;

      if (!product) return;

      const weight = weights[activity.action] || 0;

      interactedProductIds.add(product._id.toString());

      if (product.category) {
        categoryScores[product.category] =
          (categoryScores[product.category] || 0) + weight;
      }

      if (product.brand) {
        brandScores[product.brand] =
          (brandScores[product.brand] || 0) + weight;
      }
    }); 
      

    // Get categories and brands with the highest scores
    const preferredCategories = Object.keys(categoryScores)
      .sort((a, b) => categoryScores[b] - categoryScores[a]);

    const preferredBrands = Object.keys(brandScores)
      .sort((a, b) => brandScores[b] - brandScores[a]);

    // Find products matching customer interests
    const recommendations = await Product.find({
      _id: { $nin: Array.from(interactedProductIds) },
      $or: [
        { category: { $in: preferredCategories } },
        { brand: { $in: preferredBrands } },
      ],
    })
      .sort({ rating: -1 })
      
      .limit(8);

    return res.status(200).json({
      success: true,
      message: "Personalized recommendations generated",
      data: recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
    });
  }
};

module.exports = { getRecommendations };