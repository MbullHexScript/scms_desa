import { FileText, Shield, BarChart3, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold text-gray-800">SCMS Desa Nambo Udik</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
              >
                Masuk
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sampaikan Aspirasi dan Keluhan Anda
            <span className="text-emerald-500"> Secara Online</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistem Pengaduan Masyarakat Desa Nambo Udik hadir untuk memudahkan warga
            dalam menyampaikan keluhan dan memantau penyelesaiannya secara transparan.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg rounded-xl font-semibold transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Laporkan Sekarang
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lapor Mudah
            </h3>
            <p className="text-gray-600">
              Isi form sederhana dengan upload foto sebagai bukti keluhan Anda
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aman & Terverifikasi
            </h3>
            <p className="text-gray-600">
              Setiap laporan diverifikasi dan ditangani oleh perangkat desa
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pantau Status
            </h3>
            <p className="text-gray-600">
              Lihat status laporan Anda real-time: Pending, Diproses, atau Selesai
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Komunikasi Langsung
            </h3>
            <p className="text-gray-600">
              Diskusi dengan admin terkait tindak lanjut laporan Anda
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Kategori Layanan Pengaduan
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700"><strong>Infrastruktur</strong> - Jalan rusak, jembatan, drainase</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700"><strong>Kebersihan</strong> - Sampah, lingkungan</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700"><strong>Keamanan</strong> - Penerangan, ketertiban</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700"><strong>Pelayanan Publik</strong> - Administrasi desa</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700"><strong>Sosial</strong> - Bantuan sosial, kegiatan</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-8 rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-4">Hubungi Kami</h3>
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-semibold mr-2">Alamat:</span>
                  Kantor Desa Nambo Udik, Kec. Cikande Modern, Kab. Serang
                </p>
                <p className="flex items-start">
                  <span className="font-semibold mr-2">Telepon:</span>
                  (021) 1234-5678
                </p>
                <p className="flex items-start">
                  <span className="font-semibold mr-2">WhatsApp:</span>
                  0812-3456-7890
                </p>
                <p className="flex items-start">
                  <span className="font-semibold mr-2">Email:</span>
                  admin@desanamboudik.id
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Pemerintah Desa Nambo Udik. Sistem Pengaduan Masyarakat.
          </p>
        </div>
      </footer>
    </div>
  );
}
