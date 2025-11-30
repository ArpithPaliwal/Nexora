import api from "../Utils/axiosInstance";

export const fetchVideos = async (
  pageParam = 1,
  query,
  sortBy = "createdAt",
  sortType = "desc"
) => {
  try {
    const res = await api.get(
      `/videos?page=${pageParam}&limit=10&query=${query}&sortBy=${sortBy}&sortType=${sortType}`
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

export const getLikedVideos = async (pageParam = 1) => {
  try {
    const res = await api.get(`/likes/videos?page=${pageParam}`);
    
    

    return res.data.data;
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

export const fetchVideoById = async (_id) => {
  try {
    

    const res = await api.get(`videos/${_id}`);

   
    return res.data.data;
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

export const getUserVideos = async (_id, pageParam = 1) => {
  try {
    const res = await api.get(`/videos/Videos/${_id}/?page=${pageParam}`);

    return res.data.data;
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

export const uploadVideo = async (formData) => {
  try {
    
    
    const res = await api.post(`/videos/`,formData,{headers: { "Content-Type": "multipart/form-data" }});

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

export const editVideo = async (videoId,formData) => {
  try {
    const res = await api.patch(`/videos/${videoId}`,formData);

    return res.data.data;
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



export const dleteVideo = async (videoId) => {
  try {
    const res = await api.delete(`/videos/${videoId}`);

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

export const fetchSubscribedVideos = async (
  pageParam = 1,
  
) => {
  try {
    const res = await api.get(
      `/videos/v/subscribed?page=${pageParam}&limit=10`
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
