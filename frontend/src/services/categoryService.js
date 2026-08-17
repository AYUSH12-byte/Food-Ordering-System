import api from "./api";

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Get single category
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);

  return response.data;
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);

  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};
