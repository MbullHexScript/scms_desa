import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface StatisticsPageProps {
  onNavigate: (page: string) => void;
}

interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

interface StatusStats {
  status: string;
  count: number;
}

interface PriorityStats {
  priority: string;
  count: number;
}

export default function StatisticsPage({ onNavigate }: StatisticsPageProps) {
  const [loading, setLoading] = useState(true);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [priorityStats, setPriorityStats] = useState<PriorityStats[]>([]);
  const [resolutionRate, setResolutionRate] = useState(0);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data: complaints, error } = await supabase
        .from('complaints')
        .select('category, status, priority');

      if (error) throw error;

      const total = complaints.length;
      setTotalComplaints(total);

      const categoryCount: Record<string, number> = {};
      const statusCount: Record<string, number> = {};
      const priorityCount: Record<string, number> = {};

      complaints.forEach((complaint) => {
        categoryCount[complaint.category] =
          (categoryCount[complaint.category] || 0) + 1;
        statusCount[complaint.status] = (statusCount[complaint.status] || 0) + 1;
        priorityCount[complaint.priority] =
          (priorityCount[complaint.priority] || 0) + 1;
      });

      const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
        percentage: (count / total) * 100,
      }));

      const statusData = Object.entries(statusCount).map(([status, count]) => ({
        status,
        count,
      }));

      const priorityData = Object.entries(priorityCount).map(([priority, count]) => ({
        priority,
        count,
      }));

      setCategoryStats(categoryData);
      setStatusStats(statusData);
      setPriorityStats(priorityData);

      const solved = statusCount['Solved'] || 0;
      setResolutionRate(total > 0 ? (solved / total) * 100 : 0);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
    ];
    return colors[index % colors.length];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-500';
      case 'In Progress':
        return 'bg-orange-500';
      case 'Solved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-500';
      case 'Sedang':
        return 'bg-yellow-500';
      case 'Rendah':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleExportPDF = () => {
    alert('Fitur export PDF akan segera tersedia!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="statistics" onNavigate={onNavigate} />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="statistics" onNavigate={onNavigate} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistik & Laporan</h1>
            <p className="text-gray-600 mt-2">
              Analisis data pengaduan masyarakat
            </p>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-md"
          >
            <Download className="h-5 w-5" />
            <span>Cetak PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Laporan</p>
            <p className="text-4xl font-bold text-gray-900">{totalComplaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Tingkat Penyelesaian
            </p>
            <p className="text-4xl font-bold text-gray-900">
              {resolutionRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Kategori Aktif</p>
            <p className="text-4xl font-bold text-gray-900">
              {categoryStats.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Laporan per Kategori
            </h2>
            <div className="space-y-4">
              {categoryStats.map((stat, index) => (
                <div key={stat.category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {stat.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stat.count} ({stat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getCategoryColor(index)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Status Laporan
            </h2>
            <div className="space-y-4">
              {statusStats.map((stat) => {
                const percentage =
                  totalComplaints > 0 ? (stat.count / totalComplaints) * 100 : 0;
                return (
                  <div key={stat.status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {stat.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {stat.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${getStatusColor(stat.status)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Tingkat Prioritas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priorityStats.map((stat) => {
              const percentage =
                totalComplaints > 0 ? (stat.count / totalComplaints) * 100 : 0;
              return (
                <div key={stat.priority} className="text-center">
                  <div
                    className={`${getPriorityColor(stat.priority)} text-white rounded-lg p-6 mb-3`}
                  >
                    <p className="text-4xl font-bold">{stat.count}</p>
                    <p className="text-sm mt-2 opacity-90">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">{stat.priority}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-md p-8 mt-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ringkasan</h3>
              <div className="space-y-2">
                <p className="text-emerald-50">
                  Total {totalComplaints} laporan telah diterima dari masyarakat
                </p>
                <p className="text-emerald-50">
                  {statusStats.find((s) => s.status === 'Solved')?.count || 0}{' '}
                  laporan telah diselesaikan ({resolutionRate.toFixed(1)}%)
                </p>
                <p className="text-emerald-50">
                  {statusStats.find((s) => s.status === 'In Progress')?.count || 0}{' '}
                  laporan sedang dalam proses penanganan
                </p>
                <p className="text-emerald-50">
                  {statusStats.find((s) => s.status === 'Pending')?.count || 0}{' '}
                  laporan menunggu verifikasi
                </p>
              </div>
            </div>
            <TrendingUp className="h-16 w-16 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
