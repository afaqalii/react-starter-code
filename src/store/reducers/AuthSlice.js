import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false, isLoading: true },
  reducers: {
    setAuth: (state, action) => {
      return {
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: action.payload.isLoading
      };
    }
  },
});
export const { setAuth } = AuthSlice.actions;
export default AuthSlice.reducer;