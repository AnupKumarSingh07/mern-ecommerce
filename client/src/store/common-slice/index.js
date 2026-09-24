import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// ===============================
// GET ALL FEATURE/BANNER IMAGES
// ===============================
export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${API_URL}/api/common/feature/get`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// ===============================
// ADD FEATURE/BANNER IMAGE
// ===============================
export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${API_URL}/api/common/feature/add`,
      {
        image,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

// ===============================
// DELETE FEATURE/BANNER IMAGE
// ===============================
export const deleteFeatureImage = createAsyncThunk(
  "common/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(
      `${API_URL}/api/common/feature/delete/${id}`,
      {
        withCredentials: true,
      }
    );

    return {
      ...response.data,
      id,
    };
  }
);

// ===============================
// COMMON SLICE
// ===============================
const commonSlice = createSlice({
  name: "commonSlice",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ===============================
      // GET
      // ===============================
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;

        state.featureImageList = action.payload.data || [];
      })

      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })

      // ===============================
      // ADD
      // ===============================
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.data) {
          state.featureImageList.unshift(action.payload.data);
        }
      })

      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false;
      })

      // ===============================
      // DELETE
      // ===============================
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;

        state.featureImageList = state.featureImageList.filter(
          (item) => item._id !== action.payload.id
        );
      })

      .addCase(deleteFeatureImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;