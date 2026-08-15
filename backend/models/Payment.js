const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Related order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    // Customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Amount paid
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Online"],
      required: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // Transaction/reference number
    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
