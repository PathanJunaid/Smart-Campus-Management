import React, { useState, useEffect } from 'react';
import facultyService from '../../services/facultyService';
import departmentService from '../../services/departmentService';
import AddFacultyModal from '../FacultyModal/AddFacultyModal';
import { toast } from 'react-toastify';
import ConfirmModal from '../UserProfile/ConfirmModal';


const AdminFaculty = () => {
    const [faculties, setFaculties] = useState([]);
    const [editFaculty, seteditFaculty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedFacultyId, setExpandedFacultyId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        pageSize: 15,
        pageNumber: 1
    });
    const [pagination, setPagination] = useState({
        totalPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({
        visible: false,
        name: null,
        topic: null,
        id: null
    });

    const fetchFaculties = async () => {
        setLoading(true);
        try {
            const response = await facultyService.getAllFaculties(filters);
            if (response.success) {
                setFaculties(response.data);
                setPagination({
                    totalPage: response.totalPage,
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    totalCount: response.totalCount
                });
            } else {
                toast.error(response.message || "Failed to fetch faculties");
            }
        } catch (error) {
            console.error("Error fetching faculties:", error);
            toast.error("An error occurred while fetching faculties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, [filters.pageNumber, filters.pageSize]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.pageNumber !== 1) {
                setFilters(prev => ({ ...prev, pageNumber: 1 }));
            } else {
                fetchFaculties();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            pageNumber: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, pageNumber: newPage }));
    };

    const toggleFaculty = (id) => {
        setExpandedFacultyId(prev => prev === id ? null : id);
    };

    const handleAddFaculty = () => {
        setAddModalOpen(true);
        seteditFaculty(null);
    };

    const handleAddDepartment = (e, facultyId) => {
        e.stopPropagation();
        toast.info(`Add Department for Faculty ${facultyId} coming soon!`);
    };

    const handleEditFaculty = (e, faculty) => {
        e.stopPropagation();
        setAddModalOpen(true);
        seteditFaculty(faculty);
        console.log("Edit faculty:", faculty);
    };
    const handleOnConfirmDelete = (faculty) => {
        var topic = "faculty";
        setConfirmDelete({
            visible: true,
            name: faculty.facultyName,
            topic: topic,
            id: faculty.id
        });
    };

    const handleDeleteFaculty = async ( facultyId) => {
        
        try {

            const response = await facultyService.deleteFaculty(facultyId);
            console.log("Delete response:", response);
            toast.success("Faculty deleted successfully");
            fetchFaculties();

           
        } catch (error) {
            console.error("Error deleting faculty:", error);
            toast.error("An error occurred while deleting faculty");
        }
        setConfirmDelete({
            visible: false,
            name: null,
            topic: null,
            id: null
        })
    };


    const handleEditDepartment = (dept) => {
        toast.info(`Edit Department ${dept.departmentName} coming soon!`);
    };

    const handleDeleteDepartment = (deptId) => {
        const response  = facultyService
    };

    const handleCreateFaculty = async (facultyData) => {
        try {
            const response = await facultyService.addFaculty(facultyData);
            if (response.success) {
                toast.success("Faculty added successfully");
                setAddModalOpen(false);
                fetchFaculties();
                console.log("Added faculty:", response.data);
            } else {
                toast.error(response.message || "Failed to add faculty");
            }
        } catch (error) {
            console.error("Error adding faculty:", error);
            toast.error(error.message || "An error occurred while adding faculty");

        }


    }
    const handleUpdateFaculty = async (facultyData) => {
        try {
            const response = await facultyService.updateFaculty(editFaculty.id, facultyData);
            console.log("Update response:", response);
            toast.success("Faculty updated successfully");
            setAddModalOpen(false);
            fetchFaculties();
        } catch (error) {
            console.error("Error updating faculty:", error);
            toast.error("An error occurred while updating faculty");

        }
    }

    return (
        <div className="page-box">
            <AddFacultyModal
                isOpen={addModalOpen}
                EditFaculty={editFaculty}
                onClose={() => {
                    setAddModalOpen(false);
                    seteditFaculty(null);

                }}
                isEdit={!!editFaculty}
                initialData={editFaculty}
                onSubmit={editFaculty ? handleUpdateFaculty : handleCreateFaculty}
            />
            {confirmDelete.visible && (
                <ConfirmModal
                    name={confirmDelete.name}
                    topic={confirmDelete.topic}
                    id={confirmDelete.id}
                    onConfirm={handleDeleteFaculty}
                    onCancel={() => setConfirmDelete({ visible: false, id: null, name: null, topic: null })}
                />
            )}
  
            <div className="card-container">
                <div className="card-header d-flex justify-content-between align-items-center border-0 pb-0 mb-3">
                    {/* Search and Add Button */}
                    <div className="d-flex gap-3 align-items-center w-100">
                        <div className="search-group flex-grow-1">
                            <input
                                type="text"
                                name="search"
                                className="form-control"
                                placeholder="Search by faculty name or description..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleAddFaculty}>
                            Add Faculty
                        </button>
                    </div>
                </div>

                {/* Faculty List */}
                <div className="table-responsive mt-4">
                    <table className="data-table faculty-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Faculty Name</th>
                                <th style={{ width: '40%' }}>Description</th>
                                <th className="text-end" style={{ width: '20%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : faculties.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">No faculties found.</td>
                                </tr>
                            ) : (
                                faculties.map(faculty => (
                                    <React.Fragment key={faculty.id}>
                                        {/* Faculty Row */}
                                        <tr
                                            className={`faculty-row ${expandedFacultyId === faculty.id ? 'expanded' : ''}`}
                                            onClick={() => toggleFaculty(faculty.id)}
                                        >
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <span className={`expand-icon ${expandedFacultyId === faculty.id ? 'open' : ''}`}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 18 15 12 9 6"></polyline>
                                                        </svg>
                                                    </span>
                                                    <div className="fw-bold text-primary">{faculty.facultyName}</div>
                                                </div>
                                            </td>
                                            <td className="text-muted">{faculty.facultyDescription}</td>
                                            <td className="text-end">
                                                <div className="action-buttons justify-content-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={(e) => handleAddDepartment(e, faculty.id)}
                                                        title="Add Department"
                                                    >
                                                        + Dept
                                                    </button>
                                                    <button className="btn-icon edit" title="Edit Faculty" onClick={(e) => handleEditFaculty(e, faculty)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button className="btn-icon delete" title="Delete Faculty" onClick={() => handleOnConfirmDelete(faculty)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Departments Rows */}
                                        {expandedFacultyId === faculty.id && (
                                            <>
                                                {faculty.departments && faculty.departments.length > 0 ? (
                                                    faculty.departments.map(dept => (
                                                        <tr key={dept.id} className="department-row">
                                                            <td className="ps-5">
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="dept-indicator"></div>
                                                                    <span className="fw-medium">{dept.departmentName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-muted small">{dept.departmentDescription || '-'}</td>
                                                            <td className="text-end">
                                                                <div className="action-buttons justify-content-end">
                                                                    <button className="btn-icon edit" title="Edit Department" onClick={() => handleEditDepartment(dept)}>
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                                    </button>
                                                                    <button className="btn-icon delete" title="Delete Department" onClick={() => handleDeleteDepartment(dept.id)}>
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr className="department-row">
                                                        <td colSpan="3" className="ps-5 text-muted fst-italic small py-3">
                                                            No departments found. Click "+ Dept" to add one.
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar">
                    <span className="page-info">
                        Record {pagination.totalCount !== 0 ? (filters.pageNumber - 1) * filters.pageSize + 1 : 0} - {Math.min(filters.pageNumber * filters.pageSize, pagination.totalCount)} of {pagination.totalCount}
                    </span>
                    <div className="d-flex align-items-center gap-3">
                        <select
                            name="pageSize"
                            className="form-select form-select-sm"
                            value={filters.pageSize}
                            onChange={handleFilterChange}
                            style={{ width: 'auto' }}
                        >
                            <option value="15">15 per page</option>
                            <option value="30">30 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                        <div className="pagination-controls">
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled={!pagination.hasPreviousPage || loading}
                                onClick={() => handlePageChange(filters.pageNumber - 1)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled={!pagination.hasNextPage || loading}
                                onClick={() => handlePageChange(filters.pageNumber + 1)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFaculty;
