import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../../services/userService';
import { setUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const UserProfile = ({ userId, initialData, onCancel, isFromAdminUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // When admin edits another user  
    const currentUserId = userId || id;

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        dob: '',
        role: 0,
        userId: ''
    });

    const [isLoading, setIsLoading] = useState(!initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
       
        if (initialData) {
            const formattedDob = initialData.dob
                ? new Date(initialData.dob).toISOString().split('T')[0]
                : '';

            setFormData({
                firstName: initialData.firstName || '',
                middleName: initialData.middleName || '',
                lastName: initialData.lastName || '',
                mobileNumber: initialData.mobileNumber || '',
                dob: formattedDob,
                role: Number(initialData.role),
                userId: initialData.id
            });

            setIsLoading(false);
            return;
        }

        
        const fetchUser = async () => {
            try {
                const response = await userService.getUserById(currentUserId);
                if (response.success) {
                    const data = response.data;

                    const formattedDob = data.dob
                        ? new Date(data.dob).toISOString().split('T')[0]
                        : '';

                    setFormData({
                        firstName: data.firstName || '',
                        middleName: data.middleName || '',
                        lastName: data.lastName || '',
                        mobileNumber: data.mobileNumber || '',
                        dob: formattedDob,
                        role: Number(data.role),
                        userId: data.id
                    });
                } else {
                    toast.error(response.message || "Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Error fetching user details");
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUserId && !initialData) {
            fetchUser();
        }
    }, [currentUserId, initialData]);

    const validateField = (name, value) => {
        let error = "";

        if (name === "firstName" && !value) error = "First Name is required";
        if (name === "lastName" && !value) error = "Last Name is required";

        if (name === "mobileNumber") {
            if (!value) error = "Mobile Number is required";
            else if (!/^\d{10}$/.test(value)) error = "Must be 10 digits";
        }

        if (name === "dob" && !value) error = "Date of Birth is required";

        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === "role" ? Number(value) : value
        }));

        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const firstNameError = validateField("firstName", formData.firstName);
        const lastNameError = validateField("lastName", formData.lastName);
        const mobileError = validateField("mobileNumber", formData.mobileNumber);
        const dobError = validateField("dob", formData.dob);

        if (firstNameError || lastNameError || mobileError || dobError) return;

        setIsSaving(true);

        try {
            const response = await userService.updateUser(currentUserId, formData);

            if (response.success) {
                toast.success("Profile updated successfully");

                if (isFromAdminUser) {
                    navigate("/dashboard/users");
                } else {
                    dispatch(setUser(response.data)); // update redux
                }

                if (onCancel) onCancel();
            } else {
                toast.error(response.message || "Update failed");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="page-box">
            <div className="card-container">
                <div className="card-header">
                    <h3 className="card-title">Edit Profile</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">

                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <div className="text-danger small">{errors.firstName}</div>}
                        </div>

                      
                        <div className="form-group">
                            <label className="form-label">Middle Name</label>
                            <input
                                type="text"
                                name="middleName"
                                className="form-control"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>

                      
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <div className="text-danger small">{errors.lastName}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="number"
                                name="mobileNumber"
                                className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />
                            {errors.mobileNumber && <div className="text-danger small">{errors.mobileNumber}</div>}
                        </div>

                        {/* ===== DOB ===== */}
                        <div className="form-group">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                value={formData.dob}
                                onChange={handleChange}
                            />
                            {errors.dob && <div className="text-danger small">{errors.dob}</div>}
                        </div>

                        {/* ===== Role ===== */}
                        <div className="form-group">
                            <label className="form-label">Role</label>

                            {isFromAdminUser ? (
                                <select
                                    name="role"
                                    className="form-control"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value={0}>Admin</option>
                                    <option value={1}>Faculty</option>
                                    <option value={2}>Student</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        formData.role === 0
                                            ? "Admin"
                                            : formData.role === 1
                                                ? "Faculty"
                                                : "Student"
                                    }
                                    disabled
                                />
                            )}

                        </div>
                    </div>

                    {/* ===== Buttons ===== */}
                    <div className="form-actions">
                        {onCancel && (
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                Cancel
                            </button>
                        )}

                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Update Profile"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default UserProfile;
