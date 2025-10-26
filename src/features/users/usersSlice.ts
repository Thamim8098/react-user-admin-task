import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../api/api";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UsersPageResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

interface UsersState {
  pages: { [key: number]: UsersPageResponse };
  list: User[];
  status: string;
  loading: boolean;
  total_pages: number;
  total: number;
  error: string | null;
  viewMode: "table" | "card";
  search: string;
}

export const fetchUsersPage = createAsyncThunk<
  UsersPageResponse,
  number,
  { rejectValue: { error: string } }
>("users/fetchUsersPage", async (page = 1, { rejectWithValue }) => {
  try {
    const res = await API.get<UsersPageResponse>("/users", {
      params: { page },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: "Failed to fetch" });
  }
});

export const createUser = createAsyncThunk<
  User,
  Omit<User, "id">,
  { rejectValue: { error: string } }
>("users/createUser", async (payload, { rejectWithValue }) => {
  try {
    const res = await API.post<{ id: number; createdAt: string }>(
      "/users",
      payload
    );
    return {
      ...payload,
      id: res.data.id || Math.floor(Math.random() * 100000),
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: "Create failed" });
  }
});

export const updateUser = createAsyncThunk<
  User,
  User,
  { rejectValue: { error: string } }
>("users/updateUser", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    await API.put(`/users/${id}`, payload);
    return { id, ...payload } as User;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: "Update failed" });
  }
});

export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: { error: string } }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/users/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { error: "Delete failed" });
  }
});

const initialState: UsersState = {
  pages: {},
  list: [],
  status: "idle",
  loading: false,
  total_pages: 1,
  total: 0,
  error: null,
  viewMode: "table",
  search: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setViewMode(state, action: PayloadAction<"table" | "card">) {
      state.viewMode = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersPage.fulfilled,
        (state, action: PayloadAction<UsersPageResponse>) => {
          state.loading = false;
          state.pages[action.payload.page] = action.payload;
          state.total_pages = action.payload.total_pages;
          state.total = action.payload.total;
          state.list = Object.values(state.pages).flatMap((p) => p.data || []);
        }
      )
      .addCase(fetchUsersPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to load users";
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0)
          state.list[idx] = { ...state.list[idx], ...action.payload };
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setViewMode, setSearch } = usersSlice.actions;
export default usersSlice.reducer;
