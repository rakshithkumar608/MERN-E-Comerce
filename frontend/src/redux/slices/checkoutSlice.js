import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";

const getUserToken = () => {
  const token = localStorage.getItem("userToken");
  return token ? `Bearer ${token}` : "";
};

// Async thunk to directly create an order with mock / card / COD payment
export const createDirectOrder = createAsyncThunk(
  "checkout/createDirectOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/create-order`,
        orderData,
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || error.message
      );
    }
  }
);

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || error.message
      );
    }
  }
);

// Async thunk to pay for checkout
export const payCheckout = createAsyncThunk(
  "checkout/payCheckout",
  async ({ id, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/checkout/${id}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails,
        },
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || error.message
      );
    }
  }
);

// Async thunk to finalize checkout into an order
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/${id}/finalize`,
        {},
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || error.message
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    order: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Direct order creation
      .addCase(createDirectOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDirectOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createDirectOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to place order";
      })

      // Create checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create checkout";
      })

      // Pay checkout
      .addCase(payCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.error = null;
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Payment failed";
      })

      // Finalize checkout
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to finalize order";
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
