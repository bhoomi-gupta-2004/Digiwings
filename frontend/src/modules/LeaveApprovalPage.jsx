import React, { useState, useEffect } from 'react';
import { Check, X, Filter, Calendar, FileText } from 'lucide-react';

// Centralize API URL
const API_BASE_URL = 'http://localhost:3000/api/leaves/admin';

const LeaveApprovalPage = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        from: '', to: '', employeeId: '', status: 'PENDING'
    });
    const [error, setError] = useState(null);

    const fetchLeaveRequests = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return;

        // Construct query parameters
        const queryParams = new URLSearchParams(filters).toString();
        
        try {
            const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to fetch leave requests.");
            }
            
            const data = await response.json();
            setLeaveRequests(data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce filter changes for a smoother experience
        const handler = setTimeout(() => {
            fetchLeaveRequests();
        }, 300);

        return () => clearTimeout(handler);
    }, [filters]); 

    const handleUpdateStatus = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to ${status.toLowerCase()} request.`);
            }
            
            // Remove the approved/rejected item and refetch the list
            // setLeaveRequests(prev => prev.filter(req => req.id !== id));
            fetchLeaveRequests(); // Refetch to show updated list immediately

        } catch (error) {
            console.error("Error updating status:", error);
            alert(`Action Failed: ${error.message}`);
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US') : 'N/A';

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-400 bg-yellow-900/50';
            case 'APPROVED': return 'text-green-400 bg-green-900/50';
            case 'REJECTED': return 'text-red-400 bg-red-900/50';
            default: return 'text-gray-400 bg-gray-700/50';
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 text-white w-full pb-8">
            <h2 className="text-2xl font-bold mb-4">Leave Approval Management 📄</h2>
            
            {/* Filter Section */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4 items-center">
                <input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters({...filters, from: e.target.value})}
                    placeholder="From Date"
                    className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
                />
                <input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters({...filters, to: e.target.value})}
                    placeholder="To Date"
                    className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
                />
                <input
                    type="text"
                    value={filters.employeeId}
                    onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                    placeholder="Employee ID"
                    className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="p-2 rounded bg-gray-700 text-white w-full md:w-auto"
                >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {error && <p className="text-red-400 p-4 bg-red-900/30 rounded">{error}</p>}

            {/* Leave Requests Table */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    {filters.status} Requests ({leaveRequests.length})
                </h3>
                {loading ? (
                    <p className="text-center text-gray-400">Loading leave requests...</p>
                ) : leaveRequests.length === 0 ? (
                    <p className="text-center text-gray-400">No {filters.status.toLowerCase()} leave requests found.</p>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-2">Name / ID</th>
                                <th className="p-2">Dates</th>
                                <th className="p-2">Reason</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Applied On</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((req) => (
                                <tr key={req.id} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-2">
                                        <p className="font-semibold">{req.employee_name}</p>
                                        <p className="text-sm text-gray-400">{req.employee_id}</p>
                                    </td>
                                    <td className="p-2">
                                        {formatDate(req.start_date)} to {formatDate(req.end_date)}
                                    </td>
                                    <td className="p-2 max-w-xs truncate text-sm">
                                        {req.reason}
                                    </td>
                                    <td className="p-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-2 text-sm text-gray-400">
                                        {formatDate(req.created_at)}
                                    </td>
                                    <td className="p-2">
                                        {req.status === 'PENDING' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                    className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
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

export default LeaveApprovalPage;