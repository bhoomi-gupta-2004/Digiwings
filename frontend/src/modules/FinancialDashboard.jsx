import React from 'react';
import { IndianRupee, PieChart, Banknote } from 'lucide-react';

const FinancialDashboard = () => {
    // Dummy Data for demonstration
    const totalRevenue = 5200000;
    const totalExpenses = 1800000;
    const netProfit = totalRevenue - totalExpenses;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="p-4 md:p-6 space-y-6 text-white w-full pb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                Financial Overview 📈
            </h2>
            <p className="text-gray-400">This dashboard provides a real-time summary of company finances.</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow text-center">
                    <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3"><IndianRupee className="w-5 h-5 text-green-400" /></div>
                    <p className="text-gray-400">Total Revenue (YTD)</p>
                    <h3 className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow text-center">
                    <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-3"><Banknote className="w-5 h-5 text-red-400" /></div>
                    <p className="text-gray-400">Total Expenses (YTD)</p>
                    <h3 className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</h3>
                </div>
                <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow text-center">
                    <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3"><PieChart className="w-5 h-5 text-blue-400" /></div>
                    <p className="text-gray-400">Net Profit</p>
                    <h3 className="text-2xl font-bold text-blue-400">{formatCurrency(netProfit)}</h3>
                </div>
            </div>

            {/* Detailed Financial Reporting (Placeholder for complex charts/data) */}
            <div className="bg-black/15 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Reports and Forecasting</h3>
                <p className="text-gray-400">Integrate a chart library (like Chart.js or Recharts) here to display monthly income/expense trends and budget vs. actuals.</p>
                <div className="h-64 mt-4 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                    
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;