import React from 'react';
import { BarChart3, UserCheck, TrendingUp, Zap, ThumbsUp, Filter, Target, MessageSquare, Clock } from 'lucide-react';

// --- Demo Data (Focused on a single employee) ---
const employeeData = {
    employee: 'John Doe',
    role: 'Senior Developer',
    reviewPeriod: 'Q3 2025',
    overallScore: 4.5, // Out of 5.0
    status: 'Excellent',
    manager: 'Jane Smith',
    keyMetrics: {
        completionRate: 95, // %
        taskEfficiency: 90, // %
        bugFixRatio: 98, // %
        codeReviewScore: 4.3
    },
    skillAssessment: [
        { skill: 'Technical Depth', score: 5 },
        { skill: 'Team Collaboration', score: 4 },
        { skill: 'Problem Solving', score: 5 },
        { skill: 'Time Management', score: 4 },
        { skill: 'Communication', score: 3 },
    ]
};

const getStatusColor = (score) => {
    if (score >= 4.0) return 'text-green-400 bg-green-900/50';
    if (score >= 3.0) return 'text-yellow-400 bg-yellow-900/50';
    return 'text-red-400 bg-red-900/50';
};

// --- Custom Chart Component: Bar Chart (Quantitative Metrics) ---
const MetricBar = ({ label, value, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
            <span>{label}</span>
            <span className={`font-semibold ${color}`}>{value}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
                className={`h-3 rounded-full transition-all duration-700`} 
                style={{ width: `${value}%`, backgroundColor: color }}
            ></div>
        </div>
    </div>
);

// --- Custom Chart Component: Radar Chart (Qualitative Skills) ---
// This is a simplified, decorative SVG simulation of a Radar Chart
const RadarChart = ({ data }) => {
    // Scores are 1-5, normalized to 20-100% radius
    const points = data.map((item, index) => {
        const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
        const normalizedScore = item.score * 20; // Scale 1-5 to 20-100
        const radius = normalizedScore * 0.7; // Scale to fit SVG (max radius 70)
        return `${75 + radius * Math.cos(angle)}, ${75 + radius * Math.sin(angle)}`;
    }).join(' ');

    return (
        <div className="relative w-full h-full p-4">
            <svg viewBox="0 0 150 150" className="w-full h-full">
                {/* Background Web (Simplified) */}
                <circle cx="75" cy="75" r="70" fill="transparent" stroke="#374151" strokeWidth="0.5" />
                <circle cx="75" cy="75" r="56" fill="transparent" stroke="#374151" strokeWidth="0.5" />
                <circle cx="75" cy="75" r="42" fill="transparent" stroke="#374151" strokeWidth="0.5" />
                <circle cx="75" cy="75" r="28" fill="transparent" stroke="#374151" strokeWidth="0.5" />
                
                {/* Data Polygon */}
                <polygon 
                    points={points} 
                    fill="rgba(59, 130, 246, 0.3)" 
                    stroke="#3B82F6" 
                    strokeWidth="1.5"
                />

                {/* Axis Labels */}
                {data.map((item, index) => {
                    const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
                    const x = 75 + 80 * Math.cos(angle);
                    const y = 75 + 80 * Math.sin(angle);
                    return (
                        <text key={index} x={x} y={y} fill="#9CA3AF" fontSize="7" textAnchor="middle" dy=".3em">
                            {item.skill}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};


const Performance = () => {

    const { employee, role, reviewPeriod, overallScore, manager, keyMetrics, skillAssessment } = employeeData;

    const scoreStyle = getStatusColor(overallScore);

    return (
        <div className="p-4 md:p-8 space-y-8 text-white w-full pb-10">
            {/* Header and Employee Info */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-700 pb-4">
                <div className="space-y-1">
                    <p className="text-gray-400 text-sm">Detailed Performance Review</p>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <UserCheck size={28} className="text-blue-400" />
                        {employee}
                    </h1>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <p className="font-semibold text-lg">{role}</p>
                    <p className="text-gray-400">Review Manager: {manager}</p>
                    <p className="text-gray-400">Period: {reviewPeriod}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
                    <Target size={24} className="text-blue-400 mb-2" />
                    <p className="text-gray-400 text-sm">Overall Score (5.0)</p>
                    <h3 className={`text-3xl font-extrabold ${scoreStyle}`}>
                        {overallScore}
                    </h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
                    <TrendingUp size={24} className="text-green-400 mb-2" />
                    <p className="text-gray-400 text-sm">Status</p>
                    <h3 className="text-xl font-bold text-green-400">
                        {employeeData.status}
                    </h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
                    <Zap size={24} className="text-yellow-400 mb-2" />
                    <p className="text-gray-400 text-sm">Efficiency</p>
                    <h3 className="text-xl font-bold text-yellow-400">
                        {keyMetrics.taskEfficiency}%
                    </h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
                    <Clock size={24} className="text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">Next Check-in</p>
                    <h3 className="text-xl font-bold text-gray-300">
                        Jan 15, 2026
                    </h3>
                </div>
            </div>

            {/* Charts Section: Quantitative vs. Qualitative */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
                
                {/* 1. Quantitative Metrics (Bar Chart Area) */}
                <div className="lg:col-span-2 bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-xl shadow space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-300">
                        <BarChart3 size={20} /> Project & Task Metrics
                    </h3>
                    <div className="space-y-5">
                        <MetricBar 
                            label="Task Completion Rate" 
                            value={keyMetrics.completionRate} 
                            color="#10B981" 
                        />
                        <MetricBar 
                            label="Task Efficiency Score" 
                            value={keyMetrics.taskEfficiency} 
                            color="#F59E0B" 
                        />
                        <MetricBar 
                            label="Bug Fix Ratio (Defect Density)" 
                            value={keyMetrics.bugFixRatio} 
                            color="#EF4444" 
                        />
                    </div>

                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <p className="text-sm font-medium text-gray-400">Code Review Score (Average)</p>
                        <p className="text-2xl font-bold text-blue-400">{keyMetrics.codeReviewScore}</p>
                        <p className="text-xs text-gray-500 mt-1">Based on peer and lead reviews over the last quarter.</p>
                    </div>
                </div>

                {/* 2. Qualitative Skills (Radar Chart Area) */}
                <div className="lg:col-span-1 bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-xl shadow space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-300">
                        <MessageSquare size={20} /> Core Skill Assessment
                    </h3>
                    <div className="h-64">
                        <RadarChart data={skillAssessment} />
                    </div>
                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-700">
                        <p>Scores are based on 360-degree feedback (Scale: 1 - Low, 5 - High).</p>
                    </div>
                </div>
            </div>
            
            {/* Development and Comments Section (Placeholder) */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-xl shadow space-y-4">
                <h3 className="text-xl font-semibold text-orange-300">
                    Growth and Development
                </h3>
                <div className="text-gray-300 space-y-3">
                    <p><strong>Strengths:</strong> Exceptional technical depth and high-quality code delivery. Highly reliable in critical path projects.</p>
                    <p><strong>Areas for Improvement:</strong> Needs development in cross-functional communication; sometimes blocks collaboration awaiting perfection.</p>
                    <p className="text-sm text-gray-400 italic mt-2">-- Manager Comment: Alice has been enrolled in the "Effective Cross-Team Communication" course next quarter.</p>
                </div>
            </div>
        </div>
    );
};

export default Performance;