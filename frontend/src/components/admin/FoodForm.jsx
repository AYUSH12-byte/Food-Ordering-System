import { useEffect, useState } from "react";
import { Utensils, Image, Clock, Banknote, Tag, FileText } from "lucide-react";
import Button from "../ui/Button";

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
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Food Name
        </label>
        <div className="relative">
          <Utensils className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Gourmet Truffle Pizza"
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Category
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the dish ingredients and flavors..."
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>

      {/* Price + Prep Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Price (Rs.)
          </label>
          <div className="relative">
            <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="450"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Prep Time (mins)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="number"
              name="preparationTime"
              min="1"
              value={formData.preparationTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Image URL
        </label>
        <div className="relative">
          <Image className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
          />
        </div>
      </div>

      {/* Availability Checkbox */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
          />
          <span className="text-xs font-bold text-slate-800">
            Dish is currently available for ordering
          </span>
        </label>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} variant="primary">
          {initialData ? "Save Changes" : "Create Dish"}
        </Button>
      </div>
    </form>
  );
};

export default FoodForm;
