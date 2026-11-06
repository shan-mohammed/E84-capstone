const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require("../controllers/productController");
const upload = require("../middlewares/upload")
const authMiddleware = require("../middlewares/authmiddleware")
const roleMiddleware = require("../middlewares/rolemiddleware");
const authorize = require("../middlewares/rolemiddleware");

const router = express.Router();



// Get all products
router.get("/", getProducts);

// Get one product
router.get("/:id", getProductById); 

// Create a product
router.post("/",authMiddleware,authorize("admin"),upload.single("image"), createProduct);

// Update a product
router.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  upload.single("image"),
  updateProduct
);
// Delete a product
router.delete("/:id", deleteProduct); 
   
  
module.exports = router; 