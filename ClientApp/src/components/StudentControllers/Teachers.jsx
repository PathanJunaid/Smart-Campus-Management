// src/components/StudentControllers/Teachers.jsx
import React from "react";

export default function Teachers() {
  const teachers = [
    { name: "Prof. Sharma", subject: "Data Structures" },
    { name: "Ms. Neha", subject: "Operating Systems" },
    { name: "Mr. Amit", subject: "Computer Networks" },
    {name:"Junaid Khan", subject: "Zoology"}
  ];

  return (
    <div className="page-box">
      <h3 className="page-title">Assigned Teachers</h3>
      <div className="teacher-list">
        {teachers.map((t) => (
          <div className="teacher-card" key={t.name}>
            <strong>{t.name}</strong>
            <p>{t.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
