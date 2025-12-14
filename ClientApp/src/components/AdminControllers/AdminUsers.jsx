import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import ConfirmModal from '../UserProfile/ConfirmModal';
import ViewUser from '../UserProfile/ViewUser';
import { useSelector } from 'react-redux';
import './AdminUsers.css'; // Re-import Enterprise styles

const AdminUsers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: currentUser } = useSelector((state) => state.auth);

    // -- Local State --
    // Only for delete modal which is a partial action, not a page
    const [confirmDelete, setConfirmDelete] = useState({
        visible: false,
        user: null
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        isActive: 'Active',
        pageSize: 15,
        pageNumber: 1
    });
    const [pagination, setPagination] = useState({
        totalPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0
    });

    // -- Fetch Users --
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                role: filters.role === 'All' ? '' : filters.role,
                isActive: filters.isActive === 'Active' ? true : false
            };

            const response = await userService.getUsers(params);
            if (response.success) {
                setUsers(response.data);
                setPagination({
                    totalPage: response.totalPage,
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage,
                    totalCount: response.totalCount
                });
            } else {
                toast.error(response.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("An error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.pageNumber, filters.pageSize, filters.isActive, filters.role, location.state?.refresh]);

    // -- Search Debounce --
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.pageNumber !== 1) {
                setFilters(prev => ({ ...prev, pageNumber: 1 }));
            } else {
                fetchUsers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    // -- Handlers --
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

    const getRoleLabel = (roleId) => {
        switch (roleId) {
            case 0: return 'Admin';
            case 1: return 'Faculty';
            case 2: return 'Student';
            default: return 'Unknown';
        }
    };

    // -- Routing Actions --
    const handleAddUser = () => {
        navigate('add'); // Relative path -> /dashboard/users/add
    };

    const handleOnView = (user) => {
        navigate(`view/${user.id}`);
    };

    const handleOnEdit = (user) => {
        navigate(`edit/${user.id}`);
    };

    // -- Delete Logic --
    // Delete is small enough to stay as a modal on the table
    const handleConfirmDelete = (user) => {
        setConfirmDelete({
            visible: true,
            user
        });
    }

    const handleOnDelete = async (user) => {
        try {
            const response = await userService.deleteUser(user.id);
            if (response.success) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to delete user");
            }
        } catch (e) {
            toast.error("Delete failed");
        }
        setConfirmDelete({ visible: false, user: null });
    };

    // Helper
    const getFullName = (user) => {
        return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    };

    return (
        <>
            <div className="page-box admin-users-container">
                {/* Delete Modal - Kept local as it's a confirmation, not a page */}
                {confirmDelete.visible && (
                    <ConfirmModal
                        user={confirmDelete.user}
                        onConfirm={handleOnDelete}
                        onCancel={() => setConfirmDelete({ visible: false, user: null })}
                    />
                )}

                <div className="users-card">
                    <div className="users-card-header">
                        {/* Top Controls */}
                        <div className="d-flex gap-3 align-items-center w-100 flex-wrap">

                            {/* Search */}
                            <div className="">
                                <input
                                    type="text"
                                    name="search"
                                    className="form-control search-input"
                                    placeholder="Search by name or email"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Role Filter */}
                            <div style={{ minWidth: '150px' }}>
                                <select
                                    name="role"
                                    className="form-select filter-select"
                                    value={filters.role}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Roles</option>
                                    <option value="0">Admin</option>
                                    <option value="1">Faculty</option>
                                    <option value="2">Student</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div style={{ minWidth: '150px' }}>
                                <select
                                    name="isActive"
                                    className="form-select filter-select"
                                    value={filters.isActive}
                                    onChange={handleFilterChange}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Add User Button */}
                            <div className="ms-auto">
                                <button className="btn btn-primary btn-add-user h-100 d-flex align-items-center gap-2" onClick={handleAddUser}>
                                    <span>
                                        <i className="bi bi-plus-circle"></i>
                                    </span>
                                    <span>
                                        Add User
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="table-container">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="sticky-action text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="user-name-text">{getFullName(user)}</div>
                                            </td>
                                            <td className="email-text">{user.email}</td>
                                            <td><span className={`role-badge role-${user.role}`}>{getRoleLabel(user.role)}</span></td>
                                            <td>
                                                <span className={`status-badge ${user.active ? 'status-active' : 'status-inactive'}`}>
                                                    <span className="status-dot"></span>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="sticky-action text-center">
                                                <div className="action-buttons justify-content-center">
                                                    <button className="btn-icon view" title="View" onClick={() => handleOnView(user)}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    </button>
                                                    <button className="btn-icon edit" title="Edit" onClick={() => handleOnEdit(user)}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    {user.active ? (
                                                        <button
                                                            className="btn-icon delete"
                                                            title={currentUser?.id === user.id ? "You cannot delete your own account" : "Delete"}
                                                            onClick={() => currentUser?.id !== user.id && handleConfirmDelete(user)}
                                                            disabled={currentUser?.id === user.id}
                                                            style={currentUser?.id === user.id ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
                                                    ) : ""}
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
                            Showing {pagination.totalCount === 0 ? 0 : (filters.pageNumber - 1) * filters.pageSize + 1} – {Math.min(filters.pageNumber * filters.pageSize, pagination.totalCount)} of {pagination.totalCount} users
                        </span>
                        <div className="pagination-actions">
                            <select
                                name="pageSize"
                                className="page-size-select"
                                value={filters.pageSize}
                                onChange={handleFilterChange}
                            >
                                <option value="7">7 / page</option>
                                <option value="15">15 / page</option>
                                <option value="30">30 / page</option>
                                <option value="50">50 / page</option>
                                <option value="100">100 / page</option>
                            </select>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn-page"
                                    disabled={!pagination.hasPreviousPage || loading}
                                    onClick={() => handlePageChange(filters.pageNumber - 1)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    className="btn-page"
                                    disabled={!pagination.hasNextPage || loading}
                                    onClick={() => handlePageChange(filters.pageNumber + 1)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Routes>
                <Route path="view/:id" element={<ViewUser onClose={() => navigate('/dashboard/users')} />} />
            </Routes>
        </>
    );
};

export default AdminUsers;
