import api from "./api";

// CREATE FEEDBACK

export const createFeedback = async (feedbackData) => {
  const response = await api.post("/feedback", feedbackData);

  return response.data;
};

// GET MY FEEDBACK

export const getMyFeedback = async () => {
  const response = await api.get("/feedback/my-feedback");

  return response.data;
};

// GET SINGLE FEEDBACK

export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`);

  return response.data;
};

// ADMIN - GET ALL FEEDBACK

export const getAllFeedback = async () => {
  const response = await api.get("/feedback");

  return response.data;
};

// ADMIN - DELETE FEEDBACK

export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`);

  return response.data;
};
