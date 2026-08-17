import { useEffect, useState } from "react";

const defaultForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  image: "",
  isAvailable: true,
  preparationTime: 20,
};

const FoodForm = ({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(defaultForm);

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category?._id || initialData.category || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        image: initialData.image || "",
        isAvailable: initialData.isAvailable ?? true,
        preparationTime: initialData.preparationTime ?? 20,
      });
    } else {
      setFormData(defaultForm);
    }

    setError("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Food name is required");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      setError("Enter a valid price");
      return;
    }

    if (
      formData.preparationTime === "" ||
      Number(formData.preparationTime) < 1
    ) {
      setError("Preparation time must be at least 1 minute");
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        isAvailable: Boolean(formData.isAvailable),
        preparationTime: Number(formData.preparationTime),
      });
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Food Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Chicken Pizza"
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category
        </label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        >
          <option value="">Select category</option>

          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the food item"
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Price + Preparation */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Price
          </label>

          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="450"
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Preparation Time (minutes)
          </label>

          <input
            type="number"
            name="preparationTime"
            min="1"
            value={formData.preparationTime}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Image URL
        </label>

        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/food.jpg"
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
      </div>

      {/* Availability */}
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          disabled={loading}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm font-medium text-slate-700">
          Food is currently available
        </span>
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : initialData ? "Update Food" : "Add Food"}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
