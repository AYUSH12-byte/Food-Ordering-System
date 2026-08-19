import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import { createOrder } from "../../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, loading: cartLoading } = useCart();

  const items = cart?.items || [];

  const subtotal = Number(cart?.subtotal || 0);

  const deliveryCharge = items.length > 0 ? 50 : 0;

  const total = subtotal + deliveryCharge;

  const [formData, setFormData] = useState({
    deliveryAddress: "",
    deliveryPhone: "",
    deliveryNote: "",
    paymentMethod: "Cash on Delivery",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.deliveryAddress.trim()) {
      setError("Delivery address is required");
      return;
    }

    if (!formData.deliveryPhone.trim()) {
      setError("Delivery phone is required");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await createOrder({
        deliveryAddress: formData.deliveryAddress.trim(),

        deliveryPhone: formData.deliveryPhone.trim(),

        deliveryNote: formData.deliveryNote.trim(),

        paymentMethod: formData.paymentMethod,
      });

      // Order was successfully created
      navigate(`/order-success/${response.order._id}`, {
        state: {
          order: response.order,

          payment: response.payment,

          receipt: response.receipt,
        },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add some food before going to checkout.
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
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Checkout
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Complete Your Order
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your delivery details and place your order.
        </p>
      </div>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* ================================= */}
        {/* DELIVERY FORM */}
        {/* ================================= */}

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Delivery Information
            </h2>

            <div className="mt-6 space-y-5">
              {/* Address */}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Delivery Address
                </label>

                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter your full delivery address"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="deliveryPhone"
                  value={formData.deliveryPhone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Note */}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Delivery Note
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  name="deliveryNote"
                  value={formData.deliveryNote}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Please call when you arrive"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Payment */}

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Payment Method
                </label>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 p-4 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === "Cash on Delivery"}
                      onChange={handleChange}
                      disabled={loading}
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-slate-500">
                        Pay when your food is delivered.
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 p-4 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={formData.paymentMethod === "Online"}
                      onChange={handleChange}
                      disabled={loading}
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        Online Payment
                      </p>

                      <p className="text-xs text-slate-500">
                        Online gateway integration will be added later.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* ORDER SUMMARY */}
        {/* ================================= */}

        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

            {/* Items */}

            <div className="mt-6 space-y-4">
              {items.map((item) => {
                if (!item.food) {
                  return null;
                }

                return (
                  <div
                    key={item.food._id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.food.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Totals */}

            <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-900">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery</span>

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

            {/* Place Order */}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
