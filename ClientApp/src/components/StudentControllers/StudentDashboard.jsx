// src/components/StudentControllers/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardHome from "./DashboardHome";
import Attendance from "./Attendance";
import Courses from "./Courses";
import Teachers from "./Teachers";
import Profile from "./Profile";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="student-dashboard">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Dashboard" />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="courses" element={<Courses />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<Profile editMode={true} />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
