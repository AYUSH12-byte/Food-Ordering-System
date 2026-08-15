const Payment = require("../models/Payment");
const Order = require("../models/Order");

// CREATE PAYMENT RECORD

const createPayment = async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customer can only pay for their own order
    if (req.user.role === "customer" && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to make payment for this order",
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      order: orderId,
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment record already exists for this order",
        payment: existingPayment,
      });
    }

    // Create payment
    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus:
        order.paymentMethod === "Cash on Delivery" ? "Pending" : "Pending",
      transactionId: transactionId || "",
    });

    res.status(201).json({
      success: true,
      message: "Payment record created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// MARK PAYMENT AS PAID

const markPaymentAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is already marked as paid",
      });
    }

    payment.paymentStatus = "Paid";
    payment.paymentDate = new Date();

    await payment.save();

    // Update order payment status
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "Paid",
    });

    res.status(200).json({
      success: true,
      message: "Payment marked as paid",
      payment,
    });
  } catch (error) {
    console.error("Mark Payment Paid Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// MARK PAYMENT AS FAILED

const markPaymentAsFailed = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    payment.paymentStatus = "Failed";

    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "Failed",
    });

    res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      payment,
    });
  } catch (error) {
    console.error("Payment Failed Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET MY PAYMENTS

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.id,
    })
      .populate(
        "order",
        "items subtotal deliveryCharge totalAmount orderStatus",
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get My Payments Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL PAYMENTS - ADMIN

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email phone")
      .populate("order", "subtotal deliveryCharge totalAmount orderStatus")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get All Payments Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE PAYMENT

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate(
        "order",
        "items subtotal deliveryCharge totalAmount orderStatus",
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Customer can only view own payment
    if (
      req.user.role === "customer" &&
      payment.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this payment",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createPayment,
  markPaymentAsPaid,
  markPaymentAsFailed,
  getMyPayments,
  getAllPayments,
  getPaymentById,
};
