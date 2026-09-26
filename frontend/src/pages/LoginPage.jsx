import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Sparkles,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Register State
  const [registerData, setRegisterData] = useState({
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

  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get('/academic/departments');
        if (res.data.success) {
          const depts = res.data.data.departments || [];
          setDepartments(depts);
          if (depts.length > 0) {
            setRegisterData((prev) => ({ ...prev, departmentId: depts[0]._id }));
          }
        }
      } catch (err) {
        // silent
      }
    };
    fetchDepts();
  }, []);

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back to College Management System!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      setLoading(true);
      await register(registerData);
      toast.success('Account created successfully! Welcome to College Management System.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (demoEmail, demoPassword) => {
    setActiveTab('login');
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const demoAccounts = [
    {
      role: 'Administrator',
      name: 'Dr. Arthur Vance (Dean)',
      email: 'admin@campusflow.edu',
      pass: 'Admin@123',
      icon: ShieldCheck,
      color: 'from-[#A95763] to-[#7E3B46]',
    },
    {
      role: 'Faculty / Professor',
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusflow.edu',
      pass: 'Faculty@123',
      icon: UserCheck,
      color: 'from-[#E27B88] to-[#A95763]',
    },
    {
      role: 'Student',
      name: 'Alex Rivera (B.Tech CS)',
      email: 'student@campusflow.edu',
      pass: 'Student@123',
      icon: GraduationCap,
      color: 'from-[#D9828B] to-[#EFA7B5]',
    },
    {
      role: 'Placement Officer',
      name: 'Marcus Sterling',
      email: 'placement@campusflow.edu',
      pass: 'Placement@123',
      icon: Briefcase,
      color: 'from-[#A95763] to-[#52222A]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F1] via-[#F0D9D5]/40 to-[#FFD6C9]/50 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing peach orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#F4A6A6]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-[#EFA7B5]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E27B88] via-[#F4A6A6] to-[#D9828B] text-white shadow-lg shadow-[#F4A6A6]/30 mb-3 ring-4 ring-white/60">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-[#2D2526] tracking-tight">College Management System</h2>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-[#A95763]">
          Unified Smart Campus Portal • Peach Pink Edition
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-xl py-7 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#F0D9D5]">
          {/* Top Interactive Tabs: Sign In / Create Account */}
          <div className="flex rounded-2xl bg-[#FFF5F1] p-1.5 mb-6 border border-[#F0D9D5]">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#E27B88] to-[#A95763] text-white shadow-md shadow-[#F4A6A6]/30'
                  : 'text-[#6F6264] hover:text-[#2D2526]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#E27B88] to-[#A95763] text-white shadow-md shadow-[#F4A6A6]/30'
                  : 'text-[#6F6264] hover:text-[#2D2526]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {/* SIGN IN TAB */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                  Campus Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A95763]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campusflow.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] hover:from-[#A95763] hover:to-[#7E3B46] text-white font-extrabold rounded-xl shadow-lg shadow-[#F4A6A6]/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 group text-xs sm:text-sm"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to College Management System'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 outline-none"
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
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="jane@campusflow.edu"
                      className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A95763]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Role *
                  </label>
                  <select
                    value={registerData.role}
                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] font-bold outline-none"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="PLACEMENT_OFFICER">Placement Officer</option>
                  </select>
                </div>
              </div>

              {departments.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                    Department *
                  </label>
                  <select
                    value={registerData.departmentId}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, departmentId: e.target.value })
                    }
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

              {registerData.role === 'STUDENT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={registerData.rollNumber}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, rollNumber: e.target.value })
                      }
                      placeholder="CS2026045"
                      className="w-full px-3 py-2 bg-[#FFF5F1]/50 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A95763] mb-1">
                      Semester
                    </label>
                    <select
                      value={registerData.semester}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, semester: Number(e.target.value) })
                      }
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] hover:from-[#A95763] hover:to-[#7E3B46] text-white font-extrabold rounded-xl shadow-lg shadow-[#F4A6A6]/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-xs sm:text-sm"
              >
                <span>{loading ? 'Creating Account...' : 'Complete & Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Profiles */}
          <div className="mt-6 pt-5 border-t border-[#F0D9D5]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-extrabold text-[#A95763] uppercase tracking-wider flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-[#E27B88] mr-1.5" />
                1-Click Quick Demo Profiles
              </span>
              <span className="text-[11px] font-semibold text-[#6F6264]">Click to autofill</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((demo, idx) => {
                const Icon = demo.icon;
                const isSelected = email === demo.email && activeTab === 'login';
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => fillQuickLogin(demo.email, demo.pass)}
                    className={`p-2.5 rounded-2xl border text-left flex items-start space-x-2.5 transition-all ${
                      isSelected
                        ? 'border-[#E27B88] bg-[#FFF5F1] ring-2 ring-[#F4A6A6]/30 shadow-sm'
                        : 'border-[#F0D9D5] bg-white hover:bg-[#FFF5F1]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${demo.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#2D2526] truncate">{demo.role}</p>
                      <p className="text-[11px] text-[#6F6264] truncate">{demo.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
