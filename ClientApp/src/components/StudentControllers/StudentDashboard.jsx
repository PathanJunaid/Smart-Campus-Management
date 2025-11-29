import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import { useSelector } from 'react-redux';

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "Dashboard" },
    { name: "Attendance", path: "/dashboard/attendance", icon: "Attendance" },
    { name: "Courses", path: "/dashboard/courses", icon: "Courses" },
    { name: "Teachers", path: "/dashboard/teachers", icon: "Teachers" },
    { name: "Profile", path: "/dashboard/profile", icon: "Profile" },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar title="Student Panel" menuItems={menuItems} />
      <main className="main-content">
        <div className="topbar">
          <h2>Dashboard</h2>
          <div className="user-menu">
            <span className="name">{user?.firstName} {user?.lastName}</span>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="teachers" element={<StudentTeachers />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="profile/edit" element={<StudentProfile editMode={true} />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}
