import api from "../Utils/axiosInstance";

export const getAllTweets = async ({ pageParam = 1 }) => {
  try {
    const res = await api.get(`/tweets?page=${pageParam}&limit=20`);

    
   
    
    return res.data ;
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


export const EditTweet = async (tweetId,data) => {
  try {
    const res = await api.patch(`/tweets/${tweetId}`,data);

    
    
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
        errors:[] ,
      };
   
  }
};
}

export const DeleteTweet = async (tweetId) => {
  try {
    const res = await api.delete(`/tweets/${tweetId}`);

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
        errors:[] ,
      };
   
  }
};
}

export const getUserTweets = async (userId) => {
  try {
    const res = await api.get(`/tweets/user/${userId}`);

    
    
    return res.data ;
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
        errors:[] ,
      };
   
  }
};
}



export const createTweet = async (formData) => {
  try {
    const res = await api.post(`/tweets/`,formData);

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
        errors:[] ,
      };
   
  }
};
}