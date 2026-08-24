import { useEffect, useMemo, useState } from "react";
import { Plus, Edit3, Trash2, Utensils, Search, RotateCcw, Clock } from "lucide-react";

import FoodForm from "../../components/admin/FoodForm";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService";
import { getCategories } from "../../services/categoryService";

const Foods = () => {
  const toast = useToast();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setPageError("");

      const [foodsData, categoriesData] = await Promise.all([
        getFoods(),
        getCategories(),
      ]);

      setFoods(foodsData.foods || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load food data";
      setPageError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch =
        !search || food.name.toLowerCase().includes(search.toLowerCase());
      const foodCategory = food.category?._id || food.category;
      const matchesCategory =
        !categoryFilter || foodCategory === categoryFilter;
      const matchesAvailability =
        availabilityFilter === ""
          ? true
          : availabilityFilter === "available"
          ? food.isAvailable
          : !food.isAvailable;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [foods, search, categoryFilter, availabilityFilter]);

  const handleCreate = async (foodData) => {
    try {
      setFormLoading(true);
      await createFood(foodData);
      setShowModal(false);
      toast.success("Food item created successfully!");
      await fetchData();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (foodData) => {
    try {
      setFormLoading(true);
      await updateFood(editingFood._id, foodData);
      setShowModal(false);
      setEditingFood(null);
      toast.success("Food item updated successfully!");
      await fetchData();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (food) => {
    if (window.confirm(`Are you sure you want to delete "${food.name}"?`)) {
      try {
        setPageError("");
        await deleteFood(food._id);
        toast.info("Food item deleted successfully");
        await fetchData();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete food item";
        setPageError(msg);
        toast.error(msg);
      }
    }
  };

  const openAddModal = () => {
    setEditingFood(null);
    setShowModal(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setShowModal(true);
  };

  const closeModal = () => {
    if (!formLoading) {
      setShowModal(false);
      setEditingFood(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setAvailabilityFilter("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200/80 mb-2">
            <Utensils className="h-3.5 w-3.5" />
            <span>Menu Items</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Food Item Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Manage pricing, stock status, and dish descriptions for your store.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" icon={Plus}>
          Add Food Item
        </Button>
      </div>

      {pageError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          {pageError}
        </div>
      )}

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food by name..."
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
            >
              <option value="">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredFoods.length}</strong> of {foods.length} items
          </span>
          <button onClick={resetFilters} className="flex items-center gap-1 font-bold text-slate-600 hover:text-orange-600 transition">
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : filteredFoods.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mx-auto mb-3">
              <Utensils className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No food items found</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting filter inputs or add a new food item.</p>
            <Button onClick={openAddModal} variant="primary" className="mt-4" icon={Plus}>
              Add Food Item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Dish</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Prep Time</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {food.image ? (
                          <img
                            src={food.image}
                            alt={food.name}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-400 font-bold">
                            No Img
                          </div>
                        )}
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 text-sm">{food.name}</p>
                          <p className="line-clamp-1 text-slate-500 mt-0.5">{food.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {food.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-orange-600 text-sm">
                        Rs. {Number(food.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {food.preparationTime} mins
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                          food.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${food.isAvailable ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(food)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingFood ? "Edit Food Item" : "Add Food Item"}
        subtitle={editingFood ? "Update pricing and dish specifications" : "Create a new dish entry for the restaurant menu"}
        maxWidth="max-w-2xl"
      >
        <FoodForm
          initialData={editingFood}
          categories={categories}
          onSubmit={editingFood ? handleUpdate : handleCreate}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Foods;
