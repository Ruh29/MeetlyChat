// import { createSlice } from "@reduxjs/toolkit";

// const userInfoFromStorage = localStorage.getItem("userInfo")
//   ? JSON.parse(localStorage.getItem("userInfo"))
//   : null;

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     userInfo: userInfoFromStorage,
//   },
//   reducers: {
//     login: (state, action) => {
//       state.userInfo = action.payload;
//       localStorage.setItem("userInfo", JSON.stringify(action.payload));
//     },
//     logout: (state) => {
//       state.userInfo = null;
//       localStorage.removeItem("userInfo");
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export const selectUser = (state) => state.auth.user;
// export const selectUserToken = (state) => state.auth.token;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("auth") || "null");

const slice = createSlice({
  name: "auth",
  initialState: saved || {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  },
  reducers: {
    loginStep1: (state, action) => {
      // after /login (OTP sent)
      state.pendingEmail = action.payload.email;
    },
    verifySuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      delete state.pendingEmail;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    }
  }
});

export const { loginStep1, verifySuccess, setTokens, logout } = slice.actions;

export const selectAuth = (s) => s.auth;
export const selectUser = (s) => s.auth.user;
export const selectIsAuthed = (s) => s.auth.isAuthenticated;
export const selectRole = (s) => s.auth.user?.role;

export default slice.reducer;
