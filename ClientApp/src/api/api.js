import axios from "axios";

export const API = axios.create({
  baseURL: "http://smartcampusbackend-env.eba-mcny2pk2.ap-south-1.elasticbeanstalk.com",
});

// Automatically attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
