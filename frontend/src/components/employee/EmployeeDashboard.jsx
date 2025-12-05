import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Link, Navigate } from "react-router-dom";
import digilogo from "../../assets/images/digilogo.svg";
import {
    Home,
    CalendarCheck,
    ListChecks,
    BarChart3,
    CheckCircle,
    LogOut,
    Menu,
    X,
    IndianRupee, // 💡 Added for Finance
    User, // 💡 Added for User Profile, assuming DashboardHome is for User Management
} from "lucide-react";

import DashboardHome from "../../modules/DashboardHome"; // User Management (Admin Home)
import Attendance from "../../modules/Attendance";
import Projects from "../../modules/Projects";
import Performance from "../../modules/Performance";
import Todo from "../../modules/Todo";
// 1. ADD NEW IMPORTS
import LeaveApprovalPage from "../../modules/LeaveApprovalPage"; 
import AdminAttendanceDashboard from "../../modules/AdminAttendanceDashboard"; // New Admin Attendance Module
import FinancialDashboard from "../../modules/FinancialDashboard"; // New Admin Finance Module


const EmployeeDashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Use role from localStorage for initial render and then update with fetched data
    const [user, setUser] = useState({ name: "Loading...", role: localStorage.getItem("userRole") || "..." }); 
    const navigate = useNavigate();

    // Convenience variables based on user role
    const isAdmin = user.role === "ADMIN";
    const isHRorAdmin = user.role === "HR" || isAdmin;
    const isEmployeeOrHR = user.role === "EMPLOYEE" || user.role === "HR";

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/"); // Redirect to root login page
                return;
            }

            try {
                // Fetch user data from /api/me
                const response = await fetch("https://digiwings.onrender.com/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Authentication failed");
                }

                const userData = await response.json();
                setUser(prevUser => ({ ...prevUser, ...userData })); // Update user state with full data
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                handleLogout();
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole"); // Clear role as well
        navigate("/");
    };

    return (
        <div className="flex min-h-screen">
            {/* sidebar */}
            <div
                className={`fixed left-0 h-screen text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
            >
                <div
                    className="bg-black/30 backdrop-blur-md border border-white/15 
                rounded-r-md shadow-lg h-full"
                >
                    {/* digilogo */}
                    <div className="flex items-center justify-between p-4">
                        <img
                            src={digilogo}
                            alt="Digiwing ERP"
                            className="h-13 w-13"
                        />
                    </div>

                    {/* sidebar menu */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-2">
                            {/* 2. UPDATED ADMIN LINKS */}
                            {isAdmin && (
                                <li>
                                    <Link
                                        to="/employee-dashboard"
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Home size={18} />
                                        <span>User Management</span> 
                                    </Link>
                                </li>
                            )}

                            {/* NEW: Admin Attendance Dashboard link */}
                            {isAdmin && (
                                <li>
                                    <Link
                                        to="/employee-dashboard/admin-attendance"
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <CalendarCheck size={18} />
                                        <span>Admin Attendance</span>
                                    </Link>
                                </li>
                            )}

                            {/* NEW: Financial Dashboard link */}
                            {isAdmin && (
                                <li>
                                    <Link
                                        to="/employee-dashboard/finance"
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <IndianRupee size={18} />
                                        <span>Financial Dashboard</span>
                                    </Link>
                                </li>
                            )}


                            {/* Employee and HR/Employee Attendance */}
                            {isEmployeeOrHR && (
                                <li>
                                    <Link
                                        to="/employee-dashboard/attendance"
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <CalendarCheck size={18} />
                                        <span>Attendance</span>
                                    </Link>
                                </li>
                            )}


                            {/* Leave Approval for Admin and HR */}
                            {isHRorAdmin && (
                                <li>
                                    <Link
                                        to="/employee-dashboard/leaveapprovalpage"
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <CalendarCheck size={18} />
                                        <span>Leave Approval</span>
                                    </Link>
                                </li>
                            )}

                            {/* Other Modules (Projects, Performance, Todo) */}
                            <li>
                                <Link
                                    to="/employee-dashboard/projects"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ListChecks size={18} />
                                    <span>Projects</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/employee-dashboard/performance"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <BarChart3 size={18} />
                                    <span>Performance</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/employee-dashboard/todo"
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <CheckCircle size={18} />
                                    <span>To-Do List</span>
                                </Link>
                            </li>
                            
                            {/* Logout */}
                            <li>
                                <button
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "Are you sure you want to logout?"
                                            )
                                        ) {
                                            handleLogout();
                                        }
                                    }}
                                    className="flex items-center gap-3 p-2 w-full text-left rounded-lg hover:bg-red-600 transition"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* main area */}
            <div className="flex-1 flex flex-col overflow-y-auto md:ml-64 h-screen">
                <div className="flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-40">
                    {/* mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden fixed top-4 right-4 z-50 p-2 text-white bg-gray-900 rounded-md"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* user info */}
                    <div className="flex items-center space-x-3 ml-auto">
                        <div className="hidden sm:block text-right">
                            <p className="text-gray-400 text-sm capitalize">
                                {user.role}
                            </p>
                            <h4 className="text-white font-semibold">
                                {user.name}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* modules */}
                <div className="p-0 text-gray-900 overflow-y-auto flex-1 scrollbar-hide">
                    {/* 3. UPDATED ROUTES */}
                    <Routes>
                        {/* Admin Routes */}
                        {isAdmin && (
                            <>
                                {/* Index Route (User Management) */}
                                <Route index element={<DashboardHome />} /> 
                                {/* New Admin Attendance Route */}
                                <Route path="admin-attendance" element={<AdminAttendanceDashboard />} /> 
                                {/* New Financial Dashboard Route */}
                                <Route path="finance" element={<FinancialDashboard />} /> 
                            </>
                        )}
                        
                        {/* Shared/Employee Routes */}
                        <Route path="projects" element={<Projects />} />
                        <Route path="performance" element={<Performance />} />
                        <Route path="todo" element={<Todo />} />

                        {/* Attendance (HR/Employee) */}
                        {isEmployeeOrHR && (
                            <Route path="attendance" element={<Attendance />} />
                        )}

                        {/* Leave Approval (Admin/HR) */}
                        {isHRorAdmin && (
                            <Route path="leaveapprovalpage" element={<LeaveApprovalPage />} />
                        )}


                        {/* Fallback Route */}
                        <Route
                            path="*"
                            element={<Navigate to={isAdmin ? "/employee-dashboard" : "/employee-dashboard/attendance"} replace />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;