import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// =====================================================
// REGISTER
// =====================================================

export const registerUser =
  createAsyncThunk(
    "/auth/register",

    async (
      formData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.post(
            `${API_URL}/api/auth/register`,
            formData,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message:
              error.message,
          }
        );
      }
    }
  );

// =====================================================
// LOGIN
// =====================================================

export const loginUser =
  createAsyncThunk(
    "/auth/login",

    async (
      formData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.post(
            `${API_URL}/api/auth/login`,
            formData,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message:
              error.message,
          }
        );
      }
    }
  );

// =====================================================
// LOGOUT
// =====================================================

export const logoutUser =
  createAsyncThunk(
    "/auth/logout",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.post(
            `${API_URL}/api/auth/logout`,
            {},
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message:
              error.message,
          }
        );
      }
    }
  );

// =====================================================
// CHECK AUTH
// =====================================================

export const checkAuth =
  createAsyncThunk(
    "/auth/checkauth",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/auth/check-auth`,
            {
              withCredentials: true,

              headers: {
                "Cache-Control":
                  "no-store, no-cache, must-revalidate",
              },
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message:
              error.message,
          }
        );
      }
    }
  );

// =====================================================
// SLICE
// =====================================================

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      setUser: (
        state,
        action
      ) => {
        state.user =
          action.payload;

        state.isAuthenticated =
          !!action.payload;
      },
    },

    extraReducers:
      (builder) => {
        builder

          .addCase(
            registerUser.pending,
            (state) => {
              state.isLoading =
                true;
            }
          )

          .addCase(
            registerUser.fulfilled,
            (state) => {
              state.isLoading =
                false;
              state.user = null;
              state.isAuthenticated =
                false;
            }
          )

          .addCase(
            registerUser.rejected,
            (state) => {
              state.isLoading =
                false;
            }
          )

          .addCase(
            loginUser.pending,
            (state) => {
              state.isLoading =
                true;
            }
          )

          .addCase(
            loginUser.fulfilled,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.user =
                action.payload
                  ?.success
                  ? action.payload.user
                  : null;

              state.isAuthenticated =
                !!action.payload
                  ?.success;
            }
          )

          .addCase(
            loginUser.rejected,
            (state) => {
              state.isLoading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;
            }
          )

          .addCase(
            checkAuth.pending,
            (state) => {
              state.isLoading =
                true;
            }
          )

          .addCase(
            checkAuth.fulfilled,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.user =
                action.payload
                  ?.success
                  ? action.payload.user
                  : null;

              state.isAuthenticated =
                !!action.payload
                  ?.success;
            }
          )

          .addCase(
            checkAuth.rejected,
            (state) => {
              state.isLoading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;
            }
          )

          .addCase(
            logoutUser.fulfilled,
            (state) => {
              state.isLoading =
                false;

              state.user =
                null;

              state.isAuthenticated =
                false;
            }
          );
      },
  });

export const {
  setUser,
} = authSlice.actions;

export default authSlice.reducer;