import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../store/authSlice";
import UserProfile from "../UserProfile/UserProfile";

export default function AdminProfile({ editMode = false }) {
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
        <div className="page-box">
            <div className="card-container">


                <div className="profile-grid">
                    {/* Left Column: Avatar & Status */}
                    <div className="profile-sidebar">
                        <img
                            src={user.photo || "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"}
                            alt="Profile"
                            className="profile-avatar"
                        />
                        <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
                        <div className="profile-role">Administrator</div>
                        <div className={`status-badge ${user.active ? 'status-active' : 'status-inactive'}`}>
                            {user.active ? 'Active Account' : 'Inactive'}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="profile-content">
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Email Address</span>
                                <span className="detail-value">{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Mobile Number</span>
                                <span className="detail-value">{user.mobileNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date of Birth</span>
                                <span className="detail-value">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Role</span>
                                <span className="detail-value">Admin</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="btn btn-primary" onClick={() => navigate("edit")}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
