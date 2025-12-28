import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import enrollmentService from '../../../services/enrollmentService';
import facultyService from '../../../services/facultyService';
// import '../../UserProfile/UserProfile.css';

const BulkEnrollment = ({ onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [uploadErrors, setUploadErrors] = useState([]);

    const [formData, setFormData] = useState({
        facultyId: '',
        departmentId: '',
        effectiveFrom: new Date().toISOString().split('T')[0],
        file: null
    });

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await facultyService.getAllFaculties({ pageSize: 100 });
                if (response.success) {
                    setFaculties(response.data);
                }
            } catch (error) {
                toast.error("Failed to load faculties");
            }
        };
        fetchFaculties();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'facultyId') {
            const selectedFaculty = faculties.find(f => f.id === parseInt(value));
            setDepartments(selectedFaculty ? selectedFaculty.departments : []);
            setFormData(prev => ({ ...prev, facultyId: value, departmentId: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
        setUploadErrors([]); // Clear errors when new file selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadErrors([]);

        if (!formData.file || !formData.departmentId || !formData.effectiveFrom) {
            toast.warning("Please fill all fields and select a file.");
            return;
        }

        const data = new FormData();
        data.append('File', formData.file);
        data.append('Role', 2); // 2 = Student
        data.append('DepartmentId', formData.departmentId);
        data.append('EffectiveFrom', formData.effectiveFrom);

        setLoading(true);
        try {
            const response = await enrollmentService.bulkEnroll(data);
            if (response.success) {
                // Show summary
                if (response.errorList && response.errorList.length > 0) {
                    toast.warning(`Upload completed with ${response.errorList.length} errors.`);
                    setUploadErrors(response.errorList);
                    // Do NOT lose modal if there are errors, so user can see them.
                } else {
                    toast.success("Bulk enrollment completed successfully!");
                    onClose();
                    navigate('/dashboard/enrollment');
                }
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        navigate('/dashboard/enrollment');
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Bulk Student Enrollment</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="alert alert-info border-info d-flex align-items-center gap-3">
                                <i className="bi bi-info-circle-fill fs-4"></i>
                                <div>
                                    Upload an Excel/CSV file with student details (Email is required).
                                    <br />
                                    <small className="text-secondary">Dates and Department selected below will apply to all students in the file.</small>
                                </div>
                            </div>

                            <div className="row g-3">
                                {/* Faculty & Department */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Faculty <span className="text-danger">*</span></label>
                                    <select
                                        name="facultyId"
                                        className="form-select"
                                        value={formData.facultyId}
                                        onChange={handleChange}
                                        required
                                        style={{ height: '46px' }}
                                    >
                                        <option value="">-- Choose Faculty --</option>
                                        {faculties.map(f => (
                                            <option key={f.id} value={f.id}>{f.facultyName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Department <span className="text-danger">*</span></label>
                                    <select
                                        name="departmentId"
                                        className="form-select"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.facultyId}
                                        style={{ height: '46px' }}
                                    >
                                        <option value="">-- Choose Department --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.departmentName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Effective Date */}
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-muted">Effective Start Date <span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        name="effectiveFrom"
                                        className="form-control"
                                        value={formData.effectiveFrom}
                                        onChange={handleChange}
                                        required
                                        style={{ height: '46px' }}
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-muted">Upload Excel/CSV File <span className="text-danger">*</span></label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        required
                                        style={{ height: '46px', paddingTop: '10px' }}
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Error Summary */}
                        {uploadErrors.length > 0 && (
                            <div className="alert alert-warning mt-4 mb-0">
                                <h6 className="alert-heading d-flex align-items-center gap-2">
                                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                                    Upload Completed with Errors
                                </h6>
                                <hr />
                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    <ul className="mb-0 small text-secondary">
                                        {uploadErrors.map((err, index) => (
                                            <li key={index}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-light px-4" onClick={handleClose} disabled={loading} style={{ borderRadius: '8px' }}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary px-4" onClick={handleSubmit} disabled={loading} style={{ borderRadius: '8px', minWidth: '120px' }}>
                            {loading ? 'Uploading...' : 'Upload & Enroll'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkEnrollment;
