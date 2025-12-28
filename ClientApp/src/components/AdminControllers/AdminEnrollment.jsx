import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import enrollmentService from '../../services/enrollmentService';
import facultyService from '../../services/facultyService';
import './AdminUsers.css'; // Reusing AdminUsers styling
import AddEnrollment from './Enrollment/AddEnrollment';
import EditEnrollment from './Enrollment/EditEnrollment';
import BulkEnrollment from './Enrollment/BulkEnrollment';
import ConfirmModal from '../UserProfile/ConfirmModal';
import ViewEnrollment from './Enrollment/ViewEnrollment';

const AdminEnrollment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // -- State --
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faculties, setFaculties] = useState([]); // For Dropdowns
    const [departments, setDepartments] = useState([]); // Filtered by Faculty

    // Delete Modal State
    const [confirmDelete, setConfirmDelete] = useState({
        visible: false,
        data: null
    });

    // ... existing code ...

    // Handle Delete Click (Open Modal)
    const handleDeleteClick = (enrollment) => {
        setConfirmDelete({
            visible: true,
            data: enrollment
        });
    };

    // Actual Delete Logic (Called by Modal)
    const handleConfirmDelete = async () => {
        const id = confirmDelete.data?.id;
        if (!id) return;

        try {
            const response = await enrollmentService.deleteEnrollment(id);
            if (response.success) {
                toast.success("Enrollment deleted successfully");
                fetchEnrollments();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to delete enrollment");
        }
        setConfirmDelete({ visible: false, data: null });
    };

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        facultyId: '',
        departmentId: '',
        enrollmentYear: '',
        status: '',
        pageSize: 15,
        pageNumber: 1
    });

    const [pagination, setPagination] = useState({
        totalPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0
    });

    // -- Fetch Data --
    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                facultyId: filters.facultyId || null,
                departmentId: filters.departmentId || null,
                enrollmentYear: filters.enrollmentYear || null,
                status: filters.status === 'All' ? null : (filters.status === 'Active' ? 0 : filters.status === 'Completed' ? 1 : filters.status === 'Dropped' ? 2 : null)
            };

            const response = await enrollmentService.getEnrollments(params);
            if (response.success) {
                setEnrollments(response.data.items || []);
                setPagination({
                    totalPage: response.data.totalPages,
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage,
                    totalCount: response.data.totalCount
                });
            } else {
                toast.error(response.message || "Failed to fetch enrollments");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching enrollments");
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculties = async () => {
        try {
            const response = await facultyService.getAllFaculties({ pageSize: 100 }); // Get all
            if (response.success) {
                setFaculties(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch faculties", error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    useEffect(() => {
        fetchEnrollments();
    }, [filters.pageNumber, filters.pageSize, filters.facultyId, filters.departmentId, filters.enrollmentYear, filters.status, location.state?.refresh]);

    // Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.pageNumber !== 1) {
                setFilters(prev => ({ ...prev, pageNumber: 1 }));
            } else {
                fetchEnrollments();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    // -- Handlers --
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        if (name === 'facultyId') {
            // Update department dropdown based on faculty
            const selectedFaculty = faculties.find(f => f.id === parseInt(value));
            setDepartments(selectedFaculty ? selectedFaculty.departments : []);
            setFilters(prev => ({ ...prev, facultyId: value, departmentId: '', pageNumber: 1 }));
        } else {
            setFilters(prev => ({ ...prev, [name]: value, pageNumber: 1 }));
        }
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, pageNumber: newPage }));
    };

    const handleRefresh = () => {
        fetchEnrollments();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="status-badge status-active"><span className="status-dot"></span>Active</span>;
            case 1: return <span className="status-badge"><span className="status-dot" style={{ backgroundColor: '#3b82f6' }}></span>Completed</span>; // Blue
            case 2: return <span className="status-badge status-inactive"><span className="status-dot"></span>Dropped</span>;
            default: return status;
        }
    };

    // Soft Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete (drop) this enrollment?")) return;
        try {
            const response = await enrollmentService.deleteEnrollment(id);
            if (response.success) {
                toast.success("Enrollment deleted successfully");
                fetchEnrollments();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to delete enrollment");
        }
    };

    return (
        <>
            {/* Delete Confirmation Modal */}
            {confirmDelete.visible && (
                <ConfirmModal
                    user={{ firstName: `Enrollment for ${confirmDelete.data.studentName}` }} // Mocking user object for generic modal reuse
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmDelete({ visible: false, data: null })}
                />
            )}

            <div className="page-box admin-users-container">
                <div className="users-card">
                    <div className="users-card-header">
                        {/* Filters */}
                        <div className="d-flex gap-2 align-items-center w-100 flex-wrap">
                            <input
                                type="text"
                                name="search"
                                className="form-control search-input"
                                placeholder="Search Student..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                style={{ maxWidth: '200px' }}
                            />

                            <select name="facultyId" className="form-select filter-select" value={filters.facultyId} onChange={handleFilterChange} style={{ maxWidth: '180px' }}>
                                <option value="">All Faculties</option>
                                {faculties.map(f => <option key={f.id} value={f.id}>{f.facultyName}</option>)}
                            </select>

                            <select name="departmentId" className="form-select filter-select" value={filters.departmentId} onChange={handleFilterChange} style={{ maxWidth: '180px' }} disabled={!filters.facultyId}>
                                <option value="">All Departments</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.departmentName}</option>)}
                            </select>

                            <select name="enrollmentYear" className="form-select filter-select" value={filters.enrollmentYear} onChange={handleFilterChange} style={{ maxWidth: '120px' }}>
                                <option value="">All Years</option>
                                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            <select name="status" className="form-select filter-select" value={filters.status} onChange={handleFilterChange} style={{ maxWidth: '120px' }}>
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Dropped">Dropped</option>
                            </select>

                            <div className="ms-auto d-flex gap-2">
                                <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => navigate('bulk')}>
                                    <i className="bi bi-upload"></i> Bulk Upload
                                </button>
                                <button className="btn btn-primary btn-add-user h-100 d-flex align-items-center gap-2" onClick={() => navigate('add')}>
                                    <span><i className="bi bi-plus-circle"></i></span>
                                    <span>Add Enrollment</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Faculty</th>
                                    <th>Department</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Status</th>
                                    <th className="sticky-action text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="8" className="text-center py-5">Loading...</td></tr>
                                ) : enrollments.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-5">No enrollments found.</td></tr>
                                ) : (
                                    enrollments.map(item => (
                                        <tr key={item.id}>
                                            <td><div className="user-name-text">{item.studentName}</div></td>
                                            <td className="email-text">{item.email}</td>
                                            <td>{item.facultyName}</td>
                                            <td>{item.departmentName}</td>
                                            <td>{new Date(item.effectiveFrom).toLocaleDateString()}</td>
                                            <td>{new Date(item.effectiveTo).toLocaleDateString()}</td>
                                            <td>{getStatusBadge(item.status)}</td>
                                            <td className="sticky-action text-center">
                                                <div className="action-buttons justify-content-center">
                                                    <button className="btn-icon view" title="View" onClick={() => navigate(`view/${item.id}`, { state: { enrollment: item } })}><i className="bi bi-eye"></i></button>
                                                    <button className="btn-icon edit" title="Edit" onClick={() => navigate(`edit/${item.id}`, { state: { enrollment: item } })}><i className="bi bi-pencil"></i></button>
                                                    <button className="btn-icon delete" title="Delete" onClick={() => handleDeleteClick(item)}><i className="bi bi-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-container">
                        <span className="pagination-info">
                            Showing {pagination.totalCount === 0 ? 0 : (filters.pageNumber - 1) * filters.pageSize + 1} – {Math.min(filters.pageNumber * filters.pageSize, pagination.totalCount)} of {pagination.totalCount}
                        </span>
                        <div className="pagination-actions">
                            <select name="pageSize" className="page-size-select" value={filters.pageSize} onChange={handleFilterChange}>
                                <option value="7">7</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="50">50</option>
                            </select>
                            <div className="d-flex gap-2">
                                <button className="btn-page" disabled={!pagination.hasPreviousPage} onClick={() => handlePageChange(filters.pageNumber - 1)}>{'<'}</button>
                                <button className="btn-page" disabled={!pagination.hasNextPage} onClick={() => handlePageChange(filters.pageNumber + 1)}>{'>'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Routes>
                <Route path="add" element={<AddEnrollment onClose={handleRefresh} />} />
                <Route path="view/:id" element={<ViewEnrollment onClose={() => navigate('/dashboard/enrollment')} />} />
                <Route path="edit/:id" element={<EditEnrollment onClose={handleRefresh} />} />
                <Route path="bulk" element={<BulkEnrollment onClose={handleRefresh} />} />
            </Routes>
        </>
    );
};

export default AdminEnrollment;
