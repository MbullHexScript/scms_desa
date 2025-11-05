import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintDetail from './pages/AdminComplaintDetail';
import StatisticsPage from './pages/StatisticsPage';

type Page =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'create-complaint'
  | 'complaint-detail'
  | 'my-complaints'
  | 'settings'
  | 'admin-dashboard'
  | 'all-complaints'
  | 'admin-complaint-detail'
  | 'statistics'
  | 'users';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageData, setPageData] = useState<unknown>(null);

  const handleNavigate = (page: Page, data?: unknown) => {
    setCurrentPage(page);
    if (data) {
      setPageData(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
          <p className="text-gray-600 mt-4 text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return <RegisterPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} />;
    }
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (profile?.role === 'admin') {
    if (currentPage === 'admin-complaint-detail' && pageData) {
      return (
        <AdminComplaintDetail
          complaint={pageData as any}
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPage === 'statistics') {
      return <StatisticsPage onNavigate={handleNavigate} />;
    }
    if (currentPage === 'all-complaints') {
      return <AdminDashboard onNavigate={handleNavigate} />;
    }
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'create-complaint') {
    return <CreateComplaint onNavigate={handleNavigate} />;
  }
  if (currentPage === 'complaint-detail' && pageData) {
    return (
      <ComplaintDetail complaint={pageData as any} onNavigate={handleNavigate} />
    );
  }
  if (
    currentPage === 'my-complaints' ||
    currentPage === 'dashboard' ||
    currentPage === 'settings'
  ) {
    return <UserDashboard onNavigate={handleNavigate} />;
  }

  return <UserDashboard onNavigate={handleNavigate} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
