import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Attendance", path: "/dashboard/attendance" },
    { name: "Courses", path: "/dashboard/courses" },
    { name: "Teachers", path: "/dashboard/teachers" },
    { name: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">Student Dashboard</h2>
      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={isActive(item.path) ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </aside>
  );
}
