import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to get user token
const getUserToken = () => {
  const token = localStorage.getItem("userToken");
  return token ? `Bearer ${token}` : null;
};

// async thunk to fetch all products (admin only)
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchAdminProducts", async () => {
  const response = await axios.get(`${API_URL}/api/admin/products`, {
    headers: {
      Authorization: getUserToken(),
    },
  })
  return response.data;
});

// async function to create a new product
export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData) => { 
  const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
    headers: {
      Authorization: getUserToken(),
    }
  })
  return response.data;
});

//async thunk to update an existing products
export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({id, productData}) => {
  const response = await axios.put(`${API_URL}/api/admin/products/${id}`, productData, {
    headers: {
      Authorization: getUserToken(),
    }
  })
  return response.data;
});

//async thunk to delete a product
export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id) => {
  await axios.delete(`${API_URL}/api/admin/products/${id}`, {
    headers: {
      Authorization: getUserToken(),
    }
  })
  return id;
});

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //Create Products
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      //Update Products
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // Delete Products
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;