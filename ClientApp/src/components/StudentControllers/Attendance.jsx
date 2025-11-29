// src/components/StudentControllers/Attendance.jsx
import React from "react";

export default function Attendance() {
  // static sample data; replace when connecting API
  const rows = [
    { sub: "DSA", held: 40, attended: 35 },
    { sub: "OS", held: 42, attended: 36 },
    { sub: "DBMS", held: 38, attended: 34 },
  ];

  return (
    <div className="page-box">
      <h3 className="page-title">Attendance Records</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Classes Held</th>
            <th>Attended</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const pct = Math.round((r.attended / r.held) * 100);
            return (
              <tr key={r.sub}>
                <td>{r.sub}</td>
                <td>{r.held}</td>
                <td>{r.attended}</td>
                <td>{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
