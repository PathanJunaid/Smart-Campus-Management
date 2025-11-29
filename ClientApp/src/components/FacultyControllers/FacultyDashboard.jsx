import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FacultySidebar from "./FacultySidebar";
import FacultyTopbar from "./FacultyTopbar";
import FacultyHome from "./FacultyHome";
import FacultyAttendance from "./FacultyAttendance";
import FacultyCourses from "./FacultyCourses";
import FacultyStudents from "./FacultyStudents";
import FacultyProfile from "./FacultyProfile";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../../store/authSlice";
import "./FacultyDashboard.css";

export default function FacultyDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="faculty-dashboard">
      <FacultySidebar />
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
