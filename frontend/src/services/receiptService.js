import api from "./api";

// GET RECEIPT

export const getReceiptById = async (id) => {
  const response = await api.get(`/receipts/${id}`);

  return response.data;
};

// DOWNLOAD RECEIPT PDF

export const downloadReceipt = async (id) => {
  const response = await api.get(`/receipts/${id}/download`, {
    responseType: "blob",
  });

  return response;
};
