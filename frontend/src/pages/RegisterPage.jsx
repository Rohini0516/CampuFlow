import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    phone: '',
    departmentId: '',
    rollNumber: '',
    employeeId: '',
    designation: 'Assistant Professor',
    semester: 1,
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/academic/departments');
        if (res.data.success) {
          setDepartments(res.data.data.departments || []);
          if (res.data.data.departments?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              departmentId: res.data.data.departments[0]._id,
            }));
          }
        }
      } catch (err) {
        // fail silently
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      toast.success('Registration successful! Welcome to College Management System.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F1] via-[#F0D9D5]/40 to-[#FFD6C9]/50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing peach orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#F4A6A6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-[#EFA7B5]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E27B88] via-[#F4A6A6] to-[#D9828B] text-white shadow-lg shadow-[#F4A6A6]/30 mb-3 ring-4 ring-white/60">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-[#2D2526] tracking-tight">Join College Management System</h2>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-[#A95763]">
          Register your campus account to access academics and campus services
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-white/95 backdrop-blur-xl py-7 px-6 sm:px-8 shadow-xl rounded-3xl border border-[#F0D9D5]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@campusflow.edu"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555-0100"
                    className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] font-bold outline-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="PLACEMENT_OFFICER">Placement Officer</option>
                </select>
              </div>

              {departments.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                  >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {formData.role === 'STUDENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Roll / Register Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. CS2024045"
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {formData.role === 'FACULTY' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g. FAC-204"
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Assistant Professor"
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] hover:from-[#A95763] hover:to-[#7E3B46] text-white font-extrabold rounded-xl shadow-lg shadow-[#F4A6A6]/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#6F6264]">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#A95763] hover:text-[#7E3B46]">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
