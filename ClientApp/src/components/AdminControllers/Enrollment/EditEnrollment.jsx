import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import enrollmentService from '../../../services/enrollmentService';
import facultyService from '../../../services/facultyService';
// import '../../UserProfile/UserProfile.css';

const EditEnrollment = ({ onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const enrollment = location.state?.enrollment;

    const [loading, setLoading] = useState(false);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        studentId: '',
        studentName: '',
        facultyId: '',
        departmentId: '',
        effectiveFrom: '',
        status: 0
    });

    useEffect(() => {
        if (!enrollment) {
            toast.error("No enrollment data found");
            navigate('/dashboard/enrollment');
            return;
        }

        setFormData({
            id: enrollment.id,
            studentId: enrollment.studentId,
            studentName: enrollment.studentName,
            facultyId: enrollment.facultyId,
            departmentId: enrollment.departmentId,
            effectiveFrom: enrollment.effectiveFrom.split('T')[0],
            status: enrollment.status
        });

        // Fetch faculties and then departments for pre-selection
        const fetchFaculties = async () => {
            try {
                const response = await facultyService.getAllFaculties({ pageSize: 100 });
                if (response.success) {
                    setFaculties(response.data);
                    const selectedFaculty = response.data.find(f => f.id === enrollment.facultyId);
                    if (selectedFaculty) {
                        setDepartments(selectedFaculty.departments);
                    }
                }
            } catch (error) {
                toast.error("Failed to load faculties");
            }
        };
        fetchFaculties();

    }, [enrollment, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id: formData.id,
                studentId: formData.studentId,
                departmentId: parseInt(formData.departmentId),
                effectiveFrom: formData.effectiveFrom,
                enrollmentStatus: parseInt(formData.status)
            };

            const response = await enrollmentService.updateEnrollment(payload);
            if (response.success) {
                toast.success("Enrollment updated successfully");
                onClose();
                navigate('/dashboard/enrollment');
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

    if (!enrollment) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Enrollment</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Read-Only Student Info */}
                                <div className="col-12">
                                    <div className="alert alert-light border d-flex align-items-center mb-0">
                                        <i className="bi bi-person-circle fs-4 me-3 text-secondary"></i>
                                        <div>
                                            <div className="small text-muted text-uppercase fw-bold">Student</div>
                                            <div className="fw-semibold">{formData.studentName}</div>
                                        </div>
                                    </div>
                                </div>

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
                                        style={{ height: '46px' }}
                                    >
                                        <option value="">-- Choose Department --</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.departmentName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Effective Date & Status */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Effective From</label>
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

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-muted">Status</label>
                                    <select
                                        name="status"
                                        className="form-select"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{ height: '46px' }}
                                    >
                                        <option value="0">Active</option>
                                        <option value="1">Completed</option>
                                        <option value="2">Dropped</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-light px-4" onClick={handleClose} disabled={loading} style={{ borderRadius: '8px' }}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary px-4" onClick={handleSubmit} disabled={loading} style={{ borderRadius: '8px', minWidth: '120px' }}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEnrollment;
