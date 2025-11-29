import axios from "axios";

export const API = axios.create({
  baseURL: "http://smartcampusbackend-env.eba-mcny2pk2.ap-south-1.elasticbeanstalk.com",
  withCredentials: true,
});

import Cookies from "js-cookie";

API.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("accessToken");
    }
    return Promise.reject(error);
  }
);
