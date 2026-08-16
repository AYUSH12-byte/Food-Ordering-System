const express = require("express");

const {
  getReceipt,
  downloadReceipt,
} = require("../controllers/receiptController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// View receipt
router.get("/:id", getReceipt);

// Download PDF
router.get("/:id/download", downloadReceipt);

module.exports = router;
