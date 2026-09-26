import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  Calendar,
  AlertTriangle,
  Sparkles,
  Tag,
} from 'lucide-react';

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    isPinned: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/communication/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data.announcements || []);
      }
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) {
      toast.error('Please enter title and content');
      return;
    }

    try {
      const res = await api.post('/communication/announcements', newNotice);
      if (res.data.success) {
        toast.success('Campus announcement broadcasted!');
        setIsCreateModalOpen(false);
        setNewNotice({
          title: '',
          content: '',
          category: 'GENERAL',
          priority: 'NORMAL',
          isPinned: false,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish announcement');
    }
  };

  const filteredNotices = announcements.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return <LoadingSpinner text="Loading campus notice board..." fullScreen />;
  }

  const categoryBadges = {
    GENERAL: 'default',
    ACADEMIC: 'primary',
    EXAMINATION: 'purple',
    PLACEMENT: 'success',
    HOLIDAY: 'warning',
    URGENT: 'danger',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-[#E27B88]" />
            University Broadcast & Notice Board
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Official circulars, holiday schedules, examination notices, and administrative announcements
          </p>
        </div>

        {role !== 'STUDENT' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="peach-button-primary text-xs sm:text-sm flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0D9D5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A95763] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars, circular IDs, or keywords..."
            className="w-full pl-9 pr-4 py-2 peach-input text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'GENERAL', 'ACADEMIC', 'EXAMINATION', 'PLACEMENT', 'HOLIDAY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#E27B88] to-[#D9828B] text-white shadow-sm'
                  : 'bg-[#FFF5F1] text-[#6F6264] hover:bg-[#FFD6C9]/40 border border-[#F0D9D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <EmptyState
            title="No notices found"
            description="No circulars match your current search or category filter."
          />
        ) : (
          filteredNotices.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                n.priority === 'URGENT'
                  ? 'border-[#E27B88] bg-gradient-to-r from-[#FFF5F1]/80 via-white to-white'
                  : 'border-[#F0D9D5]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant={n.category === 'ACADEMIC' ? 'peach' : 'default'} size="sm">
                    {n.category}
                  </Badge>
                  {n.priority === 'URGENT' && (
                    <Badge variant="danger" size="sm">
                      Urgent Circular
                    </Badge>
                  )}
                  {n.isPinned && (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#A95763] bg-[#FFF5F1] px-2.5 py-1 rounded-xl border border-[#F0D9D5]">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-[#6F6264]">
                  <Calendar className="w-3.5 h-3.5 text-[#A95763]" />
                  <span>
                    Published:{' '}
                    {new Date(n.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2D2526] mb-2">{n.title}</h3>
              <p className="text-xs sm:text-sm text-[#6F6264] leading-relaxed whitespace-pre-line font-medium">
                {n.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Create Notice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Campus Announcement"
        subtitle="Post a public notice for students and faculty"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. End-Semester Examination Schedule & Guidelines"
              className="w-full peach-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Category</label>
              <select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="w-full peach-input"
              >
                <option value="GENERAL">General Notice</option>
                <option value="ACADEMIC">Academic Circular</option>
                <option value="EXAMINATION">Examinations</option>
                <option value="PLACEMENT">Placements & Careers</option>
                <option value="HOLIDAY">Holiday Calendar</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Priority</label>
              <select
                value={newNotice.priority}
                onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                className="w-full peach-input"
              >
                <option value="NORMAL">Standard Notice</option>
                <option value="URGENT">Urgent / High Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Notice Content *</label>
            <textarea
              rows={5}
              required
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Write the complete announcement text, instructions, and dates..."
              className="w-full peach-input"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="pinNotice"
              checked={newNotice.isPinned}
              onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
              className="rounded text-[#E27B88] focus:ring-[#F4A6A6]"
            />
            <label htmlFor="pinNotice" className="text-xs text-[#6F6264] font-medium">
              Pin to top of student notice board
            </label>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="peach-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
