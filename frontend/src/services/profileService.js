import api from "./api";

// GET PROFILE

export const getProfile =
  async () => {
    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  };

// UPDATE PROFILE

export const updateProfile =
  async (profileData) => {
    const response =
      await api.put(
        "/auth/profile",
        profileData
      );

    return response.data;
  };

// CHANGE PASSWORD

export const changePassword =
  async (passwordData) => {
    const response =
      await api.put(
        "/auth/change-password",
        passwordData
      );

    return response.data;
  };