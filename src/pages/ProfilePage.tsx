import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import { Mail, Phone, User, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return;
    }

    fetchProfile();
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      const data = await userApi.getProfile(user!.id);
      setProfile(data.user);
      setFormData({
        full_name: data.user.full_name,
        phone: data.user.phone || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userApi.updateProfile(user!.id, {
        full_name: formData.full_name,
        phone: formData.phone
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile');
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg">
                {success}
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.full_name}
                    </h2>
                    <div className="flex items-center mt-2 space-x-2">
                      <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Role: <span className="font-semibold capitalize">{profile?.role}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.email}
                        </p>
                      </div>
                    </div>

                    {profile?.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {profile.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
