import api from "../Utils/axiosInstance";

export const getUserPlaylist = async (userId) => {
  try {
    const res = await api.get(`/playlist/user/${userId}`);

    // Return data if status is 200, otherwise empty array

    return res.data;
  } catch (error) {
    if (error.response) {
      // Throw an object with status & message
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
export const createPlaylist = async (formData) => {
  try {
    const res = await api.post(`/playlist/`, formData);

    

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

export const editPlaylist = async (playlistId, formData) => {
  try {
    const res = await api.patch(`/playlist/${playlistId}`, formData);

    
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

export const deletePlaylist = async (playlistId) => {
  try {
    const res = await api.delete(`/playlist/${playlistId}`);

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

export const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    const res = await api.patch(`/playlist/add/${videoId}/${playlistId}`);

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

export const getPlaylistContent = async (playlistId) => {
  try {
    const res = await api.get(`/playlist/${playlistId}`);

    

    return res.data;
  } catch (error) {
    if (error.response) {
      // Throw an object with status & message
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

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    const res = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);

    

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
