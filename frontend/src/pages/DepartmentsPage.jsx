import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Building2,
  Plus,
  Users,
  UserCheck,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';

export const DepartmentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeptDashboard, setSelectedDeptDashboard] = useState(null);

  // Filter & Search inside Department Dashboard Modal
  const [studentSearch, setStudentSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('5');

  const defaultAll11Depts = [
    { code: 'CSE', name: 'Computer Science and Engineering', hod: 'Dr. Arthur Vance', seats: 60, present: 55, absent: 5, faculty: 12, subjects: 8, avgAttendance: '91.6%', avgMarks: '84.2%', upcomingExams: 3 },
    { code: 'IT', name: 'Information Technology', hod: 'Dr. Gregory House', seats: 60, present: 54, absent: 6, faculty: 10, subjects: 7, avgAttendance: '90.0%', avgMarks: '82.5%', upcomingExams: 2 },
    { code: 'ECE', name: 'Electronics and Communication Engineering', hod: 'Dr. Linda Morales', seats: 60, present: 56, absent: 4, faculty: 11, subjects: 8, avgAttendance: '93.3%', avgMarks: '85.0%', upcomingExams: 2 },
    { code: 'EEE', name: 'Electrical and Electronics Engineering', hod: 'Prof. Nathan Reed', seats: 60, present: 53, absent: 7, faculty: 9, subjects: 7, avgAttendance: '88.3%', avgMarks: '80.1%', upcomingExams: 2 },
    { code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. Vikram Sarabhai', seats: 60, present: 52, absent: 8, faculty: 10, subjects: 8, avgAttendance: '86.7%', avgMarks: '79.4%', upcomingExams: 1 },
    { code: 'CIVIL', name: 'Civil Engineering', hod: 'Dr. E. Sreedharan', seats: 60, present: 51, absent: 9, faculty: 8, subjects: 6, avgAttendance: '85.0%', avgMarks: '78.0%', upcomingExams: 1 },
    { code: 'MBA', name: 'Master of Business Administration', hod: 'Dr. Susan Wojcicki', seats: 60, present: 57, absent: 3, faculty: 8, subjects: 6, avgAttendance: '95.0%', avgMarks: '88.6%', upcomingExams: 2 },
    { code: 'M.TECH', name: 'Master of Technology', hod: 'Dr. Alan Turing', seats: 60, present: 58, absent: 2, faculty: 6, subjects: 5, avgAttendance: '96.7%', avgMarks: '90.2%', upcomingExams: 1 },
    { code: 'ACSE', name: 'Advanced Computer Science Engineering', hod: 'Dr. Barbara Liskov', seats: 60, present: 56, absent: 4, faculty: 9, subjects: 7, avgAttendance: '93.3%', avgMarks: '87.1%', upcomingExams: 3 },
    { code: 'CYBER', name: 'Cyber Security', hod: 'Dr. Kevin Mitnick', seats: 60, present: 55, absent: 5, faculty: 8, subjects: 7, avgAttendance: '91.7%', avgMarks: '86.4%', upcomingExams: 2 },
    { code: 'AI-DS', name: 'Artificial Intelligence & Data Science', hod: 'Dr. Fei-Fei Li', seats: 60, present: 57, absent: 3, faculty: 11, subjects: 8, avgAttendance: '95.0%', avgMarks: '89.5%', upcomingExams: 3 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/departments');
      if (res.data.success) {
        const fetched = res.data.data.departments || res.data.data || [];
        // Merge with default 11 if missing
        const codeMap = new Map(fetched.map((d) => [d.code, d]));
        const merged = defaultAll11Depts.map((d) => {
          const found = codeMap.get(d.code);
          return found ? { ...d, ...found, _id: found._id || d.code } : { ...d, _id: d.code };
        });
        setDepartments(merged);
      } else {
        setDepartments(defaultAll11Depts.map((d) => ({ ...d, _id: d.code })));
      }
    } catch (err) {
      setDepartments(defaultAll11Depts.map((d) => ({ ...d, _id: d.code })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate 60 Students for selected department section roster
  const get60StudentsRoster = (deptCode) => {
    const list = [];
    for (let i = 1; i <= 60; i++) {
      const numStr = i.toString().padStart(3, '0');
      const studentId = `${deptCode}${numStr}`;
      const att = Math.min(100, Math.max(65, 82 + (i % 17) - (i % 5)));
      const marks = Math.min(100, Math.max(60, 78 + (i % 21)));
      list.push({
        id: studentId,
        rollNumber: studentId,
        name: `Student ${i} (${deptCode})`,
        attendance: `${att.toFixed(1)}%`,
        attendanceVal: att,
        marks: `${marks.toFixed(1)}%`,
        status: att >= 75 ? 'ELIGIBLE' : 'SHORTAGE',
        projectStatus: i % 3 === 0 ? 'Completed' : i % 2 === 0 ? 'Development' : 'Planning',
      });
    }
    return list;
  };

  if (loading) {
    return <LoadingSpinner text="Loading academic departments & section quotas..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#A95763]" />
            Academic Departments & 60-Student Section Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5">
            11 Core academic divisions, section quotas, attendance averages, subject metrics, and department dashboards
          </p>
        </div>
      </div>

      {/* 11 Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.code || dept._id}
            className="bg-white rounded-3xl border border-[#F0D9D5] p-6 shadow-sm hover:shadow-peach-md transition-all flex flex-col justify-between group card-hover hover:border-[#EFA7B5]"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-black text-[#A95763] bg-[#FFF5F1] px-3 py-1 rounded-xl border border-[#F0D9D5]">
                  {dept.code}
                </span>
                <Badge variant="success" size="sm">
                  Section Capacity: 60
                </Badge>
              </div>

              <h3 className="text-lg font-black text-[#2D2526] mb-1 group-hover:text-[#A95763] transition-colors">
                {dept.name}
              </h3>
              <p className="text-xs text-[#6F6264] font-medium mb-4">
                HOD: {dept.hodName || dept.hod || 'Dr. Arthur Vance'}
              </p>

              {/* Attendance & Performance Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 bg-[#FFF5F1] rounded-2xl border border-[#F0D9D5]">
                  <span className="text-[#6F6264] font-semibold block text-[11px]">Attendance</span>
                  <span className="font-black text-[#A95763] text-sm">
                    {dept.avgAttendance || '91.6%'}
                  </span>
                  <div className="text-[10px] text-[#6F6264] font-medium mt-0.5">
                    P: {dept.present || 55} | A: {dept.absent || 5}
                  </div>
                </div>

                <div className="p-3 bg-[#FFF5F1] rounded-2xl border border-[#F0D9D5]">
                  <span className="text-[#6F6264] font-semibold block text-[11px]">Avg Marks</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {dept.avgMarks || '84.2%'}
                  </span>
                  <div className="text-[10px] text-[#6F6264] font-medium mt-0.5">
                    Exams: {dept.upcomingExams || 2} Pending
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0D9D5] flex items-center justify-between">
              <div className="text-xs text-[#6F6264] font-semibold">
                Faculty: <span className="text-[#2D2526] font-bold">{dept.faculty || 10}</span> | Subjects: <span className="text-[#2D2526] font-bold">{dept.subjects || 7}</span>
              </div>

              <button
                onClick={() => setSelectedDeptDashboard(dept)}
                className="peach-button-primary !px-3 !py-1.5 space-x-1"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DEPARTMENT DASHBOARD MODAL */}
      <Modal
        isOpen={!!selectedDeptDashboard}
        onClose={() => setSelectedDeptDashboard(null)}
        title={`${selectedDeptDashboard?.name} (${selectedDeptDashboard?.code})`}
        subtitle="Department Dashboard & 60-Student Section Roster"
        maxWidth="max-w-5xl"
      >
        {selectedDeptDashboard && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Department Summary Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div>
                <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
                  Department Operational Overview
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedDeptDashboard.name}
                </h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  Section Code: {selectedDeptDashboard.code} • Section Capacity: 60 Enrolled Students
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-[10px] text-white/90 uppercase block">Present</span>
                  <span className="text-lg font-black">{selectedDeptDashboard.present || 55}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-[10px] text-white/90 uppercase block">Absent</span>
                  <span className="text-lg font-black">{selectedDeptDashboard.absent || 5}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-[10px] text-white/90 uppercase block">Avg Score</span>
                  <span className="text-lg font-black">{selectedDeptDashboard.avgMarks || '84.2%'}</span>
                </div>
              </div>
            </div>

            {/* Section Roster Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Filter student ID (e.g. CSE001)..."
                  className="peach-input pl-9"
                />
              </div>

              <span className="text-xs font-bold text-[#6F6264]">
                Displaying 60 Allocated Section Students
              </span>
            </div>

            {/* 60 Student Roster Table */}
            <div className="overflow-x-auto border border-[#F0D9D5] rounded-2xl max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF5F1] text-[#A95763] font-bold uppercase tracking-wider text-[11px] sticky top-0 border-b border-[#F0D9D5]">
                  <tr>
                    <th className="py-3 px-4">Student ID / Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Attendance %</th>
                    <th className="py-3 px-4">Average Marks %</th>
                    <th className="py-3 px-4">Project Status</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0D9D5]/60 font-medium text-[#2D2526]">
                  {get60StudentsRoster(selectedDeptDashboard.code)
                    .filter(
                      (s) =>
                        s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.name.toLowerCase().includes(studentSearch.toLowerCase())
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-[#FFF5F1]/50">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#A95763]">{st.id}</td>
                        <td className="py-2.5 px-4 font-bold text-[#2D2526]">{st.name}</td>
                        <td className="py-2.5 px-4 font-extrabold text-[#2D2526]">{st.attendance}</td>
                        <td className="py-2.5 px-4 font-extrabold text-emerald-700">{st.marks}</td>
                        <td className="py-2.5 px-4">{st.projectStatus}</td>
                        <td className="py-2.5 px-4">
                          <Badge
                            variant={st.attendanceVal >= 75 ? 'success' : 'danger'}
                            size="sm"
                          >
                            {st.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentsPage;

