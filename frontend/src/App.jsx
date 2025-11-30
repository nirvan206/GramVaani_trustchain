import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import LoanDetails from './pages/LoanDetails';
import ApplyLoan from './pages/ApplyLoan';
import Reputation from './pages/Reputation';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import AboutUs from './pages/AboutUs';
import useAuthStore from './store/useAuthStore';

function App() {
  const { i18n } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="loans" element={<Loans />} />
        <Route path="loans/:id" element={<LoanDetails />} />
        <Route path="apply-loan" element={<ApplyLoan />} />
        <Route path="reputation" element={<Reputation />} />
        <Route path="savings" element={<Savings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
