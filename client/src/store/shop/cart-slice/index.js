import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  isLoading: false,
};

// =====================================================
// ADD TO CART
// =====================================================

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    userId,
    productId,
    quantity,
    variantId,
  }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/cart/add",
      {
        userId,
        productId,
        quantity,
        variantId,
      }
    );

    return response.data;
  }
);

// =====================================================
// FETCH CART ITEMS
// =====================================================

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/cart/get/${userId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Unable to fetch cart",
        }
      );
    }
  }
);

// =====================================================
// DELETE CART ITEM
// =====================================================

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({
    userId,
    productId,
    variantId,
  }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/${userId}/${productId}`,
      {
        data: {
          variantId,
        },
      }
    );

    return response.data;
  }
);

// =====================================================
// UPDATE CART QUANTITY
// =====================================================

export const updateCartQuantity =
  createAsyncThunk(
    "cart/updateCartQuantity",
    async ({
      userId,
      productId,
      quantity,
      variantId,
    }) => {
      const response = await axios.put(
        "http://localhost:5000/api/shop/cart/update-cart",
        {
          userId,
          productId,
          quantity,
          variantId,
        }
      );

      return response.data;
    }
  );

// =====================================================
// SLICE
// =====================================================

const shoppingCartSlice = createSlice({
  name: "shoppingCart",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // =================================================
      // ADD TO CART
      // =================================================

      .addCase(
        addToCart.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        addToCart.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.cartItems =
            action.payload.data;
        }
      )

      .addCase(
        addToCart.rejected,
        (state) => {
          state.isLoading = false;
        }
      )

      // =================================================
      // FETCH CART
      // =================================================

      .addCase(
        fetchCartItems.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        fetchCartItems.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.cartItems =
            action.payload.data;
        }
      )

      .addCase(
        fetchCartItems.rejected,
        (state) => {
          state.isLoading = false;
          state.cartItems = [];
        }
      )

      // =================================================
      // UPDATE QUANTITY
      // =================================================

      .addCase(
        updateCartQuantity.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        updateCartQuantity.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.cartItems =
            action.payload.data;
        }
      )

      .addCase(
        updateCartQuantity.rejected,
        (state) => {
          state.isLoading = false;
        }
      )

      // =================================================
      // DELETE ITEM
      // =================================================

      .addCase(
        deleteCartItem.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        deleteCartItem.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.cartItems =
            action.payload.data;
        }
      )

      .addCase(
        deleteCartItem.rejected,
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export default shoppingCartSlice.reducer;