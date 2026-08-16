const express = require("express");

const {
  markPaymentAsPaid,
  markPaymentAsFailed,
  getMyPayments,
  getAllPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Customer
router.get("/my-payments", getMyPayments);

// Admin
router.get("/", authorize("admin"), getAllPayments);

router.put("/:id/paid", authorize("admin"), markPaymentAsPaid);

router.put("/:id/failed", authorize("admin"), markPaymentAsFailed);

// Single payment
router.get("/:id", getPaymentById);

module.exports = router;
