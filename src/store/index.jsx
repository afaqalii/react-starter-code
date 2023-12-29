import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./reducers/AuthSlice";

const rootReducer = {
  auth: AuthSlice,
};

export const store = configureStore({
  reducer: rootReducer,
});
