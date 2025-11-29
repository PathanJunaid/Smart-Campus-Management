import React, { useState } from "react";
import FacultySidebar from "./FacultySidebar";
import FacultyTopbar from "./FacultyTopbar";
import FacultyHome from "./FacultyHome";
import FacultyAttendance from "./FacultyAttendance";
import FacultyCourses from "./FacultyCourses";
import FacultyStudents from "./FacultyStudents";
import FacultyProfile from "./FacultyProfile";
import { useSelector } from 'react-redux';
import "./FacultyDashboard.css";

export default function FacultyDashboard() {
  const [page, setPage] = useState("Dashboard");
  const { user } = useSelector((state) => state.auth);

  const renderPage = () => {
    switch (page) {
      case "Dashboard": return <FacultyHome />;
      case "Attendance": return <FacultyAttendance />;
      case "Courses": return <FacultyCourses />;
      case "Students": return <FacultyStudents />;
      case "Profile": return <FacultyProfile />;
      case "Logout": return <div style={{ padding: 20 }}>Logging out...</div>;
      default: return <FacultyHome />;
    }
  };

  return (
    <div className="faculty-dashboard">
      <FacultySidebar page={page} setPage={setPage} />
      <main className="main-content">
        <FacultyTopbar title={page} user={user}/>
        {renderPage()}
      </main>
    </div>
  );
}
