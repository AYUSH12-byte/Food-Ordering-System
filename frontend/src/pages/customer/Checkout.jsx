import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, FileText, CreditCard, Banknote, ShieldCheck, ArrowLeft } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { createOrder } from "../../services/orderService";
import Button from "../../components/ui/Button";

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.deliveryAddress.trim()) {
      setError("Delivery address is required");
      toast.error("Please enter a delivery address");
      return;
    }

    if (!formData.deliveryPhone.trim()) {
      setError("Delivery phone is required");
      toast.error("Please enter a contact phone number");
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

      toast.success("Order placed successfully!");
      navigate(`/order-success/${response.order._id}`, {
        state: {
          order: response.order,
          payment: response.payment,
          receipt: response.receipt,
        },
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-4 animate-fade-in">
        <div className="animate-shimmer h-8 w-40 rounded-xl bg-slate-200" />
        <div className="animate-shimmer h-48 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg">
          <h1 className="text-xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="mt-1 text-xs text-slate-500">Add food items to your cart before proceeding.</p>
          <Link
            to="/foods"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-md"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200/80 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Final Step</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Complete Your Order
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Enter your delivery destination and confirm payment option.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Form Container */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              Delivery Information
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Street name, house/building number, city, area landmark..."
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    name="deliveryPhone"
                    value={formData.deliveryPhone}
                    onChange={handleChange}
                    placeholder="+977 98XXXXXXXX"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  />
                </div>
              </div>

              {/* Delivery Note */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    name="deliveryNote"
                    value={formData.deliveryNote}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. Ring the bell twice or leave at main reception..."
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  />
                </div>
              </div>

              {/* Payment Option */}
              <div className="pt-2">
                <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Payment Method
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition ${
                      formData.paymentMethod === "Cash on Delivery"
                        ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === "Cash on Delivery"}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                        <p className="text-[11px] text-slate-500 font-medium">Pay cash upon food arrival</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition ${
                      formData.paymentMethod === "Online"
                        ? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={formData.paymentMethod === "Online"}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Digital / Cards</p>
                        <p className="text-[11px] text-slate-500 font-medium">Online portal simulation</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-52 overflow-y-auto pr-1 divide-y divide-slate-100">
              {items.map((item) => {
                if (!item.food) return null;
                return (
                  <div key={item.food._id} className="pt-2 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.food.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">Rs. {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm">
                <span className="font-extrabold text-slate-900">Total Payable</span>
                <span className="text-xl font-extrabold text-orange-600">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Confirm & Place Order
            </Button>

            <Link
              to="/cart"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
