import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, Sparkles } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";

const Cart = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const items = cart?.items || [];

  const deliveryCharge = items.length > 0 ? 50 : 0;
  const subtotal = Number(cart?.subtotal || 0);
  const total = subtotal + deliveryCharge;

  const increaseQuantity = async (item) => {
    try {
      await updateCartItem(item.food?._id, item.quantity + 1);
    } catch (err) {
      toast.error("Failed to update item quantity");
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) return;
    try {
      await updateCartItem(item.food?._id, item.quantity - 1);
    } catch (err) {
      toast.error("Failed to update item quantity");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.food?._id);
      toast.info(`Removed ${item.food?.name} from cart`);
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        toast.info("Cart cleared successfully");
      } catch (err) {
        toast.error("Failed to clear cart");
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-4 animate-fade-in">
        <div className="animate-shimmer h-8 w-48 rounded-xl bg-slate-200" />
        <div className="animate-shimmer h-36 rounded-2xl bg-slate-200" />
        <div className="animate-shimmer h-36 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10 animate-scale-up">
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-lg">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 shadow-inner">
            <ShoppingBag className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
            Your Shopping Cart is Empty
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
            Explore our delicious menu and discover your favorite meals today.
          </p>

          <Link
            to="/foods"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition"
          >
            <Sparkles className="h-4 w-4" />
            Browse Menu Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200/80 mb-2">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Review Items</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Your Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {items.length} item{items.length !== 1 ? "s" : ""} selected for checkout
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const food = item.food;
            if (!food) return null;
            const itemTotal = Number(food.price) * item.quantity;

            return (
              <div
                key={food._id}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 sm:p-5"
              >
                <div className="flex gap-4">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28 border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-400 font-bold sm:h-28 sm:w-28">
                      No Image
                    </div>
                  )}

                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-bold text-slate-900 text-base">
                            {food.name}
                          </h2>
                          <p className="mt-0.5 text-xs text-slate-500 font-medium">
                            {food.category?.name || "Uncategorized"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-slate-600">
                        Rs. {Number(food.price).toFixed(2)} each
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-50 transition"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex h-8 min-w-8 items-center justify-center border-x border-slate-200 px-2 text-xs font-extrabold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item)}
                          className="flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-200 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-base font-extrabold text-orange-600">
                        Rs. {itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/foods"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition pt-2"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Flat Delivery Fee</span>
                <span className="font-bold text-slate-900">Rs. {deliveryCharge.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              className="w-full"
              icon={CreditCard}
            >
              Proceed to Checkout
            </Button>

            <p className="text-center text-[11px] text-slate-400 font-medium">
              🔒 Safe & Secure Checkout Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
