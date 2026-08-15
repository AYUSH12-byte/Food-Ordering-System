const Cart = require("../models/Cart");
const Food = require("../models/Food");

// ADD TO CART

const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find food
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // Check availability
    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Food item is currently unavailable",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            food: food._id,
            quantity,
            price: food.price,
          },
        ],
      });

      await calculateSubtotal(cart);

      const populatedCart = await getPopulatedCart(cart._id);

      return res.status(201).json({
        success: true,
        message: "Food added to cart",
        cart: populatedCart,
      });
    }

    // Check if food already exists
    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        food: food._id,
        quantity: Number(quantity),
        price: food.price,
      });
    }

    await calculateSubtotal(cart);

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Food added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET CART

const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCartByUser(req.user.id);

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          items: [],
          subtotal: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE CART ITEM

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { foodId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.food.toString() === foodId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Food item not found in cart",
      });
    }

    // Check food availability
    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item no longer exists",
      });
    }

    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Food item is currently unavailable",
      });
    }

    item.quantity = Number(quantity);

    await calculateSubtotal(cart);

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// REMOVE FROM CART

const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.food.toString() === foodId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Food item not found in cart",
      });
    }

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);

    await calculateSubtotal(cart);

    const populatedCart = await getPopulatedCart(cart._id);

    res.status(200).json({
      success: true,
      message: "Food removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// CLEAR CART

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.subtotal = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// CALCULATE SUBTOTAL

const calculateSubtotal = async (cart) => {
  let subtotal = 0;

  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  cart.subtotal = subtotal;

  await cart.save();
};

// GET POPULATED CART

const getPopulatedCart = async (cartId) => {
  return await Cart.findById(cartId).populate({
    path: "items.food",
    select: "name description price image isAvailable preparationTime category",
    populate: {
      path: "category",
      select: "name",
    },
  });
};

// GET USER CART

const getPopulatedCartByUser = async (userId) => {
  return await Cart.findOne({
    user: userId,
  }).populate({
    path: "items.food",
    select: "name description price image isAvailable preparationTime category",
    populate: {
      path: "category",
      select: "name",
    },
  });
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
