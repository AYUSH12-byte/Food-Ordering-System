const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Create order
router.post("/", createOrder);

// Customer's orders
router.get("/my-orders", getMyOrders);

// Admin: all orders
router.get("/", authorize("admin"), getAllOrders);

// Admin: update status
router.put("/:id/status", authorize("admin"), updateOrderStatus);

// Single order
router.get("/:id", getOrderById);

module.exports = router;
