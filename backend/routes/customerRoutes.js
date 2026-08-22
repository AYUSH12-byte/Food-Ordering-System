const express = require("express");

const {
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} = require("../controllers/customerController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

// Get all customers
router.get("/", getAllCustomers);

// Get single customer
router.get("/:id", getCustomerById);

// Delete customer
router.delete("/:id", deleteCustomer);

module.exports = router;
