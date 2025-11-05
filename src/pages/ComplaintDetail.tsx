import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  AlertCircle,
  Send,
  Clock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Complaint, CommentWithUser } from '../lib/types';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

interface ComplaintDetailProps {
  complaint: Complaint;
  onNavigate: (page: string) => void;
}

export default function ComplaintDetail({
  complaint: initialComplaint,
  onNavigate,
}: ComplaintDetailProps) {
  const { user, profile } = useAuth();
  const [complaint, setComplaint] = useState<Complaint>(initialComplaint);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
    fetchComments();

    const channel = supabase
      .channel(`complaint-${complaint.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `complaint_id=eq.${complaint.id}`,
        },
        () => {
          fetchComments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'complaints',
          filter: `id=eq.${complaint.id}`,
        },
        (payload) => {
          setComplaint(payload.new as Complaint);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [complaint.id]);

  const fetchComplaintDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', complaint.id)
        .single();

      if (error) throw error;
      setComplaint(data);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, users(*)')
        .eq('complaint_id', complaint.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data as CommentWithUser[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        complaint_id: complaint.id,
        user_id: user?.id!,
        message: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusTimeline = () => {
    const statuses = ['Pending', 'In Progress', 'Solved'];
    const currentIndex = statuses.indexOf(complaint.status);

    return (
      <div className="flex items-center justify-between mb-8">
        {statuses.map((status, index) => (
          <div key={status} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  index <= currentIndex ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                {status}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div
                className={`flex-1 h-1 -mx-2 ${
                  index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={profile?.role === 'admin' ? 'all-complaints' : 'my-complaints'}
        onNavigate={onNavigate}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() =>
            onNavigate(profile?.role === 'admin' ? 'all-complaints' : 'dashboard')
          }
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {complaint.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(complaint.created_at)}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {complaint.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          {getStatusTimeline()}

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Deskripsi Masalah
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {complaint.image_url && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Foto Bukti</h3>
              <img
                src={complaint.image_url}
                alt="Bukti laporan"
                className="w-full max-w-2xl rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Diskusi & Tanggapan
          </h2>

          {loading && comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">Belum ada komentar</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg ${
                    comment.users.role === 'admin'
                      ? 'bg-emerald-50 border-l-4 border-emerald-500'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        comment.users.role === 'admin'
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      } text-white font-semibold`}
                    >
                      {comment.users.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.users.full_name}
                        </span>
                        {comment.users.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-medium">
                            Admin
                          </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="mt-6">
            <div className="flex space-x-3">
              <div
                className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold flex-shrink-0"
              >
                {profile?.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition resize-none"
                  placeholder="Tulis tanggapan atau pertanyaan Anda..."
                  rows={3}
                  disabled={submitting}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Mengirim...' : 'Kirim'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
