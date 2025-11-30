import api from "../Utils/axiosInstance";

export const videoCommentsApi = async ( videoId, pageParam = 1 ) => {
  try {
    

    const res = await api.get(`/comments/${videoId}?page=${pageParam}&limit=10`);

    

    return res.data.data;  // return full pagination objects
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

export const getCommentReplyApi = async (commentId) => {
  try {
    

    const res = await api.get(`/comments/commentReplies/${commentId}`);

    

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



export const addReplyCommentApi = async (videoId,content,parentCommentId) => {
  try {
    

    const res = await api.post(`comments/${videoId}`,{
      content,
      parentCommentId
    });

   

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



export const EditCommentApi = async (commentId,content) => {
  try {
    

    const res = await api.patch(`/comments/c/${commentId}`,{
      content,
    });

    

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




export const DeleteCommentApi = async (commentId) => {
  try {
   

    const res = await api.delete(`/comments/c/${commentId}`);

   

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