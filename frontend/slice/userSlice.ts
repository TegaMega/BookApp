// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
//Types

type SignupCredentials = {
  email: string;
  username: string;
  password: string;
};

type loginCredentials = {
  email: string;
  password: string;
};

type User = {
  id?: number;
  email: string;
  password: string;
  username: string;
};

type UserState = {
  user: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
};

const initialState: UserState = {
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
};

// Thunks for async actions
export const signup = createAsyncThunk(
  "user/signup",
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        credentials,
        { withCredentials: true }
      );
      toast.success("Account created successfully");
      return response.data.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Signup failed");
        return rejectWithValue(null);
      }
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials: loginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials,
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("user not found");
        console.log(error.message);
        return rejectWithValue(null);
      }
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Logged out successfully");
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Logout failed:" + error.message);
        return rejectWithValue(null);
      }
    }
  }
);

export const authCheck = createAsyncThunk(
  "user/authCheck",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/authCheck",
        {
          withCredentials: true,
        }
      );

      // If user is returned, session is valid
      if (response.data?.user) {
        return response.data.user;
      } else {
        // No user returned, treat as invalid session
        return rejectWithValue("Session invalid");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log("authCheck failed:", message);

      // Only reject if server explicitly denies session
      return rejectWithValue(message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSigningUp = false;
      })
      .addCase(signup.rejected, (state) => {
        state.user = null;
        state.isSigningUp = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isLoggingIn = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggingOut = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggingOut = false;
      })

      // Auth Check
      .addCase(authCheck.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(authCheck.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload;
      })
      .addCase(authCheck.rejected, (state, action) => {
        state.isCheckingAuth = false;

        // Optional: only clear user if session is truly invalid
        if (action.payload === "Session invalid") {
          state.user = null;
        } else {
          console.warn(
            "authCheck failed but not clearing user:",
            action.payload
          );
        }
      });
  },
});

export default userSlice.reducer;
