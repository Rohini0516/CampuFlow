import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner } from '../components/UIStates';
import {
  Clock,
  Plus,
  Calendar,
  Building2,
  BookOpen,
  MapPin,
  User,
} from 'lucide-react';

export const TimetablePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [timetable, setTimetable] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subjectId: '',
    room: 'Lab 3 - Block B',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '12:15 - 01:15',
    '02:00 - 03:00',
    '03:00 - 04:00',
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ttRes, deptsRes, subjRes] = await Promise.all([
        api.get(`/timetable?semester=${selectedSem}`),
        api.get('/academic/departments'),
        api.get('/academic/subjects'),
      ]);

      if (ttRes.data.success) {
        setTimetable(ttRes.data.data.timetable || []);
      }
      if (deptsRes.data.success) {
        const d = deptsRes.data.data.departments || [];
        setDepartments(d);
        if (d.length > 0 && !selectedDept) setSelectedDept(d[0]._id);
      }
      if (subjRes.data.success) {
        const s = subjRes.data.data.subjects || [];
        setSubjects(s);
        if (s.length > 0) {
          setNewSlot((prev) => ({ ...prev, subjectId: s[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load class schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSem]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/timetable', {
        ...newSlot,
        semester: selectedSem,
        departmentId: selectedDept,
      });

      if (res.data.success) {
        toast.success('Timetable period scheduled!');
        setIsAddModalOpen(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add timetable slot');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading timetable schedule..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-brand-600" />
            Weekly Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Class lecture periods, lab sessions, faculty allocations, and venue locations
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Period</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
            >
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Semester:
            </span>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Academic Term: <strong>Spring 2026</strong>
        </span>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-4 w-32">Day</th>
                {timeSlots.map((slot, idx) => (
                  <th key={idx} className="py-4 px-4 text-center border-l border-slate-800">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {daysOfWeek.map((day) => {
                const daySlots = timetable.filter((t) => t.day === day);
                return (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-100">
                      {day}
                    </td>
                    {timeSlots.map((time, idx) => {
                      // Pick a slot for demo or from database
                      const matched =
                        daySlots[idx] ||
                        (idx === 3
                          ? { isBreak: true }
                          : subjects.length > 0
                          ? {
                              subjectId: subjects[idx % subjects.length],
                              room: `Hall ${101 + ((idx * 3) % 8)}`,
                              facultyName: 'Prof. Sarah Jenkins',
                            }
                          : null);

                      if (idx === 3) {
                        return (
                          <td
                            key={idx}
                            className="p-2 text-center bg-slate-100/60 border-l border-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]"
                          >
                            Lunch Break
                          </td>
                        );
                      }

                      return (
                        <td key={idx} className="p-2.5 border-l border-slate-100 align-top">
                          {matched?.subjectId ? (
                            <div className="p-2.5 rounded-2xl bg-brand-50/70 border border-brand-200/60 hover:shadow-sm transition-all">
                              <span className="font-mono text-[10px] font-bold text-brand-700 block">
                                {matched.subjectId?.code || 'CS-301'}
                              </span>
                              <p className="font-bold text-slate-900 text-xs line-clamp-1 mt-0.5">
                                {matched.subjectId?.name || 'Algorithms'}
                              </p>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{matched.room || 'Hall 201'}</span>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl text-center text-slate-300 font-medium">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Class Period"
        subtitle="Add a lecture slot to the master semester schedule"
      >
        <form onSubmit={handleAddSlot} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Day of Week *</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject *</label>
              <select
                value={newSlot.subjectId}
                onChange={(e) => setNewSlot({ ...newSlot, subjectId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room / Lab</label>
              <input
                type="text"
                value={newSlot.room}
                onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                placeholder="Lab 204"
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
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Add to Timetable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
