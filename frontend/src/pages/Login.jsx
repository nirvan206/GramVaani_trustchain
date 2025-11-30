import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Wallet, Phone, CreditCard, FileText, Fingerprint } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';
import { connectWallet } from '../utils/web3';

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile', 'aadhar', 'pan'
  const [formData, setFormData] = useState({
    mobile: '',
    aadhar: '',
    pan: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate input based on login method
      let authData = {};
      
      if (loginMethod === 'mobile') {
        if (!formData.mobile || formData.mobile.length !== 10) {
          toast.error('Please enter a valid 10-digit mobile number');
          return;
        }
        authData = { mobile: formData.mobile, loginMethod: 'mobile' };
      } else if (loginMethod === 'aadhar') {
        if (!formData.aadhar || formData.aadhar.length !== 12) {
          toast.error('Please enter a valid 12-digit Aadhar number');
          return;
        }
        authData = { aadhar: formData.aadhar, loginMethod: 'aadhar' };
      } else if (loginMethod === 'pan') {
        if (!formData.pan || formData.pan.length !== 10) {
          toast.error('Please enter a valid 10-character PAN number');
          return;
        }
        authData = { pan: formData.pan.toUpperCase(), loginMethod: 'pan' };
      }

      // For demo purposes, accept any valid input and create a demo user
      // In production, this would call the actual API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create demo user based on login method
      const demoUser = {
        id: 'demo123',
        name: 'Demo User',
        email: 'demo@trustchain.io',
        role: 'borrower',
        kycStatus: 'verified',
        language: 'en',
        isActive: true,
        createdAt: '2024-01-10T10:30:00.000Z',
        lastLogin: new Date().toISOString()
      };

      if (loginMethod === 'mobile') {
        demoUser.phone = formData.mobile;
        demoUser.loginMethod = 'mobile';
      } else if (loginMethod === 'aadhar') {
        demoUser.aadhar = formData.aadhar;
        demoUser.loginMethod = 'aadhar';
      } else if (loginMethod === 'pan') {
        demoUser.pan = formData.pan.toUpperCase();
        demoUser.loginMethod = 'pan';
      }

      setAuth(demoUser, 'demo-token-12345');
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication is not supported in this browser');
      }

      // Check if we have credentials stored
      const hasCredentials = await navigator.credentials.isConditionalMediationAvailable();
      if (!hasCredentials) {
        throw new Error('No biometric credentials found. Please register first.');
      }

      // For demo purposes, simulate a successful biometric authentication
      // In a real app, you would use the Web Authentication API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create demo user
      const demoUser = {
        id: 'demo123',
        name: 'Demo User',
        email: 'demo@trustchain.io',
        phone: '+91 9876543210',
        role: 'borrower',
        kycStatus: 'verified',
        language: 'en',
        isActive: true,
        loginMethod: 'biometric',
        createdAt: '2024-01-10T10:30:00.000Z',
        lastLogin: new Date().toISOString()
      };

      setAuth(demoUser, 'demo-token-12345');
      toast.success('Biometric authentication successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Biometric login error:', error);
      toast.error(error.message || 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    try {
      setLoading(true);

      // Connect wallet
      const { address } = await connectWallet();
      toast.info('Wallet connected!');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create demo user with wallet address
      const demoUser = {
        id: 'demo123',
        walletAddress: address,
        name: 'Demo User',
        email: 'demo@trustchain.io',
        phone: '+91 9876543210',
        role: 'borrower',
        kycStatus: 'verified',
        language: 'en',
        isActive: true,
        loginMethod: 'wallet',
        createdAt: '2024-01-10T10:30:00.000Z',
        lastLogin: new Date().toISOString()
      };

      setAuth(demoUser, 'demo-token-12345');
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">TC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome')}
          </h1>
          <p className="text-gray-600">
            Blockchain-based microfinance for rural India
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('login')}
          </h2>

          {/* Login Method Tabs */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'mobile'
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone size={18} />
              <span className="font-medium">Mobile</span>
            </button>
            <button
              onClick={() => setLoginMethod('aadhar')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'aadhar'
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard size={18} />
              <span className="font-medium">Aadhar</span>
            </button>
            <button
              onClick={() => setLoginMethod('pan')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                loginMethod === 'pan'
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={18} />
              <span className="font-medium">PAN</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'mobile' && (
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {loginMethod === 'aadhar' && (
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="aadhar"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {loginMethod === 'pan' && (
              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="pan"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    placeholder="Enter 10-character PAN (e.g., ABCDE1234F)"
                    maxLength="10"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Wallet Login */}
          <button
            onClick={handleWalletLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <Wallet size={20} />
            <span className="font-medium">{loading ? t('loading') : 'Connect Wallet'}</span>
          </button>

          {/* Biometric Login */}
          <button
            onClick={handleBiometricLogin}
            disabled={loading || !(window.PublicKeyCredential && navigator.credentials)}
            title={window.PublicKeyCredential && navigator.credentials ? "Login with Biometrics" : "Biometric login not supported in this browser"}
            className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Fingerprint size={20} />
            <span className="font-medium">{loading ? t('loading') : 'Login with Biometrics'}</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                {t('register')}
              </Link>
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Login with your Mobile Number, Aadhar Card, or PAN Card. Use Wallet login for blockchain features or Biometric login for quick access.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600">🔒</p>
            <p className="text-xs text-gray-600 mt-1">Secure</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600">⚡</p>
            <p className="text-xs text-gray-600 mt-1">Fast</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600">🌐</p>
            <p className="text-xs text-gray-600 mt-1">Transparent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
