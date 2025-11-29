// src/components/StudentControllers/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  const [activePage, setActivePage] = useState("Dashboard");
  const dispatch = useDispatch();

  useEffect(() => {
    if (activePage === "Logout") {
      dispatch(logoutUser());
    }
  }, [activePage, dispatch]);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardHome />;
      case "Attendance":
        return <Attendance />;
      case "Courses":
        return <Courses />;
      case "Teachers":
        return <Teachers />;
      case "Profile":
        return <Profile />;
      case "Logout":
        return <div style={{ padding: 20 }}>Logging out...</div>;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="student-dashboard">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <Topbar title={activePage} />
        <div className="page-container">{renderPage()}</div>
      </main>
    </div>
  );
}
