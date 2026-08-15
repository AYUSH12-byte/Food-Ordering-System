const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require login
router.use(protect);

// Get cart
router.get("/", getCart);

// Add food
router.post("/", addToCart);

// Update quantity
router.put("/:foodId", updateCartItem);

// Remove food
router.delete("/:foodId", removeFromCart);

// Clear cart
router.delete("/", clearCart);

module.exports = router;
