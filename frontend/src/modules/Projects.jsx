import React, { useState, useMemo } from 'react';
import { ListChecks, Clock, CheckCircle, Loader, User, Calendar, Filter, ArrowUp, ArrowDown } from 'lucide-react';

// --- Demo Data ---
const initialProjects = [
    {
        id: 1,
        title: 'Q3 ERP System Integration',
        manager: 'Jane Smith',
        status: 'In Progress',
        progress: 65,
        dueDate: '2025-12-15',
        team: ['Alice', 'Bob', 'Charlie']
    },
    {
        id: 2,
        title: 'Mobile App V2 Launch',
        manager: 'Aarav Sharma',
        status: 'Pending',
        progress: 10,
        dueDate: '2026-02-01',
        team: ['Bob', 'Diana', 'Eve']
    },
    {
        id: 3,
        title: 'Website Redesign & SEO Audit',
        manager: 'Charlie Lee',
        status: 'Completed',
        progress: 100,
        dueDate: '2025-08-30',
        team: ['Jane', 'Frank']
    },
    {
        id: 4,
        title: 'New Employee Onboarding Flow',
        manager: 'Jane Smith',
        status: 'In Progress',
        progress: 40,
        dueDate: '2025-11-20',
        team: ['Grace', 'Henry']
    },
    {
        id: 5,
        title: 'Database Migration to Supabase',
        manager: 'Frank Johnson',
        status: 'In Progress',
        progress: 95,
        dueDate: '2025-11-05',
        team: ['Alice', 'Henry', 'Ivan']
    },
    {
        id: 6,
        title: 'Marketing Campaign: Diwali Offer',
        manager: 'Ivan Patel',
        status: 'Completed',
        progress: 100,
        dueDate: '2025-10-15',
        team: ['Frank', 'Charlie']
    },
    {
        id: 7,
        title: 'Annual Budget Planning 2026',
        manager: 'Grace Hopper',
        status: 'Pending',
        progress: 5,
        dueDate: '2025-12-31',
        team: ['Grace', 'Jane']
    },
    {
        id: 8,
        title: 'Cloud Infrastructure Upgrade',
        manager: 'Henry Ford',
        status: 'In Progress',
        progress: 75,
        dueDate: '2025-11-25',
        team: ['Aarav', 'Bob', 'Charlie']
    },
    {
        id: 9,
        title: 'Vendor Contract Review',
        manager: 'Aarav Sharma',
        status: 'Completed',
        progress: 100,
        dueDate: '2025-09-01',
        team: ['Grace']
    },
    {
        id: 10,
        title: 'Internal Knowledge Base Documentation',
        manager: 'Charlie Lee',
        status: 'In Progress',
        progress: 20,
        dueDate: '2026-01-15',
        team: ['All']
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'In Progress': return 'bg-blue-600/50 text-blue-300';
        case 'Completed': return 'bg-green-600/50 text-green-300';
        case 'Pending': return 'bg-yellow-600/50 text-yellow-300';
        default: return 'bg-gray-600/50 text-gray-300';
    }
};

const Projects = () => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' or 'progress'
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    // Memoized filtered and sorted projects
    const filteredAndSortedProjects = useMemo(() => {
        let filtered = initialProjects;

        // 1. Filtering by Status
        if (filterStatus !== 'All') {
            filtered = filtered.filter(p => p.status === filterStatus);
        }

        // 2. Filtering by Search Term
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.team.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // 3. Sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'dueDate') {
                const dateA = new Date(a.dueDate);
                const dateB = new Date(b.dueDate);
                comparison = dateA.getTime() - dateB.getTime();
            } else if (sortBy === 'progress') {
                comparison = a.progress - b.progress;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [filterStatus, searchTerm, sortBy, sortDirection]);

    // Calculate Summary Stats
    const totalProjects = initialProjects.length;
    const completedProjects = initialProjects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = initialProjects.filter(p => p.status === 'In Progress').length;
    const avgProgress = totalProjects > 0 ? (initialProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects).toFixed(0) : 0;

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortDirection('asc');
        }
    };
    
    // Progress Bar Component
    const ProgressBar = ({ progress }) => (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
            <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
    };

    return (
        <div className="p-4 md:p-6 space-y-6 text-white w-full pb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <ListChecks size={24} /> Project Overview
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow text-center">
                    <p className="text-gray-400">Total Projects</p>
                    <h3 className="text-2xl font-bold text-blue-400">{totalProjects}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow text-center">
                    <p className="text-gray-400">Completed</p>
                    <h3 className="text-2xl font-bold text-green-400">{completedProjects}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow text-center">
                    <p className="text-gray-400">In Progress</p>
                    <h3 className="text-2xl font-bold text-yellow-400">{inProgressProjects}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow text-center">
                    <p className="text-gray-400">Avg. Progress</p>
                    <h3 className="text-2xl font-bold text-purple-400">{avgProgress}%</h3>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-4 rounded-xl shadow space-y-4 md:space-y-0 md:flex md:gap-4 items-center">
                <div className="relative flex-1">
                    <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search project, manager, or team member..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 rounded-lg bg-gray-700 text-white w-full md:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="All">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            {/* Project List/Table */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-xl shadow overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4">
                    Project List ({filteredAndSortedProjects.length} found)
                </h3>
                
                {filteredAndSortedProjects.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No projects match the current criteria.</p>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-3">Project Title</th>
                                <th className="p-3 flex items-center cursor-pointer" onClick={() => handleSortChange('progress')}>
                                    Progress 
                                    <SortIcon column="progress" />
                                </th>
                                <th className="p-3">Manager</th>
                                <th className="p-3">Team</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 flex items-center cursor-pointer" onClick={() => handleSortChange('dueDate')}>
                                    Due Date 
                                    <SortIcon column="dueDate" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProjects.map((p) => (
                                <tr key={p.id} className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-3 font-semibold text-base max-w-xs">{p.title}</td>
                                    <td className="p-3 max-w-[150px]">
                                        <div className="text-sm mb-1">{p.progress}%</div>
                                        <ProgressBar progress={p.progress} />
                                    </td>
                                    <td className="p-3 text-sm flex items-center gap-1">
                                        <User size={14} className="text-blue-400" />
                                        {p.manager}
                                    </td>
                                    <td className="p-3 text-sm text-gray-300">
                                        {p.team.length > 3 ? `${p.team.slice(0, 3).join(', ')} +${p.team.length - 3}` : p.team.join(', ')}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm flex items-center gap-1">
                                        <Calendar size={14} className="text-gray-400" />
                                        {p.dueDate}
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

export default Projects;