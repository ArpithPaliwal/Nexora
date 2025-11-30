import api from "../Utils/axiosInstance";

export const changePassword = async (data) => {
  try {
    const res = await api.post("/users/change-password", data);

    return res
  } catch (error) {
    if (error.response) {
      
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
    } else {
      throw {
        status: 500,
        message: "Network error or server is down",
        errors: [],
      };
    }
  }
};


export const updateAvatar = async (formData) => {
  try {
    const res = await api.patch("/users/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data; 
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
    } else {
      throw {
        status: 500,
        message: "Network error or server is down",
        errors: [],
      };
    }
  }
};


export const updateCoverImage = async (formData) => {
  try {
    const res = await api.patch("/users/update-cover-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data; 
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
    } else {
      throw {
        status: 500,
        message: "Network error or server is down",
        errors: [],
      };
    }
  }
};

export const updateAccountDetails = async (formData) => {
  try {
    const res = await api.patch("/users/update-account", formData,
      
    );

    return res.data; 
  } catch (error) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data.message,
        errors: error.response.data.errors || [],
      };
    } else {
      throw {
        status: 500,
        message: "Network error or server is down",
        errors: [],
      };
    }
  }
};

