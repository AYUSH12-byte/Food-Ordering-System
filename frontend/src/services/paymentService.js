import api from "./api";

// GET MY PAYMENTS

export const getMyPayments = async () => {
  const response = await api.get("/payments/my-payments");

  return response.data;
};

// GET SINGLE PAYMENT

export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);

  return response.data;
};

// ADMIN - GET ALL PAYMENTS

export const getAllPayments = async () => {
  const response = await api.get("/payments");

  return response.data;
};

// ADMIN - MARK PAYMENT AS PAID

export const markPaymentAsPaid = async (id) => {
  const response = await api.put(`/payments/${id}/paid`);

  return response.data;
};

// ADMIN - MARK PAYMENT AS FAILED

export const markPaymentAsFailed = async (id) => {
  const response = await api.put(`/payments/${id}/failed`);

  return response.data;
};
