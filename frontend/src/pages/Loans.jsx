import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import useDemoStore from '../store/useDemoStore';

function Loans() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Use demo data
  const demoLoans = useDemoStore((state) => state.demoLoans);
  const isLoading = false;

  const allLoans = statusFilter === 'all' 
    ? demoLoans 
    : demoLoans.filter(loan => loan.status === statusFilter);

  const filteredLoans = allLoans.filter((loan) =>
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.blockchainLoanId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
        <p className="text-gray-600 mt-2">View and manage all your loans</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by purpose or loan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="repaid">Repaid</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="card">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading loans...</p>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No loans found</p>
            <Link to="/apply-loan" className="btn-primary inline-block">
              Apply for a Loan
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
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">
                      #{loan.blockchainLoanId?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      ₹{loan.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {loan.purpose}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {loan.duration} days
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
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(new Date(loan.createdAt), 'MMM dd, yyyy')}
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
    </div>
  );
}

export default Loans;
