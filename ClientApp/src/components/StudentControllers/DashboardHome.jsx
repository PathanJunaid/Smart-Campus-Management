// src/components/StudentControllers/DashboardHome.jsx
import React from "react";

export default function DashboardHome() {
  return (
    <div className="dashboard-home">
      <div className="cards">
        <div className="card attendance-card">
          <h3>Attendance</h3>
          <p className="big-number">87%</p>
          <p>This Semester</p>
        </div>

        <div className="card">
          <h3>Courses Enrolled</h3>
          <ul>
            <li>Data Structures</li>
            <li>Operating Systems</li>
            <li>Database Management</li>
          </ul>
        </div>

        <div className="card">
          <h3>Assigned Teachers</h3>
          <ul>
            <li>DSA — Prof. Sharma</li>
            <li>OS — Ms. Neha</li>
            <li>CN — Mr. Amit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
