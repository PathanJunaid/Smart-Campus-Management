import axios from "axios";
import { API } from "./api";
// import { getToken } from "./authService";

const API_URL = "http://localhost:5036/api";
const api = axios.create({
    baseURL: API_URL,
});

// api.interceptors.request.use(
//     (config) => {
//         const token = getToken();
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

const enrollmentService = {
    getEnrollments: async (params) => {
        try {
            const response = await API.get("/api/enrollment", { params });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to fetch enrollments");
            }
            throw new Error("Network error");
        }
    },

    getUnenrolledStudents: async () => {
        try {
            const response = await API.get("/api/enrollment/unenrolled-students");
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to fetch students");
            }
            throw new Error("Network error");
        }
    },

    addEnrollment: async (data) => {
        try {
            const response = await API.post("/api/enrollment/add", data);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to add enrollment");
            }
            throw new Error("Network error");
        }
    },

    updateEnrollment: async (data) => {
        try {
            const response = await API.put("/api/enrollment", data);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to update enrollment");
            }
            throw new Error("Network error");
        }
    },

    deleteEnrollment: async (id) => {
        try {
            const response = await API.delete(`/api/enrollment/${id}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to delete enrollment");
            }
            throw new Error("Network error");
        }
    },

    bulkEnroll: async (formData) => {
        try {
            const response = await API.post("/api/users/user/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || "Failed to upload file");
            }
            throw new Error("Network error");
        }
    }
};

export default enrollmentService;
