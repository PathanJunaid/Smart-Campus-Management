import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const data = await authService.login(email, password);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            return await authService.logout();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk to check auth status
export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, thunkAPI) => {
        try {
            const token = Cookies.get("accessToken");
            if (!token) {
                return thunkAPI.rejectWithValue("No token found");
            }

            // Decode and verify expiration
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                Cookies.remove("accessToken");
                return thunkAPI.rejectWithValue("Session expired");
            }

            const userData = await authService.getCurrentUser();
            return userData;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    needsRegistration: false,
    message: "",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.needsRegistration = false;
            state.message = "";
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.isSuccess = true;
                    state.user = action.payload.data;
                } else if (action.payload.needsRegistration) {
                    state.needsRegistration = true;
                    state.message = "Please change your password.";
                } else {
                    state.isError = true;
                    state.message = action.payload.message || "Login failed";
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data || action.payload;
                if (action.payload.forcePasswordChange) {
                    state.needsRegistration = true;
                    state.message = "Please change your password.";
                }
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
            });
    },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;
