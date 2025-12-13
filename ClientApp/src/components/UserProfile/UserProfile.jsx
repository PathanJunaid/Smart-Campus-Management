import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import userService from '../../services/userService';
import { setUser } from '../../store/authSlice';
import { toast } from 'react-toastify';

const UserProfile = ({ userId, initialData, onCancel, isFromAdminUser, mode = 'edit' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);

    // ID to use if editing (passed prop OR url param)
    const targetUserId = userId || id; // Renamed to avoid confusion with currentUser

    const canChangeEmail = currentUser?.role === 0 && isFromAdminUser && mode === 'edit';

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '', // Used for Add Mode
        mobileNumber: '',
        dob: '',
        role: 0,
        userId: ''
    });

    // -- Email Logic State --
    const [originalEmail, setOriginalEmail] = useState('');
    const [editableEmail, setEditableEmail] = useState(''); // Separate state for edit mode
    const [isEmailEditing, setIsEmailEditing] = useState(false);

    const [isLoading, setIsLoading] = useState(mode === 'edit' && !initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // -- Navigation Helper --
    const goBack = () => {
        if (onCancel) onCancel();
        else navigate("/dashboard/users");
    };

    useEffect(() => {
        if (mode === 'add') {
            setIsLoading(false);
            return;
        }

        if (initialData) {
            loadData(initialData);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await userService.getUserById(targetUserId);
                if (response.success) {
                    loadData(response.data);
                } else {
                    toast.error(response.message || "Failed to fetch user details");
                    goBack();
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast.error("Error fetching user details");
                goBack();
            } finally {
                setIsLoading(false);
            }
        };

        if (targetUserId) {
            fetchUser();
        }
    }, [targetUserId, initialData, mode]);

    const loadData = (data) => {
        const loadedEmail = data.email || '';
        setFormData({
            firstName: data.firstName || '',
            middleName: data.middleName || '',
            lastName: data.lastName || '',
            email: loadedEmail, // Keep in main state for consistency or fallback
            mobileNumber: data.mobileNumber || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            role: Number(data.role),
            userId: data.id
        });
        setOriginalEmail(loadedEmail);
        setEditableEmail(loadedEmail); // Initialize editable email
        setIsEmailEditing(false);
    };

    // -- Strict Validation --
    const validateField = (name, value) => {
        let error = "";

        if (name === "firstName") {
            if (!value) error = "First Name is required";
            else if (value.length > 20) error = "Max 20 characters allowed";
            else if (!/^[a-zA-Z\s]*$/.test(value)) error = "Only alphabets allowed";
        }
        if (name === "lastName") {
            if (!value) error = "Last Name is required";
            else if (value.length > 20) error = "Max 20 characters allowed";
            else if (!/^[a-zA-Z\s]*$/.test(value)) error = "Only alphabets allowed";
        }
        if (name === "middleName") {
            if (value && value.length > 20) error = "Max 20 characters allowed";
            else if (value && !/^[a-zA-Z\s]*$/.test(value)) error = "Only alphabets allowed";
        }
        if (name === "email") {
            if (!value) error = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
        }
        if (name === "mobileNumber") {
            if (!value) error = "Mobile Number is required";
            else if (!/^\d{10}$/.test(value)) error = "Must be exactly 10 digits";
        }
        if (name === "dob") {
            if (!value) error = "Date of Birth is required";
            else {
                const selected = new Date(value);
                const today = new Date();
                if (selected >= today) error = "Future dates not allowed";
            }
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle Email Separately for Edit Mode
        if (name === 'email' && mode === 'edit') {
            setEditableEmail(value);
            validateField(name, value);
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === "role" ? Number(value) : value
        }));
        validateField(name, value);
    };

    // -- Email Actions --
    const handleStartEmailEdit = () => {
        setEditableEmail(originalEmail);
        setIsEmailEditing(true);
    };

    const handleCancelEmailEdit = () => {
        setEditableEmail(originalEmail); // REVERT!
        setIsEmailEditing(false);
        setErrors(prev => ({ ...prev, email: "" })); // Clear email errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all
        const firstNameError = validateField("firstName", formData.firstName);
        const lastNameError = validateField("lastName", formData.lastName);
        // Correct email to validate
        const emailToValidate = mode === 'add' ? formData.email : editableEmail;
        const emailError = validateField("email", emailToValidate);
        const mobileError = validateField("mobileNumber", formData.mobileNumber);
        const dobError = validateField("dob", formData.dob);
        const middleError = validateField("middleName", formData.middleName);

        if (firstNameError || lastNameError || emailError || mobileError || dobError || middleError) {
            toast.error("Please fix form errors");
            return;
        }

        setIsSaving(true);
        try {
            // -- ADD MODE --
            if (mode === 'add') {
                const response = await userService.addUser(formData);
                if (response.success) {
                    toast.success("User added successfully");
                    goBack();
                } else {
                    toast.error(response.message || "Failed to add user");
                }
            }
            // -- EDIT MODE --
            else {
                // Step 1: Check Email Update
                // Compare editableEmail with originalEmail
                if (isEmailEditing && editableEmail !== originalEmail) {
                    try {
                        const emailRes = await userService.updateEmail(targetUserId, editableEmail);
                        if (!emailRes.success) {
                            throw new Error(emailRes.message || "Email update failed");
                        }
                        // Update original email to reflect success (and prevent re-update if clicked again)
                        setOriginalEmail(editableEmail);
                    } catch (emailErr) {
                        toast.error(emailErr.message || "Failed to update email");
                        setIsSaving(false);
                        return; // STOP
                    }
                }

                const updatedData = { ...formData, email: editableEmail };

                const response = await userService.updateUser(targetUserId, updatedData);

                if (response.success) {
                    toast.success("Profile updated successfully");
                    if (!isFromAdminUser) dispatch(setUser(response.data));
                    goBack();
                } else {
                    toast.error(response.message || "Profile update failed");
                }
            }
        } catch (error) {
            console.error("Error saving user:", error);
            const msg = error.response?.data?.message || "Operation failed";
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    // Email UI Logic
    const currentEmailValue = mode === 'add' ? formData.email : editableEmail;
    // Disabled if edit mode AND not editing
    const isEmailDisabled = mode === 'edit' && !isEmailEditing;

    return (
        <div className="page-box">
            <div className="card-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card-header border-bottom mb-4 pb-3">
                    <h4 className="card-title m-0">{mode === 'add' ? 'Add New User' : 'Edit User Profile'}</h4>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                        {/* Names... (Same as before) */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">First Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Only alphabets"
                                style={{ height: '46px' }}
                            />
                            {errors.firstName && <div className="text-danger small mt-1">{errors.firstName}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Middle Name</label>
                            <input
                                type="text"
                                name="middleName"
                                className={`form-control ${errors.middleName ? 'is-invalid' : ''}`}
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder="Optional"
                                style={{ height: '46px' }}
                            />
                            {errors.middleName && <div className="text-danger small mt-1">{errors.middleName}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Last Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Only alphabets"
                                style={{ height: '46px' }}
                            />
                            {errors.lastName && <div className="text-danger small mt-1">{errors.lastName}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Role</label>
                            {isFromAdminUser ? (
                                <select
                                    name="role"
                                    className="form-select"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{ height: '46px' }}
                                >
                                    <option value={0}>Admin</option>
                                    <option value={1}>Professor</option>
                                    <option value={2}>Student</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={formData.role === 0 ? "Admin" : formData.role === 1 ? "Professor" : "Student"}
                                    disabled
                                    style={{ height: '46px' }}
                                />
                            )}
                        </div>

                        {/* Email - Full Width with Edit Action */}
                        <div className="col-12">
                            <label className="form-label fw-bold small text-muted">Email Address <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''} ${isEmailDisabled ? 'bg-light' : ''}`}
                                    value={currentEmailValue} // Uses editableEmail in edit mode
                                    onChange={handleChange}
                                    placeholder="user@example.com"
                                    style={{ height: '46px' }}
                                    disabled={isEmailDisabled}
                                />
                                {canChangeEmail && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={isEmailEditing ? handleCancelEmailEdit : handleStartEmailEdit}
                                        style={{ zIndex: 0 }}
                                    >
                                        {isEmailEditing ? 'Cancel Change' : 'Change Email'}
                                    </button>
                                )}
                            </div>
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>

                        {/* Mobile & DOB (Same as before) */}
                        <div className="col-12">
                            <label className="form-label fw-bold small text-muted">Mobile Number <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="mobileNumber"
                                className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="10 Digits"
                                style={{ height: '46px' }}
                            />
                            {errors.mobileNumber && <div className="text-danger small mt-1">{errors.mobileNumber}</div>}
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold small text-muted">Date of Birth <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                name="dob"
                                className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                                value={formData.dob}
                                onChange={handleChange}
                                style={{ height: '46px' }}
                            />
                            {errors.dob && <div className="text-danger small mt-1">{errors.dob}</div>}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                        <button type="button" className="btn btn-light px-4" onClick={goBack} style={{ borderRadius: '8px' }}>
                            Cancel
                        </button>

                        <button type="submit" className="btn btn-primary px-4" disabled={isSaving || Object.values(errors).some(x => x)} style={{ borderRadius: '8px', minWidth: '120px' }}>
                            {isSaving ? "Processing..." : (mode === 'add' ? "Add User" : "Update User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserProfile;
