import { Home, LogOut, LayoutDashboard, FileText, Settings, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { profile, signOut, isAdmin } = useAuth();

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
    <nav className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold">SCMS Desa Nambo Udik</h1>
                <p className="text-xs opacity-90">Sistem Pengaduan Masyarakat</p>
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
                      ? 'bg-white/20 font-semibold'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}

            <div className="flex items-center space-x-4 border-l border-white/30 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{profile?.full_name}</p>
                <p className="text-xs opacity-80">
                  {isAdmin ? 'Admin' : 'Warga'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
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
