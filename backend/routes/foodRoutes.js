const express = require("express");

const {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getFoods);

router.get("/:id", getFood);

// Admin routes
router.post("/", protect, authorize("admin"), createFood);

router.put("/:id", protect, authorize("admin"), updateFood);

router.delete("/:id", protect, authorize("admin"), deleteFood);

module.exports = router;
