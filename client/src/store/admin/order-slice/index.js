import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
  error: null,
};

// =====================================================
// GET ALL ADMIN ORDERS
// =====================================================

export const getAllOrdersForAdmin =
  createAsyncThunk(
    "/order/getAllOrdersForAdmin",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/admin/orders/get`,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        console.error(
          "GET ADMIN ORDERS ERROR:",
          error.response?.data ||
            error.message
        );

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
// GET ADMIN ORDER DETAILS
// =====================================================

export const getOrderDetailsForAdmin =
  createAsyncThunk(
    "/order/getOrderDetailsForAdmin",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/admin/orders/details/${id}`,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        console.error(
          "GET ADMIN ORDER DETAILS ERROR:",
          error.response?.data ||
            error.message
        );

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
// UPDATE ORDER STATUS
// =====================================================

export const updateOrderStatus =
  createAsyncThunk(
    "/order/updateOrderStatus",

    async (
      { id, orderStatus },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.put(
            `${API_URL}/api/admin/orders/update/${id}`,
            {
              orderStatus,
            },
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        console.error(
          "UPDATE ORDER STATUS ERROR:",
          error.response?.data ||
            error.message
        );

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

const adminOrderSlice =
  createSlice({
    name: "adminOrderSlice",

    initialState,

    reducers: {
      resetOrderDetails: (
        state
      ) => {
        state.orderDetails =
          null;
      },

      clearOrderError: (
        state
      ) => {
        state.error = null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // ---------------------------------------------
        // GET ALL ORDERS
        // ---------------------------------------------

        .addCase(
          getAllOrdersForAdmin.pending,
          (state) => {
            state.isLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          getAllOrdersForAdmin.fulfilled,
          (
            state,
            action
          ) => {
            state.isLoading =
              false;

            state.orderList =
              action.payload?.data ||
              [];

            state.error = null;
          }
        )

        .addCase(
          getAllOrdersForAdmin.rejected,
          (
            state,
            action
          ) => {
            state.isLoading =
              false;

            state.orderList =
              [];

            state.error =
              action.payload
                ?.message ||
              "Failed to fetch orders.";
          }
        )

        // ---------------------------------------------
        // ORDER DETAILS
        // ---------------------------------------------

        .addCase(
          getOrderDetailsForAdmin.pending,
          (state) => {
            state.isLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          getOrderDetailsForAdmin.fulfilled,
          (
            state,
            action
          ) => {
            state.isLoading =
              false;

            state.orderDetails =
              action.payload?.data ||
              null;
          }
        )

        .addCase(
          getOrderDetailsForAdmin.rejected,
          (
            state,
            action
          ) => {
            state.isLoading =
              false;

            state.orderDetails =
              null;

            state.error =
              action.payload
                ?.message ||
              "Failed to fetch order details.";
          }
        )

        // ---------------------------------------------
        // UPDATE STATUS
        // ---------------------------------------------

        .addCase(
          updateOrderStatus.pending,
          (state) => {
            state.isLoading =
              true;

            state.error = null;
          }
        )

        .addCase(
          updateOrderStatus.fulfilled,
          (state) => {
            state.isLoading =
              false;
          }
        )

        .addCase(
          updateOrderStatus.rejected,
          (
            state,
            action
          ) => {
            state.isLoading =
              false;

            state.error =
              action.payload
                ?.message ||
              "Failed to update order status.";
          }
        );
    },
  });

export const {
  resetOrderDetails,
  clearOrderError,
} =
  adminOrderSlice.actions;

export default adminOrderSlice.reducer;