import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner } from '../components/UIStates';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Award,
  CalendarCheck,
} from 'lucide-react';

export const StudentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Modals
  const [viewStudent, setViewStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: 'Student@123',
    phone: '',
    rollNumber: '',
    departmentId: '',
    semester: 1,
    cgpa: 8.0,
    attendancePercentage: 85,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, deptsRes] = await Promise.all([
        api.get('/students'),
        api.get('/academic/departments'),
      ]);

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data.students || []);
      }
      if (deptsRes.data.success) {
        setDepartments(deptsRes.data.data.departments || []);
      }
    } catch (err) {
      toast.error('Failed to load student directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.rollNumber || !newStudent.departmentId) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/students', newStudent);
      if (res.data.success) {
        toast.success('Student profile created successfully');
        setIsAddModalOpen(false);
        setNewStudent({
          name: '',
          email: '',
          password: 'Student@123',
          phone: '',
          rollNumber: '',
          departmentId: departments[0]?._id || '',
          semester: 1,
          cgpa: 8.0,
          attendancePercentage: 85,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const studentName = s.userId?.name || s.name || '';
    const studentEmail = s.userId?.email || s.email || '';
    const roll = s.rollNumber || '';
    const deptId = s.departmentId?._id || s.departmentId || '';
    const sem = s.currentSemester || s.semester;

    const matchesSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      roll.toLowerCase().includes(search.toLowerCase());

    const matchesDept = !selectedDept || deptId === selectedDept;
    const matchesSem = !selectedSemester || String(sem) === String(selectedSemester);

    return matchesSearch && matchesDept && matchesSem;
  });

  const columns = [
    {
      header: 'Student Profile',
      render: (row) => {
        const u = row.userId || {};
        return (
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
              <p className="font-bold text-slate-900 text-sm">{u.name || 'N/A'}</p>
              <p className="text-xs text-slate-500">{u.email || 'N/A'}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Roll Number',
      render: (row) => (
        <span className="font-mono font-semibold text-xs text-brand-700 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200">
          {row.rollNumber}
        </span>
      ),
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.departmentId?.name || row.departmentId?.code || 'Engineering'}
        </span>
      ),
    },
    {
      header: 'Semester',
      render: (row) => (
        <Badge variant="indigo" size="sm">
          Sem {row.currentSemester || row.semester || 1}
        </Badge>
      ),
    },
    {
      header: 'CGPA',
      render: (row) => (
        <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-xs">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>{row.cgpa ? Number(row.cgpa).toFixed(2) : '8.50'}</span>
        </div>
      ),
    },
    {
      header: 'Attendance',
      render: (row) => {
        const att = row.attendancePercentage ?? 88;
        const color = att >= 75 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
        return (
          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${color}`}>
            {att}%
          </span>
        );
      },
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => setViewStudent(row)}
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
            <Users className="w-7 h-7 text-brand-600" />
            Student Directory & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage student registrations, academic standing, semesters, and records
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              if (departments.length > 0 && !newStudent.departmentId) {
                setNewStudent((prev) => ({ ...prev, departmentId: departments[0]._id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none text-slate-700 w-full md:w-48"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none text-slate-700 w-full md:w-36"
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

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        emptyMessage="No students match the selected filters."
      />

      {/* View Student Modal */}
      <Modal
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        title="Student Academic Dossier"
        subtitle="Complete academic profile and contact record"
      >
        {viewStudent && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={
                  viewStudent.userId?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(viewStudent.userId?.name || 'Student')}&background=3b62f6&color=fff`
                }
                alt={viewStudent.userId?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewStudent.userId?.name}</h3>
                <p className="text-xs text-slate-500">{viewStudent.userId?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {viewStudent.rollNumber}
                  </span>
                  <Badge variant="primary" size="sm">
                    Sem {viewStudent.currentSemester || viewStudent.semester || 1}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Department</p>
                <p className="font-bold text-slate-800 text-sm">
                  {viewStudent.departmentId?.name || 'Computer Science & Engineering'}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Cumulative CGPA</p>
                <p className="font-bold text-brand-600 text-sm">
                  {viewStudent.cgpa ? Number(viewStudent.cgpa).toFixed(2) : '8.65'} / 10.0
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Attendance Percentage</p>
                <p className="font-bold text-emerald-600 text-sm">
                  {viewStudent.attendancePercentage ?? 89}%
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-semibold mb-1">Contact Phone</p>
                <p className="font-bold text-slate-800 text-sm">
                  {viewStudent.userId?.phone || '+1 (555) 014-7788'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        subtitle="Create user account & academic profile"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="alex@campusflow.edu"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Roll / Reg Number *</label>
              <input
                type="text"
                required
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                placeholder="CS2026-088"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department *</label>
              <select
                required
                value={newStudent.departmentId}
                onChange={(e) => setNewStudent({ ...newStudent, departmentId: e.target.value })}
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Semester</label>
              <select
                value={newStudent.semester}
                onChange={(e) => setNewStudent({ ...newStudent, semester: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={newStudent.cgpa}
                onChange={(e) => setNewStudent({ ...newStudent, cgpa: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                placeholder="+1 555-0199"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
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
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              {submitting ? 'Creating...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
