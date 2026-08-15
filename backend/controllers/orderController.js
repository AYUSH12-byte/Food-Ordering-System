const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");

// Delivery charge
const DELIVERY_CHARGE = 50;

// CREATE ORDER

const createOrder = async (req, res) => {
  try {
    const {
      deliveryAddress,
      deliveryPhone,
      deliveryNote,
      paymentMethod = "Cash on Delivery",
    } = req.body;

    // Validate delivery information
    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({
        success: false,
        message: "Delivery address and phone are required",
      });
    }

    // Validate payment method
    if (!["Cash on Delivery", "Online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Find customer cart
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Check food availability
    for (const item of cart.items) {
      if (!item.food) {
        return res.status(400).json({
          success: false,
          message: "One of the food items no longer exists",
        });
      }

      if (!item.food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${item.food.name} is currently unavailable`,
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    // Calculate subtotal
    const subtotal = orderItems.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    // Calculate delivery
    const deliveryCharge = DELIVERY_CHARGE;

    // Calculate final amount
    const totalAmount = subtotal + deliveryCharge;

    // Payment status
    const paymentStatus =
      paymentMethod === "Cash on Delivery" ? "Pending" : "Pending";

    // Create order
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
      paymentStatus,
      orderStatus: "Pending",
    });

    // Clear cart after successful order
    cart.items = [];
    cart.subtotal = 0;

    await cart.save();

    // Populate user information
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.food", "name image");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET MY ORDERS

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.food", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE ORDER

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.food", "name image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customer can only view own order
    if (
      req.user.role === "customer" &&
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL ORDERS - ADMIN

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.food", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE ORDER STATUS - ADMIN

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

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
