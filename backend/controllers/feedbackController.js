const Feedback = require("../models/Feedback");
const Order = require("../models/Order");

// CREATE FEEDBACK

const createFeedback = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // Validate fields
    if (!orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Order ID, rating and comment are required",
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
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

    // Check order ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own orders",
      });
    }

    // Only delivered orders can be reviewed
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only review delivered orders",
      });
    }

    // Check existing feedback
    const existingFeedback = await Feedback.findOne({
      order: orderId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this order",
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      user: req.user.id,
      order: orderId,
      rating: Number(rating),
      comment,
    });

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("user", "name email")
      .populate("order", "totalAmount orderStatus createdAt");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET MY FEEDBACK

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      user: req.user.id,
    })
      .populate("order", "totalAmount orderStatus createdAt")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Get My Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL FEEDBACK - ADMIN

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email phone")
      .populate("order", "totalAmount orderStatus createdAt")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Get All Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET SINGLE FEEDBACK

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("order", "totalAmount orderStatus createdAt");

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Customer can only view own feedback
    if (
      req.user.role === "customer" &&
      feedback.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this feedback",
      });
    }

    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE FEEDBACK - ADMIN

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
};
