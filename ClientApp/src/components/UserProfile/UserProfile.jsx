import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import userService from '../../services/userService';
import { setUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const UserProfile = ({ userId, initialData, onCancel, isFromAdminUser, isViewMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Use prop userId if available, otherwise fallback to params id
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
            const formattedDob = initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '';
            setFormData({
                firstName: initialData.firstName || '',
                middleName: initialData.middleName || '',
                lastName: initialData.lastName || '',
                mobileNumber: initialData.mobileNumber || '',
                dob: formattedDob,
                role: initialData.role,
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
                    // Format DOB to YYYY-MM-DD for input type="date"
                    const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : '';

                    setFormData({
                        firstName: data.firstName || '',
                        middleName: data.middleName || '',
                        lastName: data.lastName || '',
                        mobileNumber: data.mobileNumber || '',
                        dob: formattedDob,
                        role: data.role,
                        userId: data.id
                    });
                } else {
                    toast.error(response.message || "Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("An error occurred while fetching user details");
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
            else if (!/^\d{10}$/.test(value)) error = "Mobile Number must be 10 digits";
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

        // Run full validation
        const firstNameError = validateField("firstName", formData.firstName);
        const lastNameError = validateField("lastName", formData.lastName);
        const mobileError = validateField("mobileNumber", formData.mobileNumber);
        const dobError = validateField("dob", formData.dob);

        console.log(formData);

        if (firstNameError || lastNameError || mobileError || dobError) {
            return;
        }

        setIsSaving(true);
        try {
            const response = await userService.updateUser(currentUserId, formData);
            if (response.success) {
                toast.success(response.message || "Profile updated successfully");
                // Update Redux state with the new user data

                if (isFromAdminUser) {

                    navigate("/dashboard/users");

                } else {
                    dispatch(setUser(response.data));

                }

                if (onCancel) {
                    onCancel(); // Switch back to view mode
                }
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            const message = error.response?.data?.message || error.message || "An error occurred while updating profile";
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-box">
            <div className="card-container">
                <div className="card-header">
                    <h3 className="card-title">Update Profile</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Name Section */}
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                disabled={isViewMode}
                            />
                            {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="middleName" className="form-label">Middle Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="middleName"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder="Enter middle name"
                                disabled={isViewMode}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                disabled={isViewMode}
                            />
                            {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                        </div>

                        {/* Contact Section */}
                        <div className="form-group">
                            <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                            <input
                                type="number"
                                className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Enter mobile number"
                                disabled={isViewMode}
                            />
                            {errors.mobileNumber && <div className="text-danger small mt-1">{errors.mobileNumber}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                id="dob"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                disabled={isViewMode}
                            />
                            {errors.dob && <div className="text-danger small mt-1">{errors.dob}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="role" className="form-label">Role</label>

                            {isFromAdminUser && !isViewMode ? (
                                // ⭐ Admin can edit role
                                <select
                                    className="form-control"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}

                                >
                                    <option value={0}>Admin</option>
                                    <option value={1}>Faculty</option>
                                    <option value={2}>Student</option>
                                </select>
                            ) : (
                                // ⭐ Normal user sees role only (readonly)
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    name="role"

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


                        {/* Actions */}
                    </div>
                    <div className="form-actions">
                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                        )}
                        {!isViewMode && (
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Update Profile"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
