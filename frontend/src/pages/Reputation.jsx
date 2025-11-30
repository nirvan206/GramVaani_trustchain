import { TrendingUp, Award, CheckCircle, Clock, AlertCircle, Star } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useDemoStore from '../store/useDemoStore';

function Reputation() {
  const user = useAuthStore((state) => state.user);
  
  // Use demo data
  const demoReputation = useDemoStore((state) => state.demoReputation);
  const isLoading = false;

  const reputation = demoReputation;
  const trustScore = parseInt(reputation.trustScore) || 500;

  // Convert score (0-1000) to stars (0-5)
  const getStarRating = (score) => {
    return (score / 1000) * 5;
  };

  const starRating = getStarRating(trustScore);
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;

  const renderStars = () => {
    const stars = [];
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          size={48} 
          className="text-yellow-400 fill-yellow-400" 
        />
      );
    }
    
    // Half star
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star size={48} className="text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={48} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          size={48} 
          className="text-gray-300" 
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trust Score</h1>
        <p className="text-gray-600 mt-2">
          Your trust score is calculated based on your loan history and repayment behavior
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reputation data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trust Score Card */}
          <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <div className="text-center">
              <p className="text-primary-100 mb-4 text-lg">Your Trust Score</p>
              <div className="flex items-center justify-center space-x-3 mb-6">
                <span className="text-6xl font-bold text-white">
                  {trustScore}
                </span>
                <span className="text-2xl text-primary-100">/ 1000</span>
              </div>
              
              {/* Star Rating */}
              <div className="flex items-center justify-center space-x-2 mb-3">
                {renderStars()}
              </div>
              <p className="text-2xl font-semibold text-white">
                {starRating.toFixed(1)} out of 5 stars
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="text-blue-600" size={24} />
                <p className="text-sm text-gray-600">Total Loans</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {reputation.totalLoans || 0}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <p className="text-sm text-gray-600">Successful Loans</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {reputation.successfulLoans || 0}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="text-purple-600" size={24} />
                <p className="text-sm text-gray-600">On-Time Payments</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {reputation.onTimePayments || 0}
              </p>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="text-orange-600" size={24} />
                <p className="text-sm text-gray-600">Late Payments</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {reputation.latePayments || 0}
              </p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{parseFloat(reputation.totalBorrowed || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Repaid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{parseFloat(reputation.totalRepaid || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Defaulted Loans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reputation.defaultedLoans || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Repayment Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reputation.totalBorrowed > 0
                    ? ((reputation.totalRepaid / reputation.totalBorrowed) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* How to Improve */}
          <div className="card bg-blue-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              How to Improve Your Trust Score
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Make Timely Repayments</p>
                  <p className="text-sm text-gray-600">
                    Pay your loan installments on or before the due date
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Complete KYC Verification</p>
                  <p className="text-sm text-gray-600">
                    Verified users get a trust score boost
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Successfully Repay Loans</p>
                  <p className="text-sm text-gray-600">
                    Each successfully completed loan improves your score
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Avoid Defaults</p>
                  <p className="text-sm text-gray-600">
                    Defaulting on loans significantly reduces your trust score
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Verification Status */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Status</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {user?.kycStatus === 'verified' ? (
                  <>
                    <CheckCircle className="text-green-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">KYC Verified</p>
                      <p className="text-sm text-gray-600">Your account is fully verified</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-yellow-600" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">KYC Pending</p>
                      <p className="text-sm text-gray-600">Complete KYC to unlock full features</p>
                    </div>
                  </>
                )}
              </div>
              {user?.kycStatus !== 'verified' && (
                <button className="btn-primary">Complete KYC</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reputation;
