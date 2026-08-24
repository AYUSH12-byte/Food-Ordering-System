import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, FolderTree } from "lucide-react";

import CategoryForm from "../../components/admin/CategoryForm";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

const Categories = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setPageError("");
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load categories";
      setPageError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (categoryData) => {
    try {
      setFormLoading(true);
      await createCategory(categoryData);
      setShowModal(false);
      toast.success("Category created successfully!");
      await fetchCategories();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (categoryData) => {
    try {
      setFormLoading(true);
      await updateCategory(editingCategory._id, categoryData);
      setShowModal(false);
      setEditingCategory(null);
      toast.success("Category updated successfully!");
      await fetchCategories();
    } catch (error) {
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        setPageError("");
        await deleteCategory(category._id);
        toast.info("Category deleted successfully");
        await fetchCategories();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete category";
        setPageError(msg);
        toast.error(msg);
      }
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    if (!formLoading) {
      setShowModal(false);
      setEditingCategory(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200/80 mb-2">
            <FolderTree className="h-3.5 w-3.5" />
            <span>Menu Management</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Category Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Organize food offerings into clear customer categories.
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" icon={Plus}>
          Add Category
        </Button>
      </div>

      {pageError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          {pageError}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : categories.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mx-auto mb-3">
              <FolderTree className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No categories found</h3>
            <p className="mt-1 text-xs text-slate-500">Create your first food category to get started.</p>
            <Button onClick={openAddModal} variant="primary" className="mt-4" icon={Plus}>
              Add Category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] text-slate-400 font-bold">
                            No Img
                          </div>
                        )}
                        <span className="font-bold text-slate-900 text-sm">{category.name}</span>
                      </div>
                    </td>
                    <td className="max-w-md px-6 py-4 text-slate-600">
                      <p className="line-clamp-2 leading-relaxed">{category.description || "No description provided."}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${category.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
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

      {/* Unified Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        subtitle={editingCategory ? "Update details for this food category" : "Create a new section for your customer menu"}
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Categories;
