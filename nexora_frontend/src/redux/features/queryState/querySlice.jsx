// store/querySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
};

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setQuery, clearQuery } = querySlice.actions;
export default querySlice.reducer;
