import { API } from "./api";

const getUserById = async (id) => {
    const res = await API.get(`/api/users/${id}`);
    return res.data;
};

const updateUser = async (id, userData) => {
    const res = await API.put(`/api/users/${id}`, userData);
    return res.data;
};

const userService = {
    getUserById,
    updateUser
};

export default userService;
