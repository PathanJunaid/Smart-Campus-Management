import { API } from "./api";

const deleteUser = async (id) => {
    const res = await API.delete(`/api/users/${id}`);
    return res.data;
}

const getUserById = async (id) => {
    const res = await API.get(`/api/users/${id}`);
    return res.data;
};

const addUser = async (userData) => {
    const res = await API.post('/api/users/AddUser', userData);
    return res.data;
};

const updateUser = async (id, userData) => {
    const res = await API.put(`/api/users/${id}`, userData);
    return res.data;
};

const updateEmail = async (userId, newEmail) => {
    const res = await API.put('/api/users/updateEmail', { userId, newEmail });
    return res.data;
};

const getUsers = async (params) => {
    const res = await API.get('/api/users', { params });
    return res.data;
};


const userService = {
    getUserById,
    updateUser,
    addUser,
    getUsers,
    deleteUser,
    updateEmail
};



export default userService;
