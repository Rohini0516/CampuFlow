import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner } from '../components/UIStates';
import {
  UserCheck,
  UserPlus,
  Search,
  Eye,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Award,
  Briefcase,
} from 'lucide-react';

export const FacultyPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const [viewFaculty, setViewFaculty] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    password: 'Faculty@123',
    phone: '',
    employeeId: '',
    designation: 'Associate Professor',
    departmentId: '',
    qualification: 'Ph.D in Computer Science',
    experienceYears: 6,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, deptsRes] = await Promise.all([
        api.get('/faculty'),
        api.get('/academic/departments'),
      ]);

      if (facRes.data.success) {
        setFacultyList(facRes.data.data.faculty || []);
      }
      if (deptsRes.data.success) {
        setDepartments(deptsRes.data.data.departments || []);
      }
    } catch (err) {
      toast.error('Failed to load faculty directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.email || !newFaculty.employeeId || !newFaculty.departmentId) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/faculty', newFaculty);
      if (res.data.success) {
        toast.success('Faculty member added successfully');
        setIsAddModalOpen(false);
        setNewFaculty({
          name: '',
          email: '',
          password: 'Faculty@123',
          phone: '',
          employeeId: '',
          designation: 'Associate Professor',
          departmentId: departments[0]?._id || '',
          qualification: 'Ph.D in Computer Science',
          experienceYears: 6,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add faculty');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) => {
    const fName = f.userId?.name || '';
    const fEmail = f.userId?.email || '';
    const empId = f.employeeId || '';
    const deptId = f.departmentId?._id || f.departmentId || '';

    const matchesSearch =
      fName.toLowerCase().includes(search.toLowerCase()) ||
      fEmail.toLowerCase().includes(search.toLowerCase()) ||
      empId.toLowerCase().includes(search.toLowerCase());

    const matchesDept = !selectedDept || deptId === selectedDept;

    return matchesSearch && matchesDept;
  });

  const columns = [
    {
      header: 'Faculty Member',
      render: (row) => {
        const u = row.userId || {};
        return (
          <div className="flex items-center space-x-3">
            <img
              src={
                u.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'Prof')}&background=10b981&color=fff`
              }
              alt={u.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{u.name || 'N/A'}</p>
              <p className="text-xs text-slate-500">{u.email || 'N/A'}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Employee ID',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
          {row.employeeId}
        </span>
      ),
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.departmentId?.name || row.departmentId?.code || 'Department of Engineering'}
        </span>
      ),
    },
    {
      header: 'Designation',
      render: (row) => (
        <Badge variant="purple" size="sm">
          {row.designation || 'Assistant Professor'}
        </Badge>
      ),
    },
    {
      header: 'Experience',
      render: (row) => (
        <span className="text-xs font-bold text-slate-700">
          {row.experienceYears ? `${row.experienceYears} Years` : '5+ Years'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => setViewFaculty(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            Faculty & Professorial Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Teaching staff, departmental appointments, and academic credentials
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              if (departments.length > 0 && !newFaculty.departmentId) {
                setNewFaculty((prev) => ({ ...prev, departmentId: departments[0]._id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by faculty name, designation, or employee code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none text-slate-700 w-full sm:w-56"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredFaculty}
        loading={loading}
        emptyMessage="No faculty members match your criteria."
      />

      {/* View Faculty Modal */}
      <Modal
        isOpen={!!viewFaculty}
        onClose={() => setViewFaculty(null)}
        title="Faculty Member Dossier"
        subtitle="Departmental profile & academic qualifications"
      >
        {viewFaculty && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={
                  viewFaculty.userId?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(viewFaculty.userId?.name || 'Prof')}&background=10b981&color=fff`
                }
                alt={viewFaculty.userId?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewFaculty.userId?.name}</h3>
                <p className="text-xs text-slate-500">{viewFaculty.userId?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {viewFaculty.employeeId}
                  </span>
                  <Badge variant="purple" size="sm">
                    {viewFaculty.designation}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Department</p>
                <p className="font-bold text-slate-800 text-sm">
                  {viewFaculty.departmentId?.name || 'Computer Science & Engineering'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Qualifications</p>
                <p className="font-bold text-slate-800 text-sm">
                  {viewFaculty.qualification || 'Ph.D in Engineering, M.Tech'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Teaching Experience</p>
                <p className="font-bold text-indigo-600 text-sm">
                  {viewFaculty.experienceYears ?? 8} Years
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Contact Phone</p>
                <p className="font-bold text-slate-800 text-sm">
                  {viewFaculty.userId?.phone || '+1 (555) 018-9432'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Appoint Faculty Member"
        subtitle="Create faculty profile & system account"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                placeholder="Dr. Eleanor Vance"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                placeholder="eleanor@campusflow.edu"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee ID *</label>
              <input
                type="text"
                required
                value={newFaculty.employeeId}
                onChange={(e) => setNewFaculty({ ...newFaculty, employeeId: e.target.value })}
                placeholder="FAC-301"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department *</label>
              <select
                required
                value={newFaculty.departmentId}
                onChange={(e) => setNewFaculty({ ...newFaculty, departmentId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                placeholder="Associate Professor"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={newFaculty.experienceYears}
                onChange={(e) =>
                  setNewFaculty({ ...newFaculty, experienceYears: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Highest Qualification</label>
            <input
              type="text"
              value={newFaculty.qualification}
              onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
              placeholder="Ph.D. in Computer Science & AI"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              {submitting ? 'Creating...' : 'Appoint Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
