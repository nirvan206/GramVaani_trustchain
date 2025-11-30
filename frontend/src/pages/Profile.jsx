import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Globe, Shield, Star, TrendingUp, BadgeCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useDemoStore from '../store/useDemoStore';
import api from '../utils/api';

function Profile() {
  const { user, updateUser } = useAuthStore();
  const demoReputation = useDemoStore((state) => state.demoReputation);
  const [editing, setEditing] = useState(false);
  
  const trustScore = parseInt(demoReputation.trustScore) || 500;
  
  // Convert score to stars
  const getStarRating = (score) => {
    return (score / 1000) * 5;
  };
  
  const starRating = getStarRating(trustScore);
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={20} className="text-yellow-400 fill-yellow-400" />
      );
    }
    
    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star size={20} className="text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={20} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={20} className="text-gray-300" />
      );
    }
    
    return stars;
  };
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: user?.language || 'en',
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
            <p className="text-sm text-gray-600 mb-4">{user?.role}</p>
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center space-x-2 bg-green-50 border-2 border-green-500 rounded-full px-4 py-2">
                <BadgeCheck className="text-green-600" size={24} />
                <span className="text-sm font-bold text-green-700">Verified User</span>
              </div>
            </div>
          </div>

          {/* Trust Score */}
          <div className="card mt-6">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="text-primary-600" size={24} />
              <h3 className="font-bold text-gray-900">Trust Score</h3>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">
                {trustScore}
              </p>
              <p className="text-sm text-gray-600 mb-3">out of 1000</p>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {renderStars()}
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {starRating.toFixed(1)} / 5 stars
              </p>
            </div>
          </div>

          {/* KYC Status */}
          <div className="card mt-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="text-primary-600" size={24} />
              <h3 className="font-bold text-gray-900">KYC Status</h3>
            </div>
            <div
              className={`p-3 rounded-lg ${
                user?.kycStatus === 'verified'
                  ? 'bg-green-50'
                  : user?.kycStatus === 'pending'
                  ? 'bg-yellow-50'
                  : 'bg-red-50'
              }`}
            >
              <p
                className={`font-semibold ${
                  user?.kycStatus === 'verified'
                    ? 'text-green-800'
                    : user?.kycStatus === 'pending'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}
              >
                {user?.kycStatus === 'verified'
                  ? '✓ Verified'
                  : user?.kycStatus === 'pending'
                  ? '⏳ Pending'
                  : '✗ Not Verified'}
              </p>
            </div>
            {user?.kycStatus !== 'verified' && (
              <button className="w-full btn-primary mt-4">Complete KYC</button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="label flex items-center space-x-2">
                  <User size={18} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  disabled={!editing}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label flex items-center space-x-2">
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input-field"
                  disabled={!editing}
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="label flex items-center space-x-2">
                  <Phone size={18} />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  disabled={!editing}
                  placeholder="+91 1234567890"
                />
              </div>

              {/* Language */}
              <div>
                <label className="label flex items-center space-x-2">
                  <Globe size={18} />
                  <span>Preferred Language</span>
                </label>
                <select {...register('language')} className="input-field" disabled={!editing}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              {editing && (
                <button type="submit" className="w-full btn-primary">
                  Save Changes
                </button>
              )}
            </form>
          </div>

          {/* Account Info */}
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Account Type</span>
                <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Last Login</span>
                <span className="font-semibold text-gray-900">
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Account Status</span>
                <span className="font-semibold text-green-600">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
