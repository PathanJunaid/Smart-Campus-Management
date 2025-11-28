// src/components/StudentControllers/Sidebar.jsx
import React from "react";

export default function Sidebar({ activePage, setActivePage }) {
  const menus = ["Dashboard", "Attendance", "Courses", "Teachers", "Profile", "Logout"];
  return (
    <aside className="sidebar">
      <h2 className="logo">Student Dashboard</h2>
      <ul className="menu">
        {menus.map((item) => (
          <li
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
