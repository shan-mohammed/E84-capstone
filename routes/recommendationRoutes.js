const express = require("express")
const authMiddleware = require("../middlewares/authmiddleware");
const router = express.Router();

const {getRecommendations} =require("../controllers/recommendationController")

router.get("/:productId",authMiddleware, getRecommendations)

module.exports =router;