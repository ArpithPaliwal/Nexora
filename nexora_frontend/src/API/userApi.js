import api from "../Utils/axiosInstance";

export const registerUser = async (formData) => {
  try {
    const res = await api.post("/users/register", formData,{ withCredentials: true});

    
    
    return res.data.data ;
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
        errors:[] ,
      };
   
  }
};
}
export const loginUser = async (formData) => {
  try {
    const res = await api.post("/users/login", formData,{ withCredentials: true});

    
   
    
    return res.data.data ;
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
        errors:[] ,
      };
   
  }
  }
};



export const getCurrentUserApi = async () => {
  try {
    const res = await api.get("/users/current-user");

    
   
    
    return res.data.data ;
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
        errors:[] ,
      };
   
  }
  }
};


export const getUserChannelApi = async (_id) => {
  try {
    const res = await api.get(`/users/channel/${_id}`);

    
   
    
    return res.data.data ;
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
        errors:[] ,
      };
   
  }
  }
};



export const getWatchHistory = async (pageParam = 1) => {
  try {
    const res = await api.get(`/watchhistory?page=${pageParam}`);
    
    
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


export const Logout = async () => {
  try {
    const res = await api.post("/users/logout");

    

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