const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authmiddleware");
const authorize = require("../middlewares/rolemiddleware");

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, authorize("admin"));

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

module.exports = router;