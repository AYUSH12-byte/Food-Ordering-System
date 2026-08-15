const express = require("express");

const {
  createPayment,
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
router.post("/", createPayment);

router.get("/my-payments", getMyPayments);

router.get("/:id", getPaymentById);

// Admin
router.get("/", authorize("admin"), getAllPayments);

router.put("/:id/paid", authorize("admin"), markPaymentAsPaid);

router.put("/:id/failed", authorize("admin"), markPaymentAsFailed);

module.exports = router;
