const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");
const Receipt = require("../models/Receipt");
const Counter = require("../models/Counter");

const DELIVERY_CHARGE = 50;

// ==========================================
// GENERATE RECEIPT NUMBER
// ==========================================

const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: "receipt" },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
    }
  );

  const sequence = String(counter.sequence).padStart(
    5,
    "0"
  );

  return `REC-${year}-${sequence}`;
};

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const {
      deliveryAddress,
      deliveryPhone,
      deliveryNote = "",
      paymentMethod = "Cash on Delivery",
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery address and phone are required",
      });
    }

    if (
      !["Cash on Delivery", "Online"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // -----------------------------
    // Find Cart
    // -----------------------------

    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // -----------------------------
    // Validate Food
    // -----------------------------

    for (const item of cart.items) {
      if (!item.food) {
        return res.status(400).json({
          success: false,
          message:
            "One of the food items no longer exists",
        });
      }

      if (!item.food.isAvailable) {
        return res.status(400).json({
          success: false,
          message:
            `${item.food.name} is currently unavailable`,
        });
      }
    }

    // -----------------------------
    // Create Order Items
    // -----------------------------

    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      price: item.price,
      quantity: item.quantity,
      subtotal:
        item.price * item.quantity,
    }));

    // -----------------------------
    // Calculate Totals
    // -----------------------------

    const subtotal = orderItems.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );

    const deliveryCharge = DELIVERY_CHARGE;

    const totalAmount =
      subtotal + deliveryCharge;

    // -----------------------------
    // Create Order
    // -----------------------------

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      deliveryAddress,
      deliveryPhone,
      deliveryNote,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // -----------------------------
    // Create Payment
    // -----------------------------

    const payment = await Payment.create({
      order: order._id,
      user: req.user.id,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
    });

    // -----------------------------
    // Generate Receipt
    // -----------------------------

    const receiptNumber =
      await generateReceiptNumber();

    const receipt = await Receipt.create({
      receiptNumber,
      order: order._id,
      user: req.user.id,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
    });

    // -----------------------------
    // Clear Cart
    // -----------------------------

    cart.items = [];
    cart.subtotal = 0;

    await cart.save();

    // -----------------------------
    // Populate Order
    // -----------------------------

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.food",
          "name image"
        );

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      success: true,
      message: "Order placed successfully",

      order: populatedOrder,

      payment: {
        id: payment._id,
        amount: payment.amount,
        paymentMethod:
          payment.paymentMethod,
        paymentStatus:
          payment.paymentStatus,
      },

      receipt: {
        id: receipt._id,
        receiptNumber:
          receipt.receiptNumber,
      },
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate(
        "items.food",
        "name image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET SINGLE ORDER
// ==========================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "items.food",
        "name image"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role === "customer" &&
      order.user._id.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "items.food",
        "name image"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get All Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderStatus } =
      req.body;

    const allowedTransitions = {
      Pending: [
        "Preparing",
        "Cancelled",
      ],
      Preparing: [
        "Ready",
        "Cancelled",
      ],
      Ready: [
        "Delivered",
      ],
      Delivered: [],
      Cancelled: [],
    };

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      !Object.keys(
        allowedTransitions
      ).includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current order status is invalid",
      });
    }

    const possibleStatuses =
      allowedTransitions[
        order.orderStatus
      ];

    if (
      !possibleStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot change order status from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    order.orderStatus =
      orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};