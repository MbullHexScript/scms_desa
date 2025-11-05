import { Home, LogOut, LayoutDashboard, FileText, Settings, BarChart3, Users, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, signOut, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const userMenuItems = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'my-complaints', label: 'Laporan Saya', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'all-complaints', label: 'Semua Laporan', icon: FileText },
    { id: 'statistics', label: 'Statistik', icon: BarChart3 },
    { id: 'users', label: 'Data Warga', icon: Users },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-lg font-bold">SCMS Desa Nambo Udik</h1>
                <p className="text-xs opacity-70 dark:opacity-60">Sistem Pengaduan Masyarakat</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}

            <div className="flex items-center space-x-4 border-l dark:border-gray-700 pl-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{user?.full_name}</span>
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
