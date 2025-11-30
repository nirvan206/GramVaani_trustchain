import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, TrendingUp, DollarSign, Clock, Plus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useDemoStore from '../store/useDemoStore';

function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  
  // Use demo data
  const demoLoans = useDemoStore((state) => state.demoLoans);
  const demoReputation = useDemoStore((state) => state.demoReputation);

  const loans = demoLoans;
  const reputation = demoReputation;
  const loansLoading = false;
  const repLoading = false;

  const stats = [
    {
      label: 'Total Loans',
      value: loans.length,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Loans',
      value: loans.filter((l) => l.status === 'active').length,
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      label: 'Trust Score',
      value: reputation.trustScore || '500',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Total Borrowed',
      value: `₹${loans.reduce((sum, l) => sum + l.amount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/apply-loan" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Apply for Loan</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Loans */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Loans</h2>
          <Link to="/loans" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>

        {loansLoading ? (
          <p className="text-center text-gray-500 py-8">Loading loans...</p>
        ) : loans.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No loans yet</p>
            <Link to="/apply-loan" className="btn-primary inline-block">
              Apply for Your First Loan
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Loan ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans.slice(0, 5).map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      #{loan.blockchainLoanId?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {loan.purpose}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : loan.status === 'approved' || loan.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : loan.status === 'repaid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/loans/${loan._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reputation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Reputation Score</h3>
          {repLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div>
              <div className="flex items-end space-x-2 mb-4">
                <span className="text-5xl font-bold text-primary-600">
                  {reputation.trustScore || '500'}
                </span>
                <span className="text-gray-500 mb-2">/ 1000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${((reputation.trustScore || 500) / 1000) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Loans</p>
                  <p className="font-semibold text-gray-900">
                    {reputation.totalLoans || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Successful</p>
                  <p className="font-semibold text-gray-900">
                    {reputation.successfulLoans || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">On-Time Payments</p>
                  <p className="font-semibold text-gray-900">
                    {reputation.onTimePayments || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Late Payments</p>
                  <p className="font-semibold text-gray-900">
                    {reputation.latePayments || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/apply-loan"
              className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-900">Apply for New Loan</p>
              <p className="text-sm text-gray-600">Get funds for your business</p>
            </Link>
            <Link
              to="/loans"
              className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-900">View All Loans</p>
              <p className="text-sm text-gray-600">Track your loan history</p>
            </Link>
            <Link
              to="/reputation"
              className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-900">Check Reputation</p>
              <p className="text-sm text-gray-600">View your trust score details</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
