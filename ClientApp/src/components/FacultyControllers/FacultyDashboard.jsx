import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Common/Sidebar";
import FacultyTopbar from "./FacultyTopbar";
import FacultyHome from "./FacultyHome";
import FacultyAttendance from "./FacultyAttendance";
import FacultyCourses from "./FacultyCourses";
import FacultyStudents from "./FacultyStudents";
import FacultyProfile from "./FacultyProfile";
import { useSelector } from 'react-redux';

export default function FacultyDashboard() {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "Dashboard" },
    { name: "Attendance", path: "/dashboard/attendance", icon: "Attendance" },
    { name: "Courses", path: "/dashboard/courses", icon: "Courses" },
    { name: "Students", path: "/dashboard/students", icon: "Students" },
    { name: "Profile", path: "/dashboard/profile", icon: "Profile" },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar title="Professor Panel" menuItems={menuItems} />
      <main className="main-content">
        <FacultyTopbar title="Dashboard" user={user} />
        <Routes>
          <Route path="/" element={<FacultyHome />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="students" element={<FacultyStudents />} />
          <Route path="profile" element={<FacultyProfile />} />
          <Route path="profile/edit" element={<FacultyProfile editMode={true} />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </main>
    </div>
  );
}
