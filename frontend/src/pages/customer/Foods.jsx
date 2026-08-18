import { useEffect, useMemo, useState } from "react";

import FoodCard from "../../components/customer/FoodCard";

import { getFoods } from "../../services/foodService";

import { getCategories } from "../../services/categoryService";

const Foods = () => {
  const [foods, setFoods] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [availability, setAvailability] = useState("available");

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [foodsResponse, categoriesResponse] = await Promise.all([
        getFoods(),
        getCategories(),
      ]);

      setFoods(foodsResponse.foods || []);

      setCategories(categoriesResponse.categories || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const searchMatch =
        !search || food.name.toLowerCase().includes(search.toLowerCase());

      const foodCategory = food.category?._id || food.category;

      const categoryMatch = !category || foodCategory === category;

      const availabilityMatch =
        availability === "all"
          ? true
          : availability === "available"
            ? food.isAvailable
            : !food.isAvailable;

      return searchMatch && categoryMatch && availabilityMatch;
    });
  }, [foods, search, category, availability]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setAvailability("available");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Our Menu
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Explore Our Food
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          Browse our menu and find something delicious.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">All Categories</option>

              {categories
                .filter((item) => item.isActive)
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
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
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="available">Available</option>

              <option value="all">All</option>

              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {filteredFoods.length} food item
            {filteredFoods.length !== 1 ? "s" : ""} found
          </p>

          <button
            onClick={resetFilters}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-[430px] animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="my-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-bold text-slate-900">No food found</h2>

          <p className="mt-2 text-sm text-slate-500">
            Try another search or category.
          </p>

          <button
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Foods;
