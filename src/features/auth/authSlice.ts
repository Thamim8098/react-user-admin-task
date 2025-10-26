import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../api/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const login = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: { error: string } }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await API.post<LoginResponse>("/login", { email, password });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: "Login failed" });
  }
});

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Invalid credentials";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
