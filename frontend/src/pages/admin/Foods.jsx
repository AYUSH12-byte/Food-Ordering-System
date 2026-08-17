import { useEffect, useMemo, useState } from "react";

import FoodForm from "../../components/admin/FoodForm";

import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService";

import { getCategories } from "../../services/categoryService";

const Foods = () => {
  const [foods, setFoods] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);

  const [pageError, setPageError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingFood, setEditingFood] = useState(null);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [availabilityFilter, setAvailabilityFilter] = useState("");

  // ==========================================
  // LOAD DATA
  // ==========================================

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
      setPageError(error.response?.data?.message || "Failed to load food data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // FILTER FOODS
  // ==========================================

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

  // ==========================================
  // CREATE
  // ==========================================

  const handleCreate = async (foodData) => {
    try {
      setFormLoading(true);

      await createFood(foodData);

      setShowModal(false);

      setSuccessMessage("Food item created successfully");

      await fetchData();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // UPDATE
  // ==========================================

  const handleUpdate = async (foodData) => {
    try {
      setFormLoading(true);

      await updateFood(editingFood._id, foodData);

      setShowModal(false);
      setEditingFood(null);

      setSuccessMessage("Food item updated successfully");

      await fetchData();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (food) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${food.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageError("");

      await deleteFood(food._id);

      setSuccessMessage("Food item deleted successfully");

      await fetchData();
    } catch (error) {
      setPageError(
        error.response?.data?.message || "Failed to delete food item",
      );
    }
  };

  // ==========================================
  // MODALS
  // ==========================================

  const openAddModal = () => {
    setEditingFood(null);
    setShowModal(true);
    setSuccessMessage("");
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setShowModal(true);
    setSuccessMessage("");
  };

  const closeModal = () => {
    if (formLoading) {
      return;
    }

    setShowModal(false);
    setEditingFood(null);
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setAvailabilityFilter("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Food Items
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant menu
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Food
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {pageError && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {pageError}
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Availability
            </label>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">All</option>

              <option value="available">Available</option>

              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredFoods.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">{foods.length}</span>{" "}
            foods
          </p>

          <button
            onClick={resetFilters}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Food Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading food items...
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No food items found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters or add a new food item.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Food
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Prep Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-slate-50">
                    {/* Food */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {food.image ? (
                          <img
                            src={food.image}
                            alt={food.name}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}

                        <div className="max-w-xs">
                          <p className="font-semibold text-slate-900">
                            {food.name}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {food.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {food.category?.name || "Unknown"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">
                      <span className="font-semibold text-slate-900">
                        Rs. {Number(food.price).toFixed(2)}
                      </span>
                    </td>

                    {/* Preparation */}
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">
                        {food.preparationTime} min
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          food.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(food)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(food)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingFood ? "Edit Food" : "Add Food"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingFood
                    ? "Update food item information"
                    : "Add a new item to your menu"}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={formLoading}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <FoodForm
                initialData={editingFood}
                categories={categories}
                onSubmit={editingFood ? handleUpdate : handleCreate}
                onCancel={closeModal}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Foods;
