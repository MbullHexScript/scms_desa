import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userApi } from '../services/api';
import { Moon, Sun, Lock, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (loading) return;

    if (!user) {
      return;
    }

    fetchSettings();
  }, [user, loading]);

  const fetchSettings = async () => {
    try {
      const data = await userApi.getSettings(user!.id);
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleThemeChange = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    try {
      await userApi.updateSettings(user!.id, { theme: newTheme });
      setSuccess('Theme updated successfully');
    } catch (err) {
      setError('Failed to update theme');
    }
  };

  const handleNotificationChange = async (type: 'email' | 'sms') => {
    const newValue = !settings[`${type}_notifications`];

    try {
      await userApi.updateSettings(user!.id, {
        [`${type}_notifications`]: newValue
      });

      setSettings({
        ...settings,
        [`${type}_notifications`]: newValue
      });

      setSuccess('Notification settings updated');
    } catch (err) {
      setError('Failed to update notification settings');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      await userApi.changePassword(user!.id, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      setSuccess('Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to change password');
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 border-r dark:border-gray-700 p-4">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                  activeTab === 'general'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Security
              </button>
            </div>

            <div className="md:w-3/4 p-6">
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

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Appearance
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {theme === 'light' ? (
                          <Sun className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Moon className="h-5 w-5 text-indigo-400" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Dark Mode
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Currently: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleThemeChange}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Toggle
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Notification Preferences
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive email updates on complaint status
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('email')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings?.email_notifications
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings?.email_notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            SMS Notifications
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive SMS updates on complaint status
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('sms')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings?.sms_notifications
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings?.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Change Password
                  </h2>

                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({ ...passwords, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
