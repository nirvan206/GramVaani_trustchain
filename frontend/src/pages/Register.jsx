import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Wallet } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';
import { connectWallet } from '../utils/web3';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      toast.success('Wallet connected!');
    } catch (error) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const onSubmit = async (data) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        ...data,
        walletAddress,
      });

      if (response.data.success) {
        setAuth(response.data.user, response.data.token);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">TC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join TrustChain
          </h1>
          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('register')}
          </h2>

          {/* Connect Wallet */}
          {!walletAddress ? (
            <button
              onClick={handleConnectWallet}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3 text-lg mb-6"
            >
              <Wallet size={24} />
              <span>{t('connectWallet')}</span>
            </button>
          ) : (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Wallet Connected:</strong>
              </p>
              <p className="text-xs text-green-600 mt-1 font-mono break-all">
                {walletAddress}
              </p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">{t('name')}</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email (Optional)</label>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="label">Phone (Optional)</label>
              <input
                type="tel"
                {...register('phone')}
                className="input-field"
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label className="label">Language</label>
              <select {...register('language')} className="input-field">
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !walletAddress}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
