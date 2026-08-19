import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const { cart, loading, updateCartItem, removeFromCart, clearCart } =
    useCart();

  const items = cart?.items || [];

  // DELIVERY CHARGE

  const deliveryCharge = items.length > 0 ? 50 : 0;

  const subtotal = Number(cart?.subtotal || 0);

  const total = subtotal + deliveryCharge;

  // INCREASE QUANTITY

  const increaseQuantity = async (item) => {
    try {
      await updateCartItem(item.food?._id, item.quantity + 1);
    } catch (error) {
      console.error("Increase quantity error:", error);
    }
  };

  // DECREASE QUANTITY

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      await updateCartItem(item.food?._id, item.quantity - 1);
    } catch (error) {
      console.error("Decrease quantity error:", error);
    }
  };

  // REMOVE ITEM

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.food?._id);
    } catch (error) {
      console.error("Remove cart item error:", error);
    }
  };

  // CLEAR CART

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await clearCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  // CHECKOUT

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // LOADING

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  // EMPTY CART

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl">
            🛒
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/foods"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse Food
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Cart</h1>

          <p className="mt-2 text-sm text-slate-500">
            {items.length} item
            {items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="self-start rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      {/* MAIN CONTENT */}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* CART ITEMS */}

        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const food = item.food;

            if (!food) {
              return null;
            }

            const itemTotal = Number(food.price) * item.quantity;

            return (
              <div
                key={food._id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}

                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-24 w-24 rounded-xl object-cover sm:h-32 sm:w-32"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-32 sm:w-32">
                      No Image
                    </div>
                  )}

                  {/* Details */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-slate-900">
                          {food.name}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {food.category?.name || "Uncategorized"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Rs. {Number(food.price).toFixed(2)} each
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}

                      <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                          className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="flex h-9 min-w-10 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item)}
                          className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Item total */}

                      <p className="font-bold text-slate-900">
                        Rs. {itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Continue Shopping */}

          <Link
            to="/foods"
            className="inline-block text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ORDER SUMMARY */}

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {/* Subtotal */}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-900">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>

              {/* Delivery */}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery Charge</span>

                <span className="font-medium text-slate-900">
                  Rs. {deliveryCharge.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>

                  <span className="text-xl font-bold text-slate-900">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Proceed to Checkout
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Delivery charge is currently fixed at Rs. 50.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
