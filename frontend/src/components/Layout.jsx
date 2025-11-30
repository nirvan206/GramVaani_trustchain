import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, TrendingUp, User, LogOut, Menu, X, Globe, PiggyBank, Info } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { formatAddress } from '../utils/web3';

function Layout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('about'), href: '/about', icon: Info },
    { name: t('loans'), href: '/loans', icon: FileText },
    { name: t('savings'), href: '/savings', icon: PiggyBank },
    { name: t('trustScore'), href: '/reputation', icon: TrendingUp },
    { name: t('profile'), href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">GV</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t('siteName')}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative language-dropdown">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <Globe size={18} />
                  <span className="text-sm">{i18n.language.toUpperCase()}</span>
                </button>
                <div className="language-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden z-10 max-h-96 overflow-y-auto">
                  <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    English
                  </button>
                  <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    हिन्दी (Hindi)
                  </button>
                  <button onClick={() => changeLanguage('bn')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    বাংলা (Bengali)
                  </button>
                  <button onClick={() => changeLanguage('mr')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    मराठी (Marathi)
                  </button>
                  <button onClick={() => changeLanguage('te')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    తెలుగు (Telugu)
                  </button>
                  <button onClick={() => changeLanguage('ta')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    தமிழ் (Tamil)
                  </button>
                  <button onClick={() => changeLanguage('gu')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    ગુજરાતી (Gujarati)
                  </button>
                  <button onClick={() => changeLanguage('ur')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    اردو (Urdu)
                  </button>
                  <button onClick={() => changeLanguage('kn')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    ಕನ್ನಡ (Kannada)
                  </button>
                  <button onClick={() => changeLanguage('or')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    ଓଡ଼ିଆ (Odia)
                  </button>
                  <button onClick={() => changeLanguage('ml')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    മലയാളം (Malayalam)
                  </button>
                  <button onClick={() => changeLanguage('pa')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    ਪੰਜਾਬੀ (Punjabi)
                  </button>
                  <button onClick={() => changeLanguage('as')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                    অসমীয়া (Assamese)
                  </button>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {user.walletAddress ? formatAddress(user.walletAddress) : 
                       user.phone ? user.phone :
                       user.aadhar ? `****${user.aadhar.slice(-4)}` :
                       user.pan ? user.pan : 'User'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                    title={t('logout')}
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 py-2"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 py-2 w-full"
                >
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 GramVaani. Built for financial inclusion in rural India.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
