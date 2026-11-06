const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authmiddleware");

const {
  trackActivity,
} = require("../controllers/activityController");

router.post(
  "/track",
  authMiddleware,
  trackActivity
);

module.exports = router;