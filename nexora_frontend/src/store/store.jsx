import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/authSlice/authSlice"

import queryReducer from "../redux/features/queryState/querySlice";
export const store = configureStore({
    reducer:{
        auth:authReducer,
        
        query: queryReducer,
    }
})