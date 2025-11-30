import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, User, Clock, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import useDemoStore from '../store/useDemoStore';

function LoanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repaymentAmount, setRepaymentAmount] = useState('');

  // Use demo data
  const demoLoans = useDemoStore((state) => state.demoLoans);
  const updateDemoLoan = useDemoStore((state) => state.updateDemoLoan);
  
  const loan = demoLoans.find(l => l._id === id);
  const isLoading = false;

  const handleRepayment = () => {
    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Update demo loan with repayment
    const newRepaidAmount = loan.repaidAmount + parseFloat(repaymentAmount);
    const totalDue = loan.amount + (loan.amount * loan.interestRate) / 10000;
    
    updateDemoLoan(id, {
      repaidAmount: newRepaidAmount,
      status: newRepaidAmount >= totalDue ? 'repaid' : 'active'
    });
    
    toast.success('Repayment successful! (Demo mode)');
    setRepaymentAmount('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading loan details...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loan not found</p>
      </div>
    );
  }

  const totalDue = loan.amount + (loan.amount * loan.interestRate) / 100;
  const remainingAmount = totalDue - loan.repaidAmount;
  const repaymentProgress = (loan.repaidAmount / totalDue) * 100;
  
  // Calculate dates for timeline
  const createdDate = new Date(loan.createdAt);
  const dueDate = loan.dueDate ? new Date(loan.dueDate) : addDays(createdDate, loan.duration);
  const currentDate = new Date();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/loans')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Loans</span>
      </button>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Details</h1>
            <p className="text-gray-600 mt-1">
              ID: #{loan.blockchainLoanId?.slice(0, 16)}
            </p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              loan.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : loan.status === 'approved' || loan.status === 'active'
                ? 'bg-green-100 text-green-800'
                : loan.status === 'repaid'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {loan.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Summary */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{loan.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{loan.duration} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Due</p>
                <p className="text-2xl font-bold text-primary-600">
                  ₹{totalDue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Timeline</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
              
              {/* Timeline Items */}
              <div className="space-y-6">
                {/* Loan Created */}
                <div className="relative flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Loan Created</p>
                    <p className="text-sm text-gray-600">
                      {format(createdDate, 'MMMM dd, yyyy HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Application submitted and recorded on blockchain
                    </p>
                  </div>
                </div>

                {/* Current Time */}
                <div className="relative flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <Clock className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Current Time</p>
                    <p className="text-sm text-gray-600">
                      {format(currentDate, 'MMMM dd, yyyy HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Status: {loan.status.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="relative flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      loan.status === 'repaid' ? 'bg-green-500' : 
                      currentDate > dueDate ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      <Calendar className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Repayment Due</p>
                    <p className="text-sm text-gray-600">
                      {format(dueDate, 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {loan.status === 'repaid' ? 'Loan fully repaid ✓' : 
                       currentDate > dueDate ? 'Payment overdue!' : 
                       `${Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24))} days remaining`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Repayment Progress */}
          {(loan.status === 'active' || loan.status === 'repaid') && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Repayment Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Repaid</span>
                  <span className="font-semibold text-gray-900">
                    ₹{loan.repaidAmount.toLocaleString()} / ₹{totalDue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all"
                    style={{ width: `${repaymentProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {repaymentProgress.toFixed(1)}% completed
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-900">
                  <strong>Remaining Amount:</strong> ₹{remainingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Loan Details */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Purpose</p>
                <p className="font-semibold text-gray-900">{loan.purpose}</p>
              </div>
              {loan.collateral && (
                <div>
                  <p className="text-sm text-gray-600">Collateral</p>
                  <p className="font-semibold text-gray-900">{loan.collateral}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Created On</p>
                <p className="font-semibold text-gray-900">
                  {format(new Date(loan.createdAt), 'MMMM dd, yyyy HH:mm')}
                </p>
              </div>
              {loan.approvedAt && (
                <div>
                  <p className="text-sm text-gray-600">Approved On</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(loan.approvedAt), 'MMMM dd, yyyy HH:mm')}
                  </p>
                </div>
              )}
              {loan.dueDate && (
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(loan.dueDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Parties */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parties Involved</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Borrower</p>
                  <p className="font-semibold text-gray-900">{loan.borrower?.name}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {loan.borrower?.walletAddress}
                  </p>
                </div>
              </div>
              {loan.lender && (
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Lender</p>
                    <p className="font-semibold text-gray-900">{loan.lender?.name}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {loan.lender?.walletAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Make Repayment */}
          {(loan.status === 'active' || loan.status === 'approved') && (
            <div className="card mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Make Repayment</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Amount (₹)</label>
                  <input
                    type="number"
                    value={repaymentAmount}
                    onChange={(e) => setRepaymentAmount(e.target.value)}
                    className="input-field"
                    placeholder="Enter amount"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Remaining: ₹{remainingAmount.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleRepayment}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-primary-600" />
                <span className="text-gray-600">Interest: ₹{((loan.amount * loan.interestRate) / 100).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-primary-600" />
                <span className="text-gray-600">Duration: {loan.duration} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-primary-600" />
                <span className="text-gray-600">Rate: {loan.interestRate}% p.a.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanDetails;
