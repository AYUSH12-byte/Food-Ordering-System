const express = require("express");

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
} = require("../controllers/feedbackController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Customer
router.post("/", createFeedback);

router.get("/my-feedback", getMyFeedback);

// Admin
router.get("/", authorize("admin"), getAllFeedback);

router.delete("/:id", authorize("admin"), deleteFeedback);

// Single feedback
router.get("/:id", getFeedbackById);

module.exports = router;
