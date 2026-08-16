const express = require("express");

const { getDashboardStats } = require("../controllers/dashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only
router.get("/", protect, authorize("admin"), getDashboardStats);

module.exports = router;
