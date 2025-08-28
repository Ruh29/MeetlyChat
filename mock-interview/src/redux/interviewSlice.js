import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// ✅ Create Interview (Admin only)
export const createInterview = createAsyncThunk(
  "interviews/create",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/interviews/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error creating interview");
    }
  }
);

// ✅ Fetch All Interviews
export const fetchInterviews = createAsyncThunk(
  "interviews/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/interviews");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching interviews");
    }
  }
);

const interviewSlice = createSlice({
  name: "interviews",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Create Interview
      .addCase(createInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch Interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default interviewSlice.reducer;
