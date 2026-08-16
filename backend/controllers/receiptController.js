const PDFDocument = require("pdfkit");
const Order = require("../models/Order");
const Receipt = require("../models/Receipt");

// GENERATE RECEIPT NUMBER

const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();

  const count = await Receipt.countDocuments();

  const number = String(count + 1).padStart(5, "0");

  return `REC-${year}-${number}`;
};

// CREATE RECEIPT

const createReceipt = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find order
    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.food", "name image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customer can only create receipt for own order
    if (
      req.user.role === "customer" &&
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create this receipt",
      });
    }

    // Check existing receipt
    const existingReceipt = await Receipt.findOne({
      order: orderId,
    });

    if (existingReceipt) {
      return res.status(400).json({
        success: false,
        message: "Receipt already exists for this order",
        receipt: existingReceipt,
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Save receipt
    const receipt = await Receipt.create({
      receiptNumber,
      order: order._id,
      user: order.user._id,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    });

    res.status(201).json({
      success: true,
      message: "Receipt generated successfully",
      receipt,
    });
  } catch (error) {
    console.error("Create Receipt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET RECEIPT

const getReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("order");

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    // Customer can only view own receipt
    if (
      req.user.role === "customer" &&
      receipt.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this receipt",
      });
    }

    res.status(200).json({
      success: true,
      receipt,
    });
  } catch (error) {
    console.error("Get Receipt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DOWNLOAD RECEIPT PDF

const downloadReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate("user", "name email phone")
      .populate({
        path: "order",
        populate: {
          path: "items.food",
          select: "name",
        },
      });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found",
      });
    }

    // Customer can only download own receipt
    if (
      req.user.role === "customer" &&
      receipt.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to download this receipt",
      });
    }

    const order = receipt.order;

    // PDF response headers
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${receipt.receiptNumber}.pdf`,
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    doc.pipe(res);

    // HEADER

    doc.fontSize(22).font("Helvetica-Bold").text("RESTAURANT NAME", {
      align: "center",
    });

    doc.fontSize(12).font("Helvetica").text("Online Food Ordering System", {
      align: "center",
    });

    doc.moveDown();

    doc
      .fontSize(10)
      .text("--------------------------------------------------", {
        align: "center",
      });


    // RECEIPT INFORMATION

    doc.moveDown();

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(`Receipt No: ${receipt.receiptNumber}`);

    doc
      .font("Helvetica")
      .text(`Date: ${new Date(receipt.generatedAt).toLocaleString()}`);

    doc.text(`Order ID: ${order._id}`);

    doc.moveDown();


    // CUSTOMER

    doc.font("Helvetica-Bold").text("Customer Information");

    doc
      .font("Helvetica")
      .text(`Name: ${receipt.user.name}`)
      .text(`Email: ${receipt.user.email}`)
      .text(`Phone: ${receipt.user.phone}`);

    doc.moveDown();

    doc.font("Helvetica-Bold").text("Delivery Information");

    doc
      .font("Helvetica")
      .text(`Address: ${order.deliveryAddress}`)
      .text(`Phone: ${order.deliveryPhone}`);

    if (order.deliveryNote) {
      doc.text(`Note: ${order.deliveryNote}`);
    }

    doc.moveDown();

    // ITEMS

    doc.font("Helvetica-Bold").text("Order Items");

    doc.moveDown(0.5);

    order.items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;

      doc
        .font("Helvetica")
        .text(
          `${item.name}   x${item.quantity}   Rs. ${itemSubtotal.toFixed(2)}`,
        );
    });

    doc.moveDown();

    doc.text("--------------------------------------------------", {
      align: "center",
    });


    // TOTALS

    doc.moveDown();

    doc.font("Helvetica").text(`Subtotal: Rs. ${order.subtotal.toFixed(2)}`);

    doc.text(`Delivery Charge: Rs. ${order.deliveryCharge.toFixed(2)}`);

    doc.moveDown(0.5);

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`TOTAL: Rs. ${order.totalAmount.toFixed(2)}`);

    doc.moveDown();

    // PAYMENT

    doc.fontSize(11).font("Helvetica-Bold").text("Payment Information");

    doc
      .font("Helvetica")
      .text(`Payment Method: ${receipt.paymentMethod}`)
      .text(`Payment Status: ${receipt.paymentStatus}`)
      .text(`Order Status: ${order.orderStatus}`);

    doc.moveDown(2);


    // FOOTER

    doc.fontSize(12).font("Helvetica-Bold").text("Thank You for Your Order!", {
      align: "center",
    });

    doc.fontSize(9).font("Helvetica").text("We appreciate your business.", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    console.error("Download Receipt Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createReceipt,
  getReceipt,
  downloadReceipt,
};
