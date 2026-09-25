import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner } from '../components/UIStates';
import {
  BookOpen,
  Plus,
  Search,
  Award,
  Layers,
  Building2,
  TrendingUp,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export const SubjectsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    departmentId: '',
    semester: 1,
    credits: 4,
    type: 'THEORY',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, deptsRes] = await Promise.all([
        api.get('/academic/subjects'),
        api.get('/academic/departments'),
      ]);

      if (subjRes.data.success) {
        setSubjects(subjRes.data.data.subjects || subjRes.data.data || []);
      }
      if (deptsRes.data.success) {
        const d = deptsRes.data.data.departments || deptsRes.data.data || [];
        setDepartments(d);
        if (d.length > 0) {
          setNewSubject((prev) => ({ ...prev, departmentId: d[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.code || !newSubject.departmentId) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const res = await api.post('/academic/subjects', newSubject);
      if (res.data.success) {
        toast.success('Subject added to curriculum!');
        setIsAddModalOpen(false);
        setNewSubject({
          name: '',
          code: '',
          departmentId: departments[0]?._id || '',
          semester: 1,
          credits: 4,
          type: 'THEORY',
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subject');
    }
  };

  const calculateGrade = (total) => {
    if (total >= 90) return { grade: 'A+', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (total >= 80) return { grade: 'A', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (total >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (total >= 60) return { grade: 'B', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (total >= 50) return { grade: 'C', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { grade: 'F', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());
    const deptId = s.departmentId?._id || s.departmentId;
    const matchesDept = !selectedDept || deptId === selectedDept;
    const matchesSem = !selectedSem || String(s.semester) === String(selectedSem);
    return matchesSearch && matchesDept && matchesSem;
  });

  const columns = [
    {
      header: 'Subject Code',
      render: (row) => (
        <span className="font-mono font-bold text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Subject Name',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-sm">{row.name}</p>
          <span className="text-xs text-slate-500 font-medium">
            {row.departmentId?.name || 'Computer Science & Engineering'}
          </span>
        </div>
      ),
    },
    {
      header: 'Semester',
      render: (row) => <Badge variant="indigo" size="sm">Semester {row.semester}</Badge>,
    },
    {
      header: 'Credits',
      render: (row) => (
        <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-xs">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>{row.credits} Credits</span>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (row) => (
        <Badge variant={row.type === 'PRACTICAL' ? 'purple' : 'primary'} size="sm">
          {row.type || 'THEORY'}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner text="Loading curriculum courses & performance breakdown..." fullScreen />;
  }

  // Sample auto-calculated Subject Marks Table Data
  const samplePerformanceList = [
    { name: 'Data Structures & Algorithms', code: 'CS301', assgn: 18, mid: 22, sem: 43 },
    { name: 'Database Management Systems', code: 'CS402', assgn: 19, mid: 25, sem: 45 },
    { name: 'Operating Systems & Architecture', code: 'CS501', assgn: 17, mid: 21, sem: 44 },
    { name: 'Computer Networks & Security', code: 'CS502', assgn: 16, mid: 23, sem: 42 },
    { name: 'Software Engineering Principles', code: 'CS503', assgn: 19, mid: 27, sem: 46 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600" />
            Subject Management & Auto-Calculated Mark Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Department-specific subjects, credit weights, Assignment (20) + Mid (30) + Semester (50) = Total (100)
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        )}
      </div>

      {/* Subject Performance Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-5 h-5 text-brand-600 mr-2" />
              Automated Subject Performance Scheme (Assgn 20 + Mid 30 + Sem 50 = Total 100)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calculates subject totals, percentage %, and letter grades automatically.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assignment (20)</th>
                <th className="py-3 px-4">Mid Exam (30)</th>
                <th className="py-3 px-4">Semester Exam (50)</th>
                <th className="py-3 px-4">Total (100)</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {samplePerformanceList.map((sub, idx) => {
                const total = sub.assgn + sub.mid + sub.sem;
                const pct = ((total / 100) * 100).toFixed(0);
                const g = calculateGrade(total);
                return (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <span className="font-mono text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 mr-2">
                        {sub.code}
                      </span>
                      {sub.name}
                    </td>
                    <td className="py-3 px-4">{sub.assgn} / 20</td>
                    <td className="py-3 px-4">{sub.mid} / 30</td>
                    <td className="py-3 px-4">{sub.sem} / 50</td>
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">{total} / 100</td>
                    <td className="py-3 px-4 font-extrabold text-brand-700 text-sm">{pct}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${g.color}`}>
                        {g.grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects by name or code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none w-full sm:w-56 font-semibold"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.code})
            </option>
          ))}
        </select>

        <select
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none w-full sm:w-36 font-semibold"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Sem {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSubjects}
        loading={loading}
        emptyMessage="No subjects match the selected filters."
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Subject to Curriculum"
        subtitle="Register course code, credit hours, and syllabus"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              placeholder="e.g. Design and Analysis of Algorithms"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={newSubject.code}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                placeholder="CS-301"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department *</label>
              <select
                value={newSubject.departmentId}
                onChange={(e) => setNewSubject({ ...newSubject, departmentId: e.target.value })}
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
                value={newSubject.semester}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, semester: Number(e.target.value) })
                }
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
              <label className="block font-bold text-slate-700 mb-1">Credits</label>
              <input
                type="number"
                value={newSubject.credits}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, credits: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Type</label>
              <select
                value={newSubject.type}
                onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="THEORY">Theory</option>
                <option value="PRACTICAL">Practical / Lab</option>
                <option value="ELECTIVE">Elective</option>
              </select>
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
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Add Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
