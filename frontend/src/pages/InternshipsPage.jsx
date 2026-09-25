import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Layers,
  Plus,
  Building,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const InternshipsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [applyingId, setApplyingId] = useState(null);

  const [newInternship, setNewInternship] = useState({
    title: '',
    company: '',
    role: 'Full Stack Engineering Intern',
    stipend: '$2,500 / month',
    duration: '3 Months (Summer 2026)',
    location: 'Hybrid / Silicon Valley',
    isRemote: true,
    deadline: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/internships');
      if (res.data.success) {
        setInternships(res.data.data.internships || []);
      }
    } catch (err) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/internships', newInternship);
      if (res.data.success) {
        toast.success('Internship opportunity published successfully!');
        setIsCreateModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post internship');
    }
  };

  const handleApply = async (id) => {
    try {
      setApplyingId(id);
      const res = await api.post(`/internships/${id}/apply`);
      if (res.data.success) {
        toast.success('Internship application submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading internship opportunities..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-emerald-600" />
            Industry Internships & Apprenticeships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Summer training programs, research apprenticeships, stipends, and work opportunities
          </p>
        </div>

        {(role === 'ADMIN' || role === 'PLACEMENT_OFFICER') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Internship Opportunity</span>
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No internship openings at the moment"
              description="New summer and winter internship programs will appear here once published."
            />
          </div>
        ) : (
          internships.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.company}</h3>
                    <p className="text-xs font-semibold text-emerald-600">{item.role || item.title}</p>
                  </div>
                  <Badge variant={item.isRemote ? 'success' : 'indigo'} size="sm">
                    {item.isRemote ? 'Remote / Hybrid' : 'On-Site'}
                  </Badge>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-emerald-800">Monthly Stipend</span>
                  <span className="text-sm font-black text-emerald-700">{item.stipend || '$2,000'}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {item.duration || '3 Months'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {item.location || 'San Francisco, CA'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={applyingId === item._id}
                  onClick={() => handleApply(item._id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{applyingId === item._id ? 'Submitting...' : 'Apply for Internship'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Post Internship Program"
        subtitle="Invite university students for industry training"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={newInternship.company}
                onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                placeholder="e.g. OpenAI Labs"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={newInternship.role}
                onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                placeholder="Machine Learning Research Intern"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stipend *</label>
              <input
                type="text"
                required
                value={newInternship.stipend}
                onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                placeholder="$3,000 / month"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={newInternship.duration}
                onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                placeholder="3 Months"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={newInternship.location}
                onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                placeholder="Hybrid / Remote"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deadline</label>
              <input
                type="date"
                value={newInternship.deadline}
                onChange={(e) => setNewInternship({ ...newInternship, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Qualifications</label>
            <textarea
              rows={3}
              value={newInternship.description}
              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              placeholder="Candidate eligibility, required tech skills (Python, PyTorch), and mentorship details..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30"
            >
              Publish Internship
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
