import { API } from "./api";

const deleteUser = async (id) => {
    const res = await API.delete(`/api/users/${id}`);
    return res.data;
}

const getUserById = async (id) => {
    const res = await API.get(`/api/users/${id}`);
    return res.data;
};

const updateUser = async (id, userData) => {
    const res = await API.put(`/api/users/${id}`, userData);
    return res.data;
};

const getUsers = async (params) => {
    const res = await API.get('/api/users', { params });
    return res.data;
};


const userService = {
    getUserById,
    updateUser,
    getUsers,
    deleteUser
};



export default userService;
