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
  orderId: null,
  orderList: [],
  orderDetails: null,
  error: null,
};

// =====================================================
// CREATE ORDER
// =====================================================

export const createNewOrder =
  createAsyncThunk(
    "/order/createNewOrder",

    async (
      orderData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.post(
            `${API_URL}/api/shop/order/create`,
            orderData,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        console.error(
          "CREATE ORDER ERROR:",
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
// CAPTURE PAYMENT
// =====================================================

export const capturePayment =
  createAsyncThunk(
    "/order/capturePayment",

    async (
      paymentData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.post(
            `${API_URL}/api/shop/order/capture`,
            paymentData,
            {
              withCredentials: true,
            }
          );

        return response.data;
      } catch (error) {
        console.error(
          "CAPTURE PAYMENT ERROR:",
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
// GET USER ORDERS
// =====================================================

export const getAllOrdersByUserId =
  createAsyncThunk(
    "/order/getAllOrdersByUserId",

    async (
      userId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/shop/order/list/${userId}`,
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
// GET ORDER DETAILS
// =====================================================

export const getOrderDetails =
  createAsyncThunk(
    "/order/getOrderDetails",

    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/shop/order/details/${id}`,
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
// SLICE
// =====================================================

const shoppingOrderSlice =
  createSlice({
    name:
      "shoppingOrderSlice",

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

    extraReducers:
      (builder) => {
        builder

          .addCase(
            createNewOrder.pending,
            (state) => {
              state.isLoading =
                true;
              state.error =
                null;
            }
          )

          .addCase(
            createNewOrder.fulfilled,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.orderId =
                action.payload?.orderId ||
                null;
            }
          )

          .addCase(
            createNewOrder.rejected,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.error =
                action.payload
                  ?.message ||
                "Failed to create order.";
            }
          )

          .addCase(
            capturePayment.pending,
            (state) => {
              state.isLoading =
                true;
              state.error =
                null;
            }
          )

          .addCase(
            capturePayment.fulfilled,
            (state) => {
              state.isLoading =
                false;
            }
          )

          .addCase(
            capturePayment.rejected,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.error =
                action.payload
                  ?.message ||
                "Payment verification failed.";
            }
          )

          .addCase(
            getAllOrdersByUserId.pending,
            (state) => {
              state.isLoading =
                true;
            }
          )

          .addCase(
            getAllOrdersByUserId.fulfilled,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.orderList =
                action.payload
                  ?.data || [];
            }
          )

          .addCase(
            getAllOrdersByUserId.rejected,
            (
              state
            ) => {
              state.isLoading =
                false;

              state.orderList =
                [];
            }
          )

          .addCase(
            getOrderDetails.pending,
            (state) => {
              state.isLoading =
                true;
            }
          )

          .addCase(
            getOrderDetails.fulfilled,
            (
              state,
              action
            ) => {
              state.isLoading =
                false;

              state.orderDetails =
                action.payload
                  ?.data || null;
            }
          )

          .addCase(
            getOrderDetails.rejected,
            (state) => {
              state.isLoading =
                false;

              state.orderDetails =
                null;
            }
          );
      },
  });

export const {
  resetOrderDetails,
  clearOrderError,
} =
  shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;