import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import FacultyTopbar from "../FacultyControllers/FacultyTopbar"; // Reusing Topbar as requested
import AdminUsers from "./AdminUsers";
import { useSelector } from 'react-redux';

import AdminProfile from "./AdminProfile";

// Placeholder components for other routes
const AdminHome = () => <div className="page-box"><div className="card-container"><h2 className="card-title">Admin Dashboard</h2><p>Welcome to the Admin Panel.</p></div></div>;
const AdminFaculty = () => <div className="page-box"><div className="card-container"><h2 className="card-title">Faculty Management</h2><p>Faculty management content goes here.</p></div></div>;
const AdminDepartment = () => <div className="page-box"><div className="card-container"><h2 className="card-title">Department Management</h2><p>Department management content goes here.</p></div></div>;

export default function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "Dashboard" },
        { name: "Faculty", path: "/dashboard/faculty", icon: "Teachers" }, // Reusing Teachers icon
        { name: "Department", path: "/dashboard/department", icon: "Courses" }, // Reusing Courses icon as placeholder
        { name: "Users", path: "/dashboard/users", icon: "Students" }, // Reusing Students icon
        { name: "Profile", path: "/dashboard/profile", icon: "Profile" },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar title="Admin Panel" menuItems={menuItems} />
            <main className="main-content">
                <FacultyTopbar title="Dashboard" user={user} />
                <Routes>
                    <Route path="/" element={<AdminHome />} />
                    <Route path="faculty" element={<AdminFaculty />} />
                    <Route path="department" element={<AdminDepartment />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="profile/edit" element={<AdminProfile editMode={true} />} />
                    <Route path="*" element={<Navigate to="" replace />} />
                </Routes>
            </main>
        </div>
    );
}
