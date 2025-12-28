import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import enrollmentService from '../../../services/enrollmentService';
import facultyService from '../../../services/facultyService';
// import '../../UserProfile/UserProfile.css'; 

const AddEnrollment = ({ onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        studentId: '',
        facultyId: '',
        departmentId: '',
        effectiveFrom: new Date().toISOString().split('T')[0] // Today
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, facultiesRes] = await Promise.all([
                    enrollmentService.getUnenrolledStudents(),
                    facultyService.getAllFaculties({ pageSize: 100 })
                ]);

                if (studentsRes.success) setStudents(studentsRes.data);
                if (facultiesRes.success) setFaculties(facultiesRes.data);
            } catch (error) {
                toast.error("Failed to load form data");
            }
        };
        fetchData();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentId || !formData.departmentId || !formData.effectiveFrom) {
            toast.warning("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                studentId: formData.studentId,
                departmentId: parseInt(formData.departmentId),
                effectiveFrom: formData.effectiveFrom
            };

            const response = await enrollmentService.addEnrollment(payload);
            if (response.success) {
                toast.success("Student enrolled successfully");
                onClose(); // Trigger refresh in parent
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

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Student Enrollment</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                {/* Student Selection */}
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-muted">Select Student <span className="text-danger">*</span></label>
                                    <select
                                        name="studentId"
                                        className="form-select"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        required
                                        style={{ height: '46px' }}
                                    >
                                        <option value="">-- Choose Student --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.firstName} {s.lastName} ({s.email})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="form-text">Only active, unenrolled students are listed.</div>
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
                                    <div className="form-text">End date will be auto-calculated based on department duration.</div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-light px-4" onClick={handleClose} disabled={loading} style={{ borderRadius: '8px' }}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary px-4" onClick={handleSubmit} disabled={loading} style={{ borderRadius: '8px', minWidth: '120px' }}>
                            {loading ? 'Enrolling...' : 'Enroll Student'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEnrollment;
