import React from "react";

export default function FacultySidebar({ page, setPage }) {
  const menus = ["Dashboard", "Attendance", "Courses", "Students", "Profile", "Logout"];

  return (
    <aside className="sidebar">
      <h2 className="logo">Faculty Panel</h2>

      <ul className="menu">
        {menus.map((item) => (
          <li
            key={item}
            className={page === item ? "active" : ""}
            onClick={() => setPage(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
