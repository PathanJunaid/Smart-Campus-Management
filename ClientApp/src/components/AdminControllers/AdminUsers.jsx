import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import UserProfile from '../UserProfile/UserProfile';
import { useNavigate } from 'react-router-dom';
import ViewUser from '../UserProfile/viewUser';
import ConfirmModal from '../UserProfile/ConfirmModal';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState({
        isEdit: false,
        user: null
    });

    const [isView, setIsView] = useState({
        isView: false,
        user: null
    });

    const[confirmDelete, setConfirmDelete]=useState({
        visible: false,
        user: null
    });


    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        isActive: true,
        pageSize: 30,
        pageNumber: 1
    });
    const [pagination, setPagination] = useState({
        totalPage: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                role: filters.role === 'All' ? '' : filters.role
            };
            const response = await userService.getUsers(params);
            if (response.success) {
                setUsers(response.data);
                setPagination({
                    totalPage: response.totalPage,
                    hasNextPage: response.hasNextPage,
                    hasPreviousPage: response.hasPreviousPage
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
    }, [filters.pageNumber, filters.pageSize, filters.isActive, filters.role, isEdit.isEdit]);

    // Debounce search
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

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            pageNumber: 1 // Reset to page 1 on filter change
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const handleOnView = (user) => {
        setIsView({
            isView: true,
            user
        })
    }
    const handleCancel = () => {

        setIsEdit({
            isEdit: false,
            user: null

        });
        setIsView({
            isView: false,
            user: null
        });


        navigate("/dashboard/users");
    };
    if (isEdit.isEdit) {
        return <UserProfile userId={isEdit.user?.id} initialData={isEdit.user} onCancel={handleCancel} isFromAdminUser={true} />;
        

    }

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



    return (
        <div className="page-box">

             {isView.isView && (
                <ViewUser
                    user={isView.user}
                    onClose={() => setIsView({ isView: false, user: null })}
                />
            )}

            {confirmDelete.visible && (
                <ConfirmModal
                    user={confirmDelete.user}
                    onConfirm={handleOnDelete}
                    onCancel={() => setConfirmDelete({ visible: false, user: null })}
                />
            )}


            <div className="card-container">
                <div className="card-header">
                    <h3 className="card-title">User Management</h3>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="filter-group search-group">
                        <input
                            type="text"
                            name="search"
                            className="form-control"
                            placeholder="Search by name, email or roll no..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            name="role"
                            className="form-control"
                            value={filters.role}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Roles</option>
                            <option value="0">Admin</option>
                            <option value="1">Faculty</option>
                            <option value="2">Student</option>
                        </select>
                    </div>
                    <div className="filter-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={filters.isActive}
                                onChange={handleFilterChange}
                            />
                            Active Only
                        </label>
                    </div>
                    <div className="filter-group">
                        <select
                            name="pageSize"
                            className="form-control"
                            value={filters.pageSize}
                            onChange={handleFilterChange}
                        >
                            <option value="15">15 per page</option>
                            <option value="30">30 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Role</th>
                                <th>DOB</th>
                                <th className="sticky-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">No users found.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.firstName}</td>
                                        <td>{user.middleName || '-'}</td>
                                        <td>{user.lastName}</td>
                                        <td><span className={`role-badge role-${user.role}`}>{getRoleLabel(user.role)}</span></td>
                                        <td>{formatDate(user.dob)}</td>
                                        <td className="sticky-action">
                                            <div className="action-buttons">
                                                <button className="btn-icon view" title="View" onClick={()=>handleOnView(user)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                </button>
                                                <button className="btn-icon edit" title="Edit" onClick={() => setIsEdit({ isEdit: true, user })}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button className="btn-icon delete" title="Delete" onClick={() => handleConfirmDelete(user)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar">
                    <span className="page-info">
                        Page {filters.pageNumber} of {pagination.totalPage || 1}
                    </span>
                    <div className="pagination-controls">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={!pagination.hasPreviousPage || loading}
                            onClick={() => handlePageChange(filters.pageNumber - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={!pagination.hasNextPage || loading}
                            onClick={() => handlePageChange(filters.pageNumber + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
