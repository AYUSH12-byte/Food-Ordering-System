import { useEffect, useState } from "react";

import CategoryForm from "../../components/admin/CategoryForm";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);

  const [pageError, setPageError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await getCategories();

      setCategories(data.categories || []);
    } catch (error) {
      setPageError(
        error.response?.data?.message || "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==========================================
  // ADD CATEGORY
  // ==========================================

  const handleCreate = async (categoryData) => {
    try {
      setFormLoading(true);

      await createCategory(categoryData);

      setShowModal(false);
      setSuccessMessage("Category created successfully");

      await fetchCategories();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // UPDATE CATEGORY
  // ==========================================

  const handleUpdate = async (categoryData) => {
    try {
      setFormLoading(true);

      await updateCategory(editingCategory._id, categoryData);

      setShowModal(false);
      setEditingCategory(null);

      setSuccessMessage("Category updated successfully");

      await fetchCategories();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setPageError("");

      await deleteCategory(category._id);

      setSuccessMessage("Category deleted successfully");

      await fetchCategories();
    } catch (error) {
      setPageError(
        error.response?.data?.message || "Failed to delete category",
      );
    }
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingCategory(null);
    setShowModal(true);
    setSuccessMessage("");
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (category) => {
    setEditingCategory(category);
    setShowModal(true);
    setSuccessMessage("");
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (formLoading) {
      return;
    }

    setShowModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant food categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Category
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {pageError && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {pageError}
        </div>
      )}

      {/* Categories */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No categories found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first food category.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Description
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
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}

                        <span className="font-semibold text-slate-900">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-5">
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {category.description || "No description"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCategory
                    ? "Update category information"
                    : "Create a new food category"}
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
              <CategoryForm
                initialData={editingCategory}
                onSubmit={editingCategory ? handleUpdate : handleCreate}
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

export default Categories;
