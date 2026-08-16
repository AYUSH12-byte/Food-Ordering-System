const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Feedback = require("../models/Feedback");

// ADMIN DASHBOARD=

const getDashboardStats = async (req, res) => {
  try {

    // BASIC COUNTS-

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalFoods = await Food.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const preparingOrders = await Order.countDocuments({
      orderStatus: "Preparing",
    });

    const readyOrders = await Order.countDocuments({
      orderStatus: "Ready",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });


    // REVENUE

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // TOTAL SALES

    const salesResult = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    // TOTAL FEEDBACK

    const totalFeedback = await Feedback.countDocuments();

    // AVERAGE RATING
   
    const ratingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(2))
        : 0;

    // RECENT ORDERS

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select("user totalAmount orderStatus paymentStatus createdAt");

    // BEST SELLING FOOD

    const bestSellingFood = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.food",
          foodName: {
            $first: "$items.name",
          },
          totalQuantity: {
            $sum: "$items.quantity",
          },
          totalSales: {
            $sum: "$items.subtotal",
          },
        },
      },

      {
        $sort: {
          totalQuantity: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    // RESPONSE

    res.status(200).json({
      success: true,

      dashboard: {
        totalCustomers,
        totalFoods,
        totalOrders,

        orderStatus: {
          pending: pendingOrders,
          preparing: preparingOrders,
          ready: readyOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        totalSales,
        totalRevenue,

        totalFeedback,
        averageRating,

        recentOrders,
        bestSellingFood,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
};
