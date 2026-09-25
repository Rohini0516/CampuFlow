import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  MessageSquareWarning,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  UserCheck,
} from 'lucide-react';

export const GrievancesPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Raise Modal
  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'ACADEMIC',
    priority: 'MEDIUM',
    isAnonymous: false,
  });

  // Resolve Modal (Admin)
  const [resolveModalData, setResolveModalData] = useState(null);
  const [resolutionInput, setResolutionInput] = useState({
    status: 'RESOLVED',
    resolutionComments: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/grievances');
      if (res.data.success) {
        setComplaints(res.data.data.complaints || []);
      }
    } catch (err) {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRaiseGrievance = async (e) => {
    e.preventDefault();
    if (!newComplaint.title || !newComplaint.description) {
      toast.error('Please provide a title and description');
      return;
    }

    try {
      const res = await api.post('/grievances', newComplaint);
      if (res.data.success) {
        toast.success('Grievance ticket logged securely!');
        setRaiseModalOpen(false);
        setNewComplaint({
          title: '',
          description: '',
          category: 'ACADEMIC',
          priority: 'MEDIUM',
          isAnonymous: false,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit grievance');
    }
  };

  const handleResolveGrievance = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/grievances/${resolveModalData._id}/status`, resolutionInput);
      if (res.data.success) {
        toast.success('Ticket status & resolution updated');
        setResolveModalData(null);
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to resolve grievance');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading grievance redressal portal..." fullScreen />;
  }

  const priorityBadges = {
    LOW: 'default',
    MEDIUM: 'primary',
    HIGH: 'warning',
    URGENT: 'danger',
  };

  const statusBadges = {
    PENDING: 'warning',
    IN_REVIEW: 'indigo',
    RESOLVED: 'success',
    REJECTED: 'danger',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquareWarning className="w-7 h-7 text-amber-600" />
            Grievance Redressal & Student Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit confidential complaints, track investigation status, and receive administrative resolution
          </p>
        </div>

        <button
          onClick={() => setRaiseModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Grievance Ticket</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <EmptyState
            title="No open grievances"
            description="You have no active complaints or redressal tickets on file."
          />
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusBadges[c.status] || 'default'} size="sm">
                    {c.status}
                  </Badge>
                  <Badge variant={priorityBadges[c.priority] || 'default'} size="sm">
                    {c.priority} Priority
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    {c.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Logged: {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                {c.resolutionComments && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs">
                    <p className="font-bold text-emerald-900 mb-0.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Administrative Resolution:
                    </p>
                    <p className="text-emerald-800">{c.resolutionComments}</p>
                  </div>
                )}
              </div>

              {role === 'ADMIN' && (
                <div className="flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => {
                      setResolveModalData(c);
                      setResolutionInput({
                        status: c.status || 'RESOLVED',
                        resolutionComments: c.resolutionComments || '',
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Action / Resolve
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Raise Modal */}
      <Modal
        isOpen={raiseModalOpen}
        onClose={() => setRaiseModalOpen(false)}
        title="Raise Grievance Ticket"
        subtitle="Confidential submission to University Redressal Committee"
      >
        <form onSubmit={handleRaiseGrievance} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              placeholder="e.g. Broken projector in Room 302 / Library air conditioner issue"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="ACADEMIC">Academic / Teaching</option>
                <option value="INFRASTRUCTURE">Campus Infrastructure</option>
                <option value="HOSTEL">Hostel & Mess</option>
                <option value="EXAMINATION">Examinations</option>
                <option value="HARASSMENT">Harassment & Anti-Ragging</option>
                <option value="FINANCE">Fees & Finance</option>
                <option value="OTHER">Other Issue</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency Priority</label>
              <select
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent / Immediate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
              placeholder="Provide exact location, timeline, and specifics to help the committee investigate..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="anonCheck"
              checked={newComplaint.isAnonymous}
              onChange={(e) =>
                setNewComplaint({ ...newComplaint, isAnonymous: e.target.checked })
              }
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="anonCheck" className="text-xs text-slate-600 font-medium">
              Submit anonymously (hide your name from department public list)
            </label>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setRaiseModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30"
            >
              Submit Grievance
            </button>
          </div>
        </form>
      </Modal>

      {/* Resolve Modal (Admin) */}
      <Modal
        isOpen={!!resolveModalData}
        onClose={() => setResolveModalData(null)}
        title="Resolve Grievance Ticket"
        subtitle={`Ticket #${resolveModalData?._id?.substring(0, 8)}: ${resolveModalData?.title || ''}`}
      >
        <form onSubmit={handleResolveGrievance} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Update Status</label>
            <select
              value={resolutionInput.status}
              onChange={(e) =>
                setResolutionInput({ ...resolutionInput, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="IN_REVIEW">Under Active Investigation</option>
              <option value="RESOLVED">Resolved / Remedied</option>
              <option value="REJECTED">Closed / Rejected</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Administrative Remarks *</label>
            <textarea
              rows={4}
              required
              value={resolutionInput.resolutionComments}
              onChange={(e) =>
                setResolutionInput({ ...resolutionInput, resolutionComments: e.target.value })
              }
              placeholder="Explain the corrective actions taken (e.g. Technician dispatched, projector replaced)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setResolveModalData(null)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
            >
              Save Resolution
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
