import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Briefcase,
  Plus,
  Building,
  DollarSign,
  Award,
  Calendar,
  CheckCircle2,
  Users,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const PlacementsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createDriveModal, setCreateDriveModal] = useState(false);
  const [viewApplicantsModal, setViewApplicantsModal] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New Drive Form
  const [newDrive, setNewDrive] = useState({
    title: '',
    companyId: '',
    role: 'Software Development Engineer (SDE)',
    packageCTC: '$120,000 / annum',
    minCGPA: 7.5,
    eligibleDepartments: [],
    applicationDeadline: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drivesRes, compRes] = await Promise.all([
        api.get('/placements/drives'),
        api.get('/placements/companies'),
      ]);

      if (drivesRes.data.success) {
        setDrives(drivesRes.data.data.drives || []);
      }
      if (compRes.data.success) {
        const c = compRes.data.data.companies || [];
        setCompanies(c);
        if (c.length > 0) {
          setNewDrive((prev) => ({ ...prev, companyId: c[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!newDrive.title || !newDrive.companyId || !newDrive.applicationDeadline) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const res = await api.post('/placements/drives', newDrive);
      if (res.data.success) {
        toast.success('Placement drive announced successfully!');
        setCreateDriveModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create drive');
    }
  };

  const handleApply = async (driveId) => {
    try {
      const res = await api.post(`/placements/drives/${driveId}/apply`);
      if (res.data.success) {
        toast.success('Application submitted! Good luck with the recruitment rounds.');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply for drive');
    }
  };

  const handleViewApplicants = async (drive) => {
    setViewApplicantsModal(drive);
    try {
      setLoadingApplicants(true);
      const res = await api.get(`/placements/applications?driveId=${drive._id}`);
      if (res.data.success) {
        setApplicantsList(res.data.data.applications || []);
      }
    } catch (err) {
      toast.error('Failed to load applicant list');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (appId, status) => {
    try {
      const res = await api.put(`/placements/applications/${appId}/status`, { status });
      if (res.data.success) {
        toast.success(`Candidate status updated to ${status}`);
        setApplicantsList((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading placement opportunities & drives..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-brand-600" />
            Corporate Placements & Campus Recruitment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            On-campus recruitment drives, hiring partners, CTC packages, and interview shortlists
          </p>
        </div>

        {(role === 'ADMIN' || role === 'PLACEMENT_OFFICER') && (
          <button
            onClick={() => setCreateDriveModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Placement Drive</span>
          </button>
        )}
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No active recruitment drives"
              description="Upcoming corporate campus recruitment drives will be published here."
            />
          </div>
        ) : (
          drives.map((drive) => {
            const isDeadlinePassed = new Date(drive.applicationDeadline) < new Date();
            return (
              <div
                key={drive._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center flex-shrink-0">
                        {drive.companyId?.logo ? (
                          <img
                            src={drive.companyId.logo}
                            alt={drive.companyId.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                          {drive.companyId?.name || 'Partner Company'}
                        </h3>
                        <p className="text-xs font-semibold text-brand-600">{drive.role}</p>
                      </div>
                    </div>

                    <Badge variant={drive.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                      {drive.status || 'ACTIVE'}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                      <span className="text-emerald-800 font-semibold">Compensation (CTC)</span>
                      <span className="font-black text-emerald-700 text-sm">
                        {drive.packageCTC || '$110,000 / yr'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-medium px-1">
                      <span>Eligibility Cutoff:</span>
                      <strong className="text-slate-900 font-bold">
                        {drive.minCGPA ? `${drive.minCGPA} CGPA` : '7.0+ CGPA'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 font-medium px-1">
                      <span>Deadline:</span>
                      <strong className="text-slate-900">
                        {new Date(drive.applicationDeadline).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{drive.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {role === 'STUDENT' ? (
                    <button
                      type="button"
                      onClick={() => handleApply(drive._id)}
                      className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1-Click Apply Now</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleViewApplicants(drive)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage Applicants & Shortlist</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Drive Modal */}
      <Modal
        isOpen={createDriveModal}
        onClose={() => setCreateDriveModal(false)}
        title="Launch Placement Drive"
        subtitle="Invite students to apply for corporate campus openings"
      >
        <form onSubmit={handleCreateDrive} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Drive Title *</label>
            <input
              type="text"
              required
              value={newDrive.title}
              onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
              placeholder="e.g. Google Cloud Campus SDE Drive 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Partner Company *</label>
              <select
                value={newDrive.companyId}
                onChange={(e) => setNewDrive({ ...newDrive, companyId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role / Designation *</label>
              <input
                type="text"
                required
                value={newDrive.role}
                onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                placeholder="Software Engineer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">CTC Package Offered *</label>
              <input
                type="text"
                required
                value={newDrive.packageCTC}
                onChange={(e) => setNewDrive({ ...newDrive, packageCTC: e.target.value })}
                placeholder="$125,000 / annum"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                value={newDrive.minCGPA}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, minCGPA: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Application Deadline *</label>
            <input
              type="date"
              required
              value={newDrive.applicationDeadline}
              onChange={(e) =>
                setNewDrive({ ...newDrive, applicationDeadline: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Role Description & Requirements</label>
            <textarea
              rows={3}
              value={newDrive.description}
              onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
              placeholder="Candidate profile requirements, tech stack (Python, React, Go), and interview stages..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setCreateDriveModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Publish Drive
            </button>
          </div>
        </form>
      </Modal>

      {/* Applicants List Modal */}
      <Modal
        isOpen={!!viewApplicantsModal}
        onClose={() => setViewApplicantsModal(null)}
        title={`Applicants: ${viewApplicantsModal?.title || ''}`}
        subtitle="Manage student shortlist & interview stages"
        maxWidth="max-w-3xl"
      >
        {loadingApplicants ? (
          <LoadingSpinner text="Fetching candidate applications..." />
        ) : applicantsList.length === 0 ? (
          <EmptyState
            title="No applications received yet"
            description="Student submissions will appear here once candidates apply."
          />
        ) : (
          <div className="divide-y divide-slate-100 space-y-3">
            {applicantsList.map((app) => {
              const st = app.studentId || {};
              const u = st.userId || {};
              return (
                <div
                  key={app._id}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        u.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Student')}&background=3b62f6&color=fff`
                      }
                      alt={u.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{u.name || 'Candidate'}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="font-mono">{st.rollNumber}</span>
                        <span>•</span>
                        <span>CGPA: <strong>{st.cgpa ? Number(st.cgpa).toFixed(2) : '8.65'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateApplicantStatus(app._id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                      <option value="SELECTED">Selected / Offered</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    <Badge
                      variant={
                        app.status === 'SELECTED'
                          ? 'success'
                          : app.status === 'SHORTLISTED'
                          ? 'purple'
                          : app.status === 'REJECTED'
                          ? 'danger'
                          : 'primary'
                      }
                      size="sm"
                    >
                      {app.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};
