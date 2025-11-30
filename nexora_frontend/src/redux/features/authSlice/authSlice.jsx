import { createSlice } from "@reduxjs/toolkit";

// Load saved auth state from localStorage
const savedAuth = JSON.parse(localStorage.getItem("authState"));

const initialState = savedAuth || {
  userData: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload.userData;
      state.isLoggedIn = true;

      // Save to localStorage
      localStorage.setItem(
        "authState",
        JSON.stringify({
          userData: state.userData,
          isLoggedIn: true,
        })
      );
    },

    logOut: (state) => {
      state.userData = null;
      state.isLoggedIn = false;

      // Clear localStorage
      localStorage.removeItem("authState");
    },
  },
});

export const { login, logOut } = authSlice.actions;
export default authSlice.reducer;
