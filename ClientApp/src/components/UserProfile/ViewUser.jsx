import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { toast } from "react-toastify";
import "./viewUser.css";

export default function ViewUser({ user: propUser, onClose }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(propUser || null);
    const [loading, setLoading] = useState(!propUser);

    useEffect(() => {
        if (propUser) {
            setUser(propUser);
            setLoading(false);
            return;
        }

        if (id) {
            const fetchUser = async () => {
                try {
                    const response = await userService.getUserById(id);
                    if (response.success) {
                        setUser(response.data);
                    } else {
                        toast.error("User not found");
                        navigate("/dashboard/users");
                    }
                } catch (error) {
                    toast.error("Error loading user");
                    navigate("/dashboard/users");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [id, propUser, navigate]);

    const handleClose = () => {
        if (onClose) onClose();
        else navigate("/dashboard/users");
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
    if (!user) return null;

    return (


        <div className="vu-overlay">
            <div className="vu-modal">

                {/* HEADER */}
                <div className="vu-header">
                    <h4 className="m-0">User Profile</h4>
                    <button className="vu-close-btn" onClick={handleClose}>✕</button>
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
                            className={`role-badge ${user.role === 0
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
