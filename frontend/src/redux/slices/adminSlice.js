import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    }
  );
  return response.data; // Added missing return statement
});

//Add the create user action
export const addUser = createAsyncThunk("admin/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      userData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

//Update user info
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name, email, role }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      { name, email, role },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Fixed token key case
        },
      }
    );
    return response.data; // Added missing return statement
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

//Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Fixed token key case
        },
      }
    );
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users cases
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Fixed: was setting users instead of error
      })

      // Add user cases
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user || action.payload); // Handle both possible response formats
      })
      .addCase(addUser.rejected, (state, action) => { // Fixed: was addUser.pending
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to add user";
      })

      // Update user cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex((user) => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser; // Fixed: was state.user instead of state.users
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to update user";
      })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Failed to delete user";
      });
  },
});

export const { clearError, clearUsers } = adminSlice.actions;
export default adminSlice.reducer;