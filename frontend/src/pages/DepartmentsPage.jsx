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
} from 'lucide-react';

export const DepartmentsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    hod: 'Dr. Arthur Vance',
    description: '',
    intakeCapacity: 120,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic/departments');
      if (res.data.success) {
        setDepartments(res.data.data.departments || []);
      }
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) {
      toast.error('Please enter department name and code');
      return;
    }

    try {
      const res = await api.post('/academic/departments', newDept);
      if (res.data.success) {
        toast.success('Department created successfully!');
        setIsAddModalOpen(false);
        setNewDept({
          name: '',
          code: '',
          hod: 'Dr. Arthur Vance',
          description: '',
          intakeCapacity: 120,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading departments catalog..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-brand-600" />
            Academic Departments & Faculties
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Engineering divisions, department heads (HODs), student intake quotas, and facilities
          </p>
        </div>

        {role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No academic departments found"
              description="Add a department division using the button above."
            />
          </div>
        ) : (
          departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                    {dept.code}
                  </span>
                  <Badge variant="indigo" size="sm">
                    Active Dept
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                  {dept.description ||
                    'Advanced curriculum in core principles, laboratory research, and industrial partnerships.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Department HOD:</span>
                  <span className="font-bold text-slate-800">{dept.hod || 'Dr. Arthur Vance'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Annual Intake Quota:</span>
                  <span className="font-bold text-brand-600">
                    {dept.intakeCapacity || 120} Seats
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Academic Department"
        subtitle="Establish a new department division"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              placeholder="e.g. Department of Computer Science & Engineering"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department Code *</label>
              <input
                type="text"
                required
                value={newDept.code}
                onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                placeholder="CSE"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Intake Capacity</label>
              <input
                type="number"
                value={newDept.intakeCapacity}
                onChange={(e) =>
                  setNewDept({ ...newDept, intakeCapacity: Number(e.target.value) })
                }
                placeholder="120"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Head of Department (HOD)</label>
            <input
              type="text"
              value={newDept.hod}
              onChange={(e) => setNewDept({ ...newDept, hod: e.target.value })}
              placeholder="Dr. Arthur Vance, Ph.D"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Mission</label>
            <textarea
              rows={3}
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              placeholder="Overview of research labs, specialized fields, and accreditations..."
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
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
