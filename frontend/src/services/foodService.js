import api from "./api";

// ==========================================
// GET FOODS
// ==========================================

export const getFoods = async (
  params = {}
) => {
  const response = await api.get(
    "/foods",
    {
      params,
    }
  );

  return response.data;
};

// ==========================================
// GET SINGLE FOOD
// ==========================================

export const getFoodById = async (
  id
) => {
  const response = await api.get(
    `/foods/${id}`
  );

  return response.data;
};

// ==========================================
// CREATE FOOD - ADMIN
// ==========================================

export const createFood = async (
  foodData
) => {
  const response = await api.post(
    "/foods",
    foodData
  );

  return response.data;
};

// ==========================================
// UPDATE FOOD - ADMIN
// ==========================================

export const updateFood = async (
  id,
  foodData
) => {
  const response = await api.put(
    `/foods/${id}`,
    foodData
  );

  return response.data;
};

// ==========================================
// DELETE FOOD - ADMIN
// ==========================================

export const deleteFood = async (
  id
) => {
  const response = await api.delete(
    `/foods/${id}`
  );

  return response.data;
};