import React from "react";

export default function FacultyCourses() {
  return (
    <div className="page-box">
      <h3 className="page-title">Courses Assigned</h3>

      <div className="course-grid">
        <div className="course-card">
          <strong>Data Structures</strong>
          <p>Course Code: CSE301</p>
        </div>

        <div className="course-card">
          <strong>Operating Systems</strong>
          <p>Course Code: CSE304</p>
        </div>
      </div>
    </div>
  );
}
