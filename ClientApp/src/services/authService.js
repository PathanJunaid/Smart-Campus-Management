import { API } from "./api";
import Cookies from "js-cookie";

const login = async (email, password) => {
    const response = await API.post("/api/users/auth/login", {
        email,
        password,
    });

    if (response.data.success && response.data.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, { expires: 7 });
    }

    return response.data;
};

const logout = async () => {
    Cookies.remove("accessToken");
    return { success: true };
};

const signupStep1 = async (email) => {
    const res = await API.post("/api/users/signup/step1", {
        email
    });
    return res.data;
};

const signupStep2 = async (email, password, otp) => {
    const res = await API.post("/api/users/signup/step2", {
        email,
        password,
        otp
    })

    return res.data;
}

const getCurrentUser = async () => {
    const res = await API.get("/api/users/me");
    return res.data;
};

const authService = {
    login,
    logout,
    signupStep1,
    signupStep2,
    getCurrentUser
};

export default authService;
