import axios from "axios";
import { store } from "../store/store";
import { logOut } from "../redux/features/authSlice/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await api.post("/users/refresh-token");
        
        return api(original); 
      } catch (err) {
        console.log(err);
        
        store.dispatch(logOut());
        window.location.href = "/LoginForm";  // replace navigate()
      }
    }

    return Promise.reject(err);
  }
);

export default api;
