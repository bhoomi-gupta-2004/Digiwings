import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, MinusCircle, UserCheck } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/admin/attendance/dashboard/today';

const AdminAttendanceDashboard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAttendanceSummary = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to fetch attendance summary.");
            }

            const data = await response.json();
            setAttendanceData(data);
        } catch (error) {
            console.error("Error fetching admin attendance:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceSummary();
    }, []);

    const totalUsers = attendanceData.length;
    const checkedInCount = attendanceData.filter(u => u.checked_in && !u.check_out_at).length;
    const checkedOutCount = attendanceData.filter(u => u.checked_in && u.check_out_at).length;
    const absentCount = totalUsers - checkedInCount - checkedOutCount; // Simplified absence

    const formatTime = (iso) => {
        if (!iso) return '-';
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="p-4 md:p-6 space-y-6 text-white w-full pb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                Today's Attendance Summary <Clock size={20} />
            </h2>
            
            {error && <p className="text-red-400 p-4 bg-red-900/30 rounded">{error}</p>}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-lg shadow text-center">
                    <p className="text-gray-400">Total Employees</p>
                    <h3 className="text-xl font-bold text-blue-400">{totalUsers}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-lg shadow text-center">
                    <p className="text-gray-400">Checked In</p>
                    <h3 className="text-xl font-bold text-green-400">{checkedInCount}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-lg shadow text-center">
                    <p className="text-gray-400">Checked Out</p>
                    <h3 className="text-xl font-bold text-yellow-400">{checkedOutCount}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-lg shadow text-center">
                    <p className="text-gray-400">Absent / On Leave</p>
                    <h3 className="text-xl font-bold text-red-400">{absentCount}</h3>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Employee Status</h3>
                {loading ? (
                    <p className="text-center text-gray-400">Loading details...</p>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-2">Employee</th>
                                <th className="p-2">Employee ID</th>
                                <th className="p-2">Check In</th>
                                <th className="p-2">Check Out</th>
                                <th className="p-2">Current Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((user) => (
                                <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2 text-sm text-gray-400">{user.employee_id}</td>
                                    <td className="p-2">{formatTime(user.check_in_at)}</td>
                                    <td className="p-2">{formatTime(user.check_out_at)}</td>
                                    <td className="p-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit
                                            ${user.checked_in && !user.check_out_at ? 'text-green-400 bg-green-900/50' :
                                              user.checked_in && user.check_out_at ? 'text-yellow-400 bg-yellow-900/50' :
                                              'text-red-400 bg-red-900/50'}`
                                        }>
                                            {user.checked_in && !user.check_out_at ? <UserCheck size={14} /> : 
                                             user.checked_in && user.check_out_at ? <MinusCircle size={14} /> : 
                                             <MinusCircle size={14} />}
                                            {user.checked_in && !user.check_out_at ? 'Present' : 
                                             user.checked_in && user.check_out_at ? 'Checked Out' : 
                                             'Absent'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminAttendanceDashboard;