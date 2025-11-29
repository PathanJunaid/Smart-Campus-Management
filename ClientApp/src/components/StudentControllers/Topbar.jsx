// src/components/StudentControllers/Topbar.jsx
import React from "react";

export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <h2>{title}</h2>
      <div className="student-info">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="student"
        />
        <div className="student-meta">
          <div className="name">Mohammad Kamran</div>
          <div className="small">Roll: 2110013135053</div>
        </div>
      </div>
    </div>
  );
}
