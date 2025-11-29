// src/components/StudentControllers/Courses.jsx
import React from "react";

export default function Courses() {
  const courses = [
    { title: "Data Structures", code: "CSE301" },
    { title: "Operating Systems", code: "CSE302" },
    { title: "DBMS", code: "CSE303" },
    { title: "Computer Networks", code: "CSE304" },
  ];

  return (
    <div className="page-box">
      <h3 className="page-title">Your Courses</h3>
      <div className="course-grid">
        {courses.map((c) => (
          <div className="course-card" key={c.code}>
            <strong>{c.title}</strong>
            <div className="muted">{c.code}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
