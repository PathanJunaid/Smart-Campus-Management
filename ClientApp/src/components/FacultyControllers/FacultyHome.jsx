import React from "react";

export default function FacultyHome() {
  return (
    <div className="cards">
      <div className="card">
        <h3>Classes Taken</h3>
        <p className="big-number">112</p>
        <p>This Semester</p>
      </div>

      <div className="card">
        <h3>Subjects Assigned</h3>
        <ul>
          <li>Data Structures</li>
          <li>Operating Systems</li>
        </ul>
      </div>

      <div className="card">
        <h3>Upcoming Class</h3>
        <p><b>DSA — 10:00 AM</b></p>
        <p>Lab 04</p>
      </div>
    </div>
  );
}
