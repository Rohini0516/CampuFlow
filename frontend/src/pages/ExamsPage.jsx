import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { DashboardCard, StatCard } from '../components/Cards';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Award,
  Calendar,
  Clock,
  Plus,
  BookOpen,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export const ExamsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mark Entry Modal (Faculty)
  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [marksState, setMarksState] = useState({});

  // Schedule Exam Modal (Admin)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    name: '',
    type: 'MID_TERM',
    subjectId: '',
    date: '',
    startTime: '09:30',
    endTime: '12:30',
    totalMarks: 100,
    passingMarks: 40,
    room: 'Hall A-204',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, subjRes] = await Promise.all([
        api.get('/exams'),
        api.get('/academic/subjects'),
      ]);

      if (examsRes.data.success) {
        setExams(examsRes.data.data.exams || []);
      }
      if (subjRes.data.success) {
        const subs = subjRes.data.data.subjects || [];
        setSubjects(subs);
        if (subs.length > 0) {
          setNewExam((prev) => ({ ...prev, subjectId: subs[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleExam = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/exams', newExam);
      if (res.data.success) {
        toast.success('Exam scheduled successfully');
        setScheduleModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule exam');
    }
  };

  const handleOpenMarksEntry = async (exam) => {
    setSelectedExamForMarks(exam);
    try {
      const res = await api.get('/students');
      if (res.data.success) {
        const students = res.data.data.students || [];
        setStudentList(students);
        const init = {};
        students.forEach((s) => {
          init[s._id] = 85;
        });
        setMarksState(init);
        setMarkModalOpen(true);
      }
    } catch (err) {
      toast.error('Failed to load class students');
    }
  };

  const handleSaveBatchMarks = async (e) => {
    e.preventDefault();
    try {
      const marksPayload = Object.keys(marksState).map((studentId) => ({
        studentId,
        marksObtained: Number(marksState[studentId]),
        grade: Number(marksState[studentId]) >= 90 ? 'A+' : Number(marksState[studentId]) >= 80 ? 'A' : 'B',
      }));

      await api.post(`/exams/${selectedExamForMarks._id}/marks`, { marks: marksPayload });
      toast.success('Marks recorded and report cards updated!');
      setMarkModalOpen(false);
    } catch (err) {
      toast.error('Failed to record marks');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading examination schedules..." fullScreen />;
  }

  // Student Report Card Demo Data
  const studentResults = [
    { code: 'CS301', subject: 'Data Structures & Algorithms', credits: 4, marks: 94, grade: 'A+' },
    { code: 'CS302', subject: 'Database Management Systems', credits: 4, marks: 88, grade: 'A' },
    { code: 'CS303', subject: 'Computer Networks', credits: 3, marks: 82, grade: 'A' },
    { code: 'CS304', subject: 'Software Engineering', credits: 3, marks: 90, grade: 'A+' },
    { code: 'CS305', subject: 'Cloud Computing Architecture', credits: 4, marks: 78, grade: 'B+' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-[#E27B88]" />
            Examinations & Academic Grading
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            {role === 'STUDENT'
              ? 'View semester schedules, hall tickets, and cumulative grade point performance'
              : 'Examination controller, assessment schedules, and marks entry'}
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="peach-button-primary text-xs sm:text-sm flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Examination</span>
          </button>
        )}
      </div>

      {/* STUDENT REPORT CARD SECTION */}
      {role === 'STUDENT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Current Semester SGPA"
              value="8.84"
              subtitle="Ranked top 5% in Department"
              icon={Award}
              color="emerald"
            />
            <StatCard
              title="Cumulative CGPA"
              value="8.65"
              subtitle="All 6 semesters aggregate"
              icon={TrendingUp}
              color="peach"
            />
            <StatCard
              title="Earned Credits"
              value="128 Credits"
              subtitle="On track for graduation"
              icon={FileCheck}
              color="rose"
            />
          </div>

          <DashboardCard
            title="Semester Grade Sheet & Results"
            subtitle="Official internal and end-semester transcript"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#F0D9D5] bg-[#FFF5F1]">
                    <th className="py-3 px-4 font-bold text-[#A95763]">Course Code</th>
                    <th className="py-3 px-4 font-bold text-[#A95763]">Subject Name</th>
                    <th className="py-3 px-4 font-bold text-[#A95763]">Credits</th>
                    <th className="py-3 px-4 font-bold text-[#A95763]">Marks</th>
                    <th className="py-3 px-4 font-bold text-[#A95763] text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0D9D5] font-medium">
                  {studentResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FFF5F1]/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#E27B88]">{row.code}</td>
                      <td className="py-3 px-4 font-semibold text-[#2D2526]">{row.subject}</td>
                      <td className="py-3 px-4 text-[#6F6264]">{row.credits}</td>
                      <td className="py-3 px-4 text-[#2D2526]">{row.marks} / 100</td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={row.grade === 'A+' ? 'success' : 'peach'}
                          size="sm"
                        >
                          {row.grade}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      )}

      {/* SCHEDULED EXAMINATIONS GRID */}
      <div>
        <h2 className="text-base font-bold text-[#2D2526] mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#E27B88]" />
          Scheduled Examination Timetable
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No upcoming exams scheduled"
                description="Exam timetables will appear here once published by the dean's office."
              />
            </div>
          ) : (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="p-5 rounded-3xl bg-white border border-[#F0D9D5] shadow-sm hover:shadow-md hover:border-[#EFA7B5] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#A95763] bg-[#FFF5F1] px-2.5 py-1 rounded-xl border border-[#F0D9D5]">
                      {exam.subjectId?.code || 'CS301'}
                    </span>
                    <Badge variant="peach" size="sm">
                      {exam.type || 'MID_TERM'}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-[#2D2526] text-base mb-1">{exam.name}</h3>
                  <p className="text-xs text-[#6F6264] font-medium mb-3">
                    {exam.subjectId?.name || 'Algorithms & Data Structures'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0D9D5] space-y-2 text-xs text-[#6F6264]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A95763]" />
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A95763]" />
                      <span>{exam.startTime} - {exam.endTime}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A95763]" />
                      <span>{exam.room || 'Hall A-201'}</span>
                    </span>
                    <span className="font-bold text-[#2D2526]">Max: {exam.totalMarks} Marks</span>
                  </div>

                  {role === 'FACULTY' && (
                    <button
                      onClick={() => handleOpenMarksEntry(exam)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-[#FFF5F1] hover:bg-[#E27B88] hover:text-white text-[#A95763] font-bold text-xs border border-[#F0D9D5] transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Record Student Marks</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Examination"
        subtitle="Publish a midterm or final exam slot"
      >
        <form onSubmit={handleScheduleExam} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-[#2D2526] mb-1">Exam Title *</label>
            <input
              type="text"
              required
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
              placeholder="e.g. Mid-Semester Theory Exam 2026"
              className="w-full peach-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Subject *</label>
              <select
                value={newExam.subjectId}
                onChange={(e) => setNewExam({ ...newExam, subjectId: e.target.value })}
                className="w-full peach-input"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Exam Category</label>
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                className="w-full peach-input"
              >
                <option value="MID_TERM">Mid-Term Assessment</option>
                <option value="END_TERM">End-Term Final</option>
                <option value="LAB_PRACTICAL">Lab Practical</option>
                <option value="QUIZ">Internal Quiz</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Date *</label>
              <input
                type="date"
                required
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Start Time</label>
              <input
                type="time"
                value={newExam.startTime}
                onChange={(e) => setNewExam({ ...newExam, startTime: e.target.value })}
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">End Time</label>
              <input
                type="time"
                value={newExam.endTime}
                onChange={(e) => setNewExam({ ...newExam, endTime: e.target.value })}
                className="w-full peach-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Examination Hall</label>
              <input
                type="text"
                value={newExam.room}
                onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                placeholder="Hall B-102"
                className="w-full peach-input"
              />
            </div>
            <div>
              <label className="block font-bold text-[#2D2526] mb-1">Total Marks</label>
              <input
                type="number"
                value={newExam.totalMarks}
                onChange={(e) =>
                  setNewExam({ ...newExam, totalMarks: Number(e.target.value) })
                }
                className="w-full peach-input"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="peach-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </Modal>

      {/* Marks Entry Modal */}
      <Modal
        isOpen={markModalOpen}
        onClose={() => setMarkModalOpen(false)}
        title={`Record Marks: ${selectedExamForMarks?.name || ''}`}
        subtitle="Enter evaluation scores for each student"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveBatchMarks} className="space-y-4">
          <div className="max-h-80 overflow-y-auto divide-y divide-[#F0D9D5] pr-1">
            {studentList.map((st) => (
              <div key={st._id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#2D2526] text-xs sm:text-sm">
                    {st.userId?.name || 'Alex Rivera'}
                  </p>
                  <p className="font-mono text-[11px] text-[#6F6264]">{st.rollNumber}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={selectedExamForMarks?.totalMarks || 100}
                    value={marksState[st._id] ?? ''}
                    onChange={(e) =>
                      setMarksState({ ...marksState, [st._id]: e.target.value })
                    }
                    className="w-20 peach-input !py-1 !px-2.5 text-xs sm:text-sm font-bold text-right text-[#2D2526]"
                  />
                  <span className="text-xs text-[#A95763] font-bold">
                    / {selectedExamForMarks?.totalMarks || 100}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0D9D5] flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setMarkModalOpen(false)}
              className="peach-button-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="peach-button-primary text-xs"
            >
              Submit Final Grades
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
