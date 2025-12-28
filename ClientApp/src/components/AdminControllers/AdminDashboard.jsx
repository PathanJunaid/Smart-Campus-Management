import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import FacultyTopbar from "../Common/Header"; // Reusing Topbar as requested
import AdminUsers from "./AdminUsers";
import AdminFaculty from "./AdminFaculty";
import AdminEnrollment from "./AdminEnrollment";
import { useSelector } from 'react-redux';

import AdminProfile from "./AdminProfile";
import UserProfile from "../UserProfile/UserProfile";
import Footer from "../Common/Footer";

// Placeholder components for other routes
const AdminHome = () => <div className="page-box"><div className="card-container"><p>Welcome to the Admin Panel.</p></div></div>;

const AdminDepartment = () => <div className="page-box"><div className="card-container"><p>Department management content goes here.</p></div></div>;

export default function AdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const getPageTitle = (pathname) => {
        if (pathname.includes("/dashboard/faculty")) return "Faculty";
        if (pathname.includes("/dashboard/department")) return "Department";
        if (pathname.includes("/dashboard/users")) return "Users";
        if (pathname.includes("/dashboard/enrollment")) return "Student Enrollment";
        if (pathname.includes("/dashboard/profile")) return "Profile";
        return "Dashboard";
    };

    const pageTitle = getPageTitle(location.pathname);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "Dashboard" },
        { name: "Faculty", path: "/dashboard/faculty", icon: "Teachers" }, // Reusing Teachers icon
        { name: "Department", path: "/dashboard/department", icon: "Courses" }, // Reusing Courses icon as placeholder
        { name: "Users", path: "/dashboard/users", icon: "Students" }, // Reusing Students icon
        { name: "Student Enrollment", path: "/dashboard/enrollment", icon: "Attendance" },
        { name: "Profile", path: "/dashboard/profile", icon: "Profile" },
    ];

    return (
        <div className="dashboard-container">
            <Sidebar title="Admin Panel" menuItems={menuItems} />
            <main className="main-content">
                <FacultyTopbar title={pageTitle} user={user} />
                <Routes>
                    <Route path="/" element={<AdminHome />} />
                    <Route path="faculty" element={<AdminFaculty />} />
                    <Route path="department" element={<AdminDepartment />} />

                    {/* Users Routes */}
                    <Route path="users/*" element={<AdminUsers />} />

                    {/* Enrollment Routes */}
                    <Route path="enrollment/*" element={<AdminEnrollment />} />

                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="profile/edit" element={<AdminProfile editMode={true} />} />
                    <Route path="*" element={<Navigate to="" replace />} />
                </Routes>
                <Footer />
            </main>
        </div>
    );
}
