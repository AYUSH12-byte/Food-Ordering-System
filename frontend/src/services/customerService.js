import api from "./api";

// GET ALL CUSTOMERS

export const getCustomers = async (search = "") => {
  const response = await api.get("/customers", {
    params: {
      search,
    },
  });

  return response.data;
};

// GET CUSTOMER BY ID

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);

  return response.data;
};

// DELETE CUSTOMER

export const deleteCustomer = async (id) => {
  const response = await api.delete(`/customers/${id}`);

  return response.data;
};
