import React from "react";

export default function FacultyTopbar({ title }) {
  return (
    <div className="topbar">
      <h2>{title}</h2>

      <div className="fac-info">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="faculty"
        />
        <div>
          <div className="name">Prof. Shaheen Ali</div>
          <div className="small">Faculty ID: F1023</div>
        </div>
      </div>
    </div>
  );
}
