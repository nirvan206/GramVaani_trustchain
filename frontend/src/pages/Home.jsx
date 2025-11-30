import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe, TrendingUp, Users, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

function Home() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'Blockchain-powered security with complete transparency',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick loan approval and instant disbursement',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Available in 7+ Indian languages for accessibility',
    },
    {
      icon: TrendingUp,
      title: 'Build Reputation',
      description: 'Earn trust score with timely repayments',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Peer-to-peer lending for financial inclusion',
    },
    {
      icon: Lock,
      title: 'Privacy Protected',
      description: 'Your data is encrypted and secure',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-white mb-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">
            Financial Inclusion Through Blockchain
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            TrustChain brings transparent, secure, and accessible microfinance to rural India.
            Build your reputation, access loans, and grow your business.
          </p>
          <div className="flex space-x-4">
            <Link to="/apply-loan" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Apply for Loan
            </Link>
            <Link to="/dashboard" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600 mb-2">₹10L+</p>
          <p className="text-gray-600">Total Disbursed</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600 mb-2">500+</p>
          <p className="text-gray-600">Active Loans</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600 mb-2">95%</p>
          <p className="text-gray-600">Repayment Rate</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary-600 mb-2">1000+</p>
          <p className="text-gray-600">Verified Users</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Choose TrustChain?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <feature.icon className="text-primary-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="card bg-gradient-to-br from-primary-50 to-blue-50 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
            <p className="text-sm text-gray-600">Connect your wallet and complete KYC</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Apply</h3>
            <p className="text-sm text-gray-600">Submit loan application with details</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get Approved</h3>
            <p className="text-sm text-gray-600">Lenders review and approve your loan</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Repay</h3>
            <p className="text-sm text-gray-600">Make repayments and build trust score</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-primary-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6 text-primary-100">
          Join thousands of borrowers and lenders building a better financial future.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          Explore Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Home;
