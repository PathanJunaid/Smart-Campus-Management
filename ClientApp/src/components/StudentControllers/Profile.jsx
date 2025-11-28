import React, { useState } from "react";
import "./StudentDashboard.css";

export default function Profile() {
  // Initial profile data (later connect to backend)
  const [profile, setProfile] = useState({
    name: "Mohammad Kamran",
    roll: "2110013135053",
    program: "B.Tech CSE",
    year: "4th Year",
    contact: "9580055187",
    photo:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // default avatar
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(profile); // used while editing

  // Handle profile picture upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setTempData({ ...tempData, photo: imgURL });
  };

  // Handle text change
  const handleChange = (e) => {
    setTempData({ ...tempData, [e.target.name]: e.target.value });
  };

  // Save profile
  const handleSave = () => {
    setProfile(tempData);
    setEditMode(false);
  };

  // Cancel edit
  const handleCancel = () => {
    setTempData(profile);
    setEditMode(false);
  };

  return (
    <div className="page-box profile-page">
      {/* <h3 className="page-title">Your Profile</h3> */}

      <div className="profile-box">
        {/* Profile Photo + Upload */}
        <div className="profile-photo-section">
          <img src={editMode ? tempData.photo : profile.photo} alt="Profile" />

          {editMode && (
            <label className="upload-btn">
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>

        {/* Profile Info Form */}
        <div className="profile-info">

          {editMode ? (
            <>
              <p>
                <b>Name:</b>{" "}
                <input
                  type="text"
                  name="name"
                  value={tempData.name}
                  onChange={handleChange}
                />
              </p>

              <p>
                <b>Roll No:</b>{" "}
                <input
                  type="text"
                  name="roll"
                  value={tempData.roll}
                  onChange={handleChange}
                />
              </p>

              <p>
                <b>Program:</b>{" "}
                <input
                  type="text"
                  name="program"
                  value={tempData.program}
                  onChange={handleChange}
                />
              </p>

              <p>
                <b>Year:</b>{" "}
                <input
                  type="text"
                  name="year"
                  value={tempData.year}
                  onChange={handleChange}
                />
              </p>

              <p>
                <b>Contact:</b>{" "}
                <input
                  type="text"
                  name="contact"
                  value={tempData.contact}
                  onChange={handleChange}
                />
              </p>

              <div className="edit-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p><b>Name:</b> {profile.name}</p>
              <p><b>Roll No:</b> {profile.roll}</p>
              <p><b>Program:</b> {profile.program}</p>
              <p><b>Year:</b> {profile.year}</p>
              <p><b>Contact:</b> {profile.contact}</p>

              <button
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
