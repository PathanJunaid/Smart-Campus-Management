import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setIsCollapsed } from "../../store/authSlice";

// Simple SVG Icons
const Icons = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Attendance: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>,
    Courses: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    Students: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Teachers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Profile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
};

export default function Sidebar({ title, menuItems }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isCollapsed = useSelector(
        (state) => state.auth.isCollapsed
    );

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    const isActive = (path) => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
        }
        return location.pathname.startsWith(path);
    };

    const toggleSidebar = () => {
        dispatch(setIsCollapsed(!isCollapsed));
    };

    return (
        <aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">{title}</div>
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isCollapsed ? <Icons.Menu /> : <Icons.ChevronLeft />}
                </button>
            </div>

            <ul className="sidebar-menu">
                {menuItems.map((item) => {
                    const Icon = Icons[item.icon] || Icons.Dashboard;
                    return (
                        <li
                            key={item.name}
                            className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                            onClick={() => {
                                if (isActive(item.path)) {
                                    // Force refresh if already active
                                    navigate(item.path, { state: { refresh: Date.now() }, replace: true });
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            data-tooltip={item.name}
                        >
                            <div className="menu-icon">
                                <Icon />
                            </div>
                            <span className="menu-label">{item.name}</span>
                        </li>
                    );
                })}
            </ul>

            <div className="sidebar-footer">
                <li className="menu-item" onClick={handleLogout} data-tooltip="Logout">
                    <div className="menu-icon">
                        <Icons.Logout />
                    </div>
                    <span className="menu-label">Logout</span>
                </li>
            </div>
        </aside>
    );
}
