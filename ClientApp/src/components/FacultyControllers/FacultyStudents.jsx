import React from "react";

export default function FacultyStudents() {
  return (
    <div className="page-box">
      <h3 className="page-title">Students List</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Mohammad Kamran</td>
            <td>2110013135053</td>
            <td>9580055187</td>
          </tr>

          <tr>
            <td>Junaid Khan</td>
            <td>2110013135054</td>
            <td>9876543210</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
