import { API } from "./api";

const getAllFaculties = async (params) => {
    const res = await API.get('/api/faculty', { params });
    return res.data;
};

const addFaculty = async (facultyData) => {
    const res = await API.post('/api/faculty', facultyData);
    return res.data;
};

const updateFaculty = async (id, facultyData) => {
    const res = await API.put(`/api/faculty/${id}`, facultyData);
    return res.data;
};

const deleteFaculty = async (id) => {
    const res = await API.delete(`/api/faculty/${id}`);
    return res.data;
};

const facultyService = {
    getAllFaculties,
    addFaculty,
    updateFaculty,
    deleteFaculty
};

export default facultyService;
