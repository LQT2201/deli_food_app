import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./slices/basketSlice";
import restaurantReducer from "./slices/restaurantSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    restaurant: restaurantReducer,
    auth: authReducer,
  },
});
