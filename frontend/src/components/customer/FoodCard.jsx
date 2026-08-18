import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const FoodCard = ({ food }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    // User must login first
    if (!user) {
      setMessage("Please login to add food to cart");
      return;
    }

    // Only customers can use cart
    if (user.role !== "customer") {
      setMessage("Only customers can add food to cart");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      await addToCart(food._id, 1);

      setMessage("Added to cart");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to add food to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Food Image */}
      <div className="relative">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 items-center justify-center bg-slate-100 text-sm text-slate-400">
            No Image
          </div>
        )}

        {!food.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-600">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Food Information */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {food.name}
            </h3>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {food.category?.name || "Uncategorized"}
            </p>
          </div>

          <p className="whitespace-nowrap font-bold text-slate-900">
            Rs. {Number(food.price).toFixed(2)}
          </p>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {food.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {food.preparationTime || 20} min
          </span>

          <span>
            {food.isAvailable
              ? "Available"
              : "Unavailable"}
          </span>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-3 text-sm font-medium ${
              message === "Added to cart"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!food.isAvailable || adding}
          className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {adding
            ? "Adding..."
            : food.isAvailable
            ? "Add to Cart"
            : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;