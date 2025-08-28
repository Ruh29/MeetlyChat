// src/redux/adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const adminInfoFromStorage = localStorage.getItem("adminInfo")
  ? JSON.parse(localStorage.getItem("adminInfo"))
  : null;

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    adminInfo: adminInfoFromStorage,
  },
  reducers: {
    adminLogin: (state, action) => {
      state.adminInfo = action.payload;
    },
    adminLogout: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

// ✅ Selector
export const selectAdmin = (state) => state.adminAuth.adminInfo;

export default adminAuthSlice.reducer;
