import React, { useState } from "react";

export default function FacultyProfile() {
  const [data, setData] = useState({
    name: "Prof. Shaheen Ali",
    facultyId: "F1023",
    department: "Computer Science",
    contact: "9876543210",
    photo: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
  });

  const [edit, setEdit] = useState(false);
  const [temp, setTemp] = useState(data);

  const handleChange = (e) =>
    setTemp({ ...temp, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTemp({ ...temp, photo: URL.createObjectURL(file) });
  };

  const save = () => {
    setData(temp);
    setEdit(false);
  };

  const cancel = () => {
    setTemp(data);
    setEdit(false);
  };

  return (
    <div className="page-box profile-page">
      <h3 className="page-title">Faculty Profile</h3>

      <div className="profile-box">
        <div className="profile-photo-section">
          <img src={edit ? temp.photo : data.photo} alt="" />
          {edit && (
            <label className="upload-btn">
              Upload Photo
              <input type="file" onChange={handlePhoto} accept="image/*" />
            </label>
          )}
        </div>

        <div className="profile-info">

          {edit ? (
            <>
              <p><b>Name:</b> <input name="name" value={temp.name} onChange={handleChange} /></p>
              <p><b>Faculty ID:</b> <input name="facultyId" value={temp.facultyId} onChange={handleChange} /></p>
              <p><b>Department:</b> <input name="department" value={temp.department} onChange={handleChange} /></p>
              <p><b>Contact:</b> <input name="contact" value={temp.contact} onChange={handleChange} /></p>

              <div className="edit-buttons">
                <button className="save-btn" onClick={save}>Save</button>
                <button className="cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><b>Name:</b> {data.name}</p>
              <p><b>Faculty ID:</b> {data.facultyId}</p>
              <p><b>Department:</b> {data.department}</p>
              <p><b>Contact:</b> {data.contact}</p>

              <button className="edit-btn" onClick={() => setEdit(true)}>
                Edit Profile
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
