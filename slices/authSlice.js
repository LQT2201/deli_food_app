import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeUser,
  removeUser,
  getUser,
  storeAuthToken,
  removeAuthToken,
} from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Get stored users
      const storedUsers = await AsyncStorage.getItem("@users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // Store current user and token
      await storeUser(user);
      await storeAuthToken("mock-token");

      return { user, token: "mock-token" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Get stored users
      const storedUsers = await AsyncStorage.getItem("@users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.some((u) => u.email === email)) {
        return rejectWithValue("Email already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      // Add to users list and store
      users.push(newUser);
      await AsyncStorage.setItem("@users", JSON.stringify(users));

      // Store current user and token
      await storeUser(newUser);
      await storeAuthToken("mock-token");

      return { user: newUser, token: "mock-token" };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await removeUser();
      await removeAuthToken();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadStoredUser = createAsyncThunk(
  "auth/loadStoredUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      // Load stored user
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { clearError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
