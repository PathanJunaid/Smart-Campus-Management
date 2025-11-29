import React from "react";

export default function FacultyAttendance() {
  return (
    <div className="page-box">
      <h3 className="page-title">Take Attendance</h3>

      <select className="input">
        <option>Select Subject</option>
        <option>Data Structures</option>
        <option>Operating Systems</option>
      </select>

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No</th>
            <th>Present</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Mohammad Kamran</td>
            <td>2110013135053</td>
            
            <td><input type="checkbox" /></td>
          </tr>

          <tr>
            <td>Junaid Khan</td>
            <td>2110013135054</td>
            <td><input type="checkbox" /></td>
          </tr>


          <tr>
            <td>Amit Kumar</td>
            <td>2110013131314</td>
            <td><input type="checkbox" /></td>
          </tr>
        </tbody>
      </table>

      <button className="save-btn">Submit Attendance</button>
    </div>
  );
}
