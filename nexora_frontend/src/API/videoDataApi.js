import api from "../Utils/axiosInstance";

export const getVideoDetailsApi = async (videoId) => {
  try {
    

    const res = await api.get(`videoDetails/getVideoDetails/${videoId}`);

    

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


export const toggleSubscribeApi = async (channelId)=>{
  try {
    

    const res = await api.post(`/subscriptions/c/${channelId}`);

    

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
}



export const toggleLikeApi = async (videoId)=>{
  try {
    

    const res = await api.post(`/likes/toggle/v/${videoId}`);

    

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
}


export const getLikeCount = async (videoId) => {
  try {
    

    const res = await api.get(`videos/${videoId}`);

   

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

export const getLikeStatus = async (videoId) => {
  try {
    

    const res = await api.get(`videos/${videoId}`);

   

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
