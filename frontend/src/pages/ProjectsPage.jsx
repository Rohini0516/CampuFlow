import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(null);

  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    department: '',
    semester: 5,
    expectedCompletionDate: '',
    remarks: '',
  });

  const [updateData, setUpdateData] = useState({
    status: 'Development',
    progress: 50,
    score: 85,
    remarks: '',
  });

  const [departments, setDepartments] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDept) params.department = selectedDept;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedSemester) params.semester = selectedSemester;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/projects', { params });
      if (res.data.success) {
        setProjects(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load student projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/academic/departments');
        if (res.data.success) {
          setDepartments(res.data.data || []);
        }
      } catch (err) {}
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedDept, selectedStatus, selectedSemester, searchTerm]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title) {
      toast.error('Please enter project title');
      return;
    }
    try {
      const res = await api.post('/projects', newProject);
      if (res.data.success) {
        toast.success('Project created successfully!');
        setCreateModalOpen(false);
        setNewProject({
          title: '',
          description: '',
          department: '',
          semester: 5,
          expectedCompletionDate: '',
          remarks: '',
        });
        fetchProjects();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!updateModalOpen) return;
    try {
      const res = await api.put(`/projects/${updateModalOpen._id}`, updateData);
      if (res.data.success) {
        toast.success('Project updated successfully!');
        setUpdateModalOpen(null);
        fetchProjects();
      }
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const openUpdateModal = (prj) => {
    setUpdateModalOpen(prj);
    setUpdateData({
      status: prj.status || 'Development',
      progress: prj.progress || 50,
      score: prj.score || 85,
      remarks: prj.remarks || '',
    });
  };

  if (loading && projects.length === 0) {
    return <LoadingSpinner text="Loading student project module..." fullScreen />;
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Submitted':
        return 'info';
      case 'Testing':
      case 'Development':
        return 'warning';
      case 'Planning':
        return 'indigo';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#E27B88]" />
            Student Project Tracking & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Monitor capstone, mini-projects, progress indicators, evaluation scores, and completion certificates
          </p>
        </div>

        {(role === 'ADMIN' || role === 'FACULTY' || role === 'STUDENT') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="peach-button-primary text-xs sm:text-sm flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#F0D9D5] p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A95763] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search project title or ID..."
              className="w-full pl-9 pr-3 py-2 peach-input text-xs sm:text-sm"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full peach-input text-xs sm:text-sm font-medium text-[#2D2526]"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full peach-input text-xs sm:text-sm font-medium text-[#2D2526]"
          >
            <option value="">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Submitted">Submitted</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full peach-input text-xs sm:text-sm font-medium text-[#2D2526]"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No student projects found"
              description="Click 'Create New Project' above to register a new student capstone or mini project."
            />
          </div>
        ) : (
          projects.map((item) => {
            const isCompleted = item.status === 'Completed';
            return (
              <div
                key={item._id}
                className={`bg-white rounded-3xl border ${
                  isCompleted ? 'border-emerald-300 shadow-emerald-50' : 'border-[#F0D9D5]'
                } p-6 shadow-sm hover:shadow-xl hover:border-[#EFA7B5] transition-all flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Completed Banner if 100% */}
                {isCompleted && (
                  <div className="bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-4 text-center -mx-6 -mt-6 mb-4 flex items-center justify-center space-x-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Project Completed • Score: {item.score}/100</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-[#A95763] font-bold bg-[#FFF5F1] px-2.5 py-1 rounded-xl border border-[#F0D9D5]">
                      {item.projectId || 'PRJ-101'}
                    </span>
                    <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-[#2D2526] text-base mb-1 group-hover:text-[#E27B88] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6F6264] line-clamp-2 mb-4 font-medium">
                    {item.description || 'Capstone project under academic faculty supervision.'}
                  </p>

                  {/* Student & Department Details */}
                  <div className="space-y-2 text-xs text-[#6F6264] mb-4 bg-[#FFF5F1]/70 p-3 rounded-2xl border border-[#F0D9D5]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#A95763] flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 text-[#E27B88]" />
                        Student Lead
                      </span>
                      <span className="font-bold text-[#2D2526]">
                        {item.student?.user?.name || 'Student'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#A95763] flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-[#E27B88]" />
                        Department
                      </span>
                      <span className="font-bold text-[#2D2526]">
                        {item.department?.code || 'CSE'} • Sem {item.semester}
                      </span>
                    </div>

                    {item.facultyMentor && (
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#A95763] flex items-center">
                          <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                          Faculty Mentor
                        </span>
                        <span className="font-bold text-[#2D2526]">
                          {item.facultyMentor?.user?.name || 'Prof. Faculty'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar Indicator */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2D2526] flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 text-[#E27B88] mr-1" />
                        Progress Indicator
                      </span>
                      <span className="font-extrabold text-[#E27B88]">{item.progress}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-[#F0D9D5]/60 rounded-full overflow-hidden p-0.5 border border-[#F0D9D5]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : item.progress > 50
                            ? 'bg-[#E27B88]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-[#A95763] pt-0.5">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#F0D9D5] flex items-center justify-between">
                  <span className="text-[11px] text-[#6F6264] font-medium">
                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                  </span>

                  {(role === 'ADMIN' || role === 'FACULTY') && (
                    <button
                      onClick={() => openUpdateModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF5F1] hover:bg-[#E27B88] hover:text-white text-[#A95763] font-bold text-xs border border-[#F0D9D5] transition-all"
                    >
                      Update Progress
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Student Project Record"
        subtitle="Register capstone or mini project record"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="e.g. AI-Powered Autonomous Smart Campus Navigation"
              className="w-full peach-input"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Project Description</label>
            <textarea
              rows={2}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief overview of project scope and objectives..."
              className="w-full peach-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Department</label>
              <select
                value={newProject.department}
                onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                className="w-full peach-input font-medium"
              >
                <option value="">Select Dept</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Semester</label>
              <select
                value={newProject.semester}
                onChange={(e) =>
                  setNewProject({ ...newProject, semester: Number(e.target.value) })
                }
                className="w-full peach-input font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="peach-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Progress Modal */}
      <Modal
        isOpen={!!updateModalOpen}
        onClose={() => setUpdateModalOpen(null)}
        title="Update Project Progress & Evaluation"
        subtitle={updateModalOpen?.title}
      >
        <form onSubmit={handleUpdateProject} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Project Status</label>
            <select
              value={updateData.status}
              onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              className="w-full peach-input font-semibold"
            >
              <option value="Planning">Planning</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Submitted">Submitted</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-bold text-[#2D2526]">Progress Percentage ({updateData.progress}%)</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={updateData.progress}
              onChange={(e) => setUpdateData({ ...updateData, progress: Number(e.target.value) })}
              className="w-full accent-[#E27B88]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Evaluation Score (Max 100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={updateData.score}
              onChange={(e) => setUpdateData({ ...updateData, score: Number(e.target.value) })}
              className="w-full peach-input font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Mentor Remarks & Feedback</label>
            <textarea
              rows={2}
              value={updateData.remarks}
              onChange={(e) => setUpdateData({ ...updateData, remarks: e.target.value })}
              placeholder="Add mentor feedback or review comments..."
              className="w-full peach-input"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setUpdateModalOpen(null)}
              className="peach-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary"
            >
              Save Evaluation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
