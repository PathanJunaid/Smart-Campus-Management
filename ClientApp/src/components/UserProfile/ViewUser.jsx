import React from "react";
import "./ViewUser.css"; // <-- IMPORTANT (your separate CSS)

export default function ViewUser({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="vu-overlay">
            <div className="vu-modal">

                {/* HEADER */}
                <div className="vu-header">
                    <h4 class="m-0">User Profile</h4>
                    <button className="vu-close-btn" onClick={onClose}>✕</button>
                </div>

                {/* BODY */}
                <div className="vu-body">
                    <div className="vu-left">
                        <img
                            src={
                                user.photo ||
                                "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
                            }
                            alt="avatar"
                            className="vu-avatar"
                        />

                        <h5 className="vu-name">
                            {user.firstName} {user.lastName}
                        </h5>

                        <span
                            className={`role-badge ${
                                user.role === 0
                                    ? "role-0"
                                    : user.role === 1
                                    ? "role-1"
                                    : "role-2"
                            }`}
                        >
                            {user.role === 0
                                ? "Admin"
                                : user.role === 1
                                ? "Faculty"
                                : "Student"}
                        </span>
                    </div>

                    <div className="vu-right">
                        <InfoRow label="First Name" value={user.firstName} />
                        <InfoRow label="Middle Name" value={user.middleName || "-"} />
                        <InfoRow label="Last Name" value={user.lastName} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Mobile Number" value={user.mobileNumber} />
                        <InfoRow
                            label="Date of Birth"
                            value={user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
                        />
                    </div>
                </div>

                
            </div>
        </div>
    );
}

const InfoRow = ({ label, value }) => (
    <div className="vu-row">
        <span className="vu-label">{label} :</span>
        <span className="vu-value"> {value}</span>
    </div>
);
