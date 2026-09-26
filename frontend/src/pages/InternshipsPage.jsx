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
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#E27B88]" />
            Industry Internships & Apprenticeships
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Summer training programs, research apprenticeships, stipends, and work opportunities
          </p>
        </div>

        {(role === 'ADMIN' || role === 'PLACEMENT_OFFICER') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="peach-button-primary text-xs sm:text-sm flex items-center space-x-2 self-start sm:self-auto"
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
              className="bg-white rounded-3xl border border-[#F0D9D5] p-6 shadow-sm hover:shadow-xl hover:border-[#EFA7B5] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-[#2D2526] text-base">{item.company}</h3>
                    <p className="text-xs font-semibold text-[#E27B88]">{item.role || item.title}</p>
                  </div>
                  <Badge variant={item.isRemote ? 'peach' : 'default'} size="sm">
                    {item.isRemote ? 'Remote / Hybrid' : 'On-Site'}
                  </Badge>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFF5F1] border border-[#F0D9D5] flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#A95763]">Monthly Stipend</span>
                  <span className="text-sm font-black text-[#A95763]">{item.stipend || '$2,000'}</span>
                </div>

                <div className="space-y-1.5 text-xs text-[#6F6264] mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#A95763]" />
                    <span>Duration: {item.duration || '3 Months'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#A95763]" />
                    <span>Location: {item.location || 'San Francisco, CA'}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6F6264] line-clamp-3 mb-4 font-medium">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F0D9D5]">
                <button
                  type="button"
                  disabled={applyingId === item._id}
                  onClick={() => handleApply(item._id)}
                  className="w-full py-2.5 rounded-xl peach-button-primary text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
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
              <label className="block font-bold text-[#2D2526] mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={newInternship.company}
                onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                placeholder="e.g. OpenAI Labs"
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Role Title *</label>
              <input
                type="text"
                required
                value={newInternship.role}
                onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                placeholder="Machine Learning Research Intern"
                className="w-full peach-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Stipend *</label>
              <input
                type="text"
                required
                value={newInternship.stipend}
                onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                placeholder="$3,000 / month"
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Duration</label>
              <input
                type="text"
                value={newInternship.duration}
                onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                placeholder="3 Months"
                className="w-full peach-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Location</label>
              <input
                type="text"
                value={newInternship.location}
                onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                placeholder="Hybrid / Remote"
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Deadline</label>
              <input
                type="date"
                value={newInternship.deadline}
                onChange={(e) => setNewInternship({ ...newInternship, deadline: e.target.value })}
                className="w-full peach-input"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Description & Qualifications</label>
            <textarea
              rows={3}
              value={newInternship.description}
              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              placeholder="Candidate eligibility, required tech skills (Python, PyTorch), and mentorship details..."
              className="w-full peach-input"
            />
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
              Publish Internship
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
