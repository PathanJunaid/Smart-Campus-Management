import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../store/authSlice";
import UserProfile from "../UserProfile/UserProfile";
import "./StudentDashboard.css";

export default function Profile({ editMode = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(checkAuth());
    }
  }, [user, dispatch]);

  if (editMode) {
    return <UserProfile userId={user?.id} initialData={user} onCancel={() => navigate("../profile")} />;
  }

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="page-box profile-page">
      {/* <h3 className="page-title">Your Profile</h3> */}

      <div className="profile-box">
        {/* Profile Photo + Upload */}
        <div className="profile-photo-section">
          <img
            src={user.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="Profile"
          />
        </div>

        {/* Profile Info Form */}
        <div className="profile-info">
          <>
            <p><b>Name:</b> {user.firstName} {user.lastName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Contact:</b> {user.mobileNumber}</p>
            <p><b>Date of Birth:</b> {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
            {/* Add other fields if available in user object */}
            {user.rollNo && <p><b>Roll No:</b> {user.rollNo}</p>}
            {user.program && <p><b>Program:</b> {user.program}</p>}

            <button
              className="edit-btn"
              onClick={() => navigate("edit")}
            >
              Edit Profile
            </button>
          </>
        </div>
      </div>
    </div>
  );
}
