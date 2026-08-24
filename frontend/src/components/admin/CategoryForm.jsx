import { useEffect, useState } from "react";
import { FolderTree, FileText, Image } from "lucide-react";
import Button from "../ui/Button";

const initialForm = {
  name: "",
  description: "",
  image: "",
  isActive: true,
};

const CategoryForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData(initialForm);
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
      setError("Category name is required");
      return;
    }

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
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

      <div>
        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Category Name
        </label>
        <div className="relative">
          <FolderTree className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Italian Pasta"
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            disabled={loading}
          />
        </div>
      </div>

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
            placeholder="Describe this menu category..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            disabled={loading}
          />
        </div>
      </div>

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
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            disabled={loading}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
          />
          <span className="text-xs font-bold text-slate-800">
            Active category (visible on customer menu)
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} variant="primary">
          {initialData ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
