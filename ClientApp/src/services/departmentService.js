import { API } from "./api";
const deleteDepartment = async (id)=> {
    const res = await API.delete(`/api/department/${id}`);
    return res.data;
}


const departmentService = {
    deleteDepartment,

};

export default departmentService;