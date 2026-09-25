import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard, DashboardCard } from '../components/Cards';
import { LoadingSpinner, Badge } from '../components/UIStates';
import {
  Users,
  UserCheck,
  Building2,
  CalendarCheck,
  BookOpen,
  Briefcase,
  Award,
  Calendar,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Clock,
  TrendingUp,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch analytics & notifications
        const [dashRes, notifsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/communication/announcements?limit=5'),
        ]);

        setData({
          analytics: dashRes.data.data,
          announcements: notifsRes.data.data.announcements || [],
        });
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Preparing your campus dashboard..." fullScreen />;
  }

  const role = user?.role;
  const stats = data?.analytics?.summary || {};
  const announcements = data?.announcements || [];

  // Colors for charts
  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const attendanceTrendData = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 95 },
    { day: 'Thu', attendance: 91 },
    { day: 'Fri', attendance: 86 },
    { day: 'Sat', attendance: 94 },
  ];

  const deptDistribution = [
    { name: 'Computer Sci', students: 480 },
    { name: 'Electronics', students: 320 },
    { name: 'Mechanical', students: 240 },
    { name: 'Civil Eng', students: 180 },
    { name: 'Information Tech', students: 300 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white backdrop-blur-md border border-white/20">
                {role?.replace('_', ' ')} PORTAL
              </span>
              <span className="text-xs text-brand-200">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-200/90 max-w-xl">
              {role === 'ADMIN' &&
                'Campus administration is operational. You have full oversight of students, faculty, academics, and drives.'}
              {role === 'FACULTY' &&
                'Manage your lecture attendance, review assignments, and record student marks efficiently.'}
              {role === 'STUDENT' &&
                'Track your attendance, view class timetables, submit assignments, and apply for campus placements.'}
              {role === 'PLACEMENT_OFFICER' &&
                'Monitor corporate drives, shortlists, company recruitment pipelines, and eligible candidates.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {role === 'STUDENT' && (
              <Link
                to="/attendance"
                className="px-4 py-2 bg-white text-brand-900 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-brand-50 transition-all flex items-center space-x-1.5"
              >
                <CalendarCheck className="w-4 h-4 text-brand-600" />
                <span>My Attendance</span>
              </Link>
            )}
            {role === 'FACULTY' && (
              <Link
                to="/attendance"
                className="px-4 py-2 bg-white text-brand-900 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-brand-50 transition-all flex items-center space-x-1.5"
              >
                <CalendarCheck className="w-4 h-4 text-brand-600" />
                <span>Mark Attendance</span>
              </Link>
            )}
            {(role === 'ADMIN' || role === 'PLACEMENT_OFFICER') && (
              <Link
                to="/placements"
                className="px-4 py-2 bg-white text-brand-900 font-bold text-xs sm:text-sm rounded-xl shadow hover:bg-brand-50 transition-all flex items-center space-x-1.5"
              >
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span>Placement Drives</span>
              </Link>
            )}
            <Link
              to="/events"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Campus Events</span>
            </Link>
          </div>
        </div>

        {/* Ambient decorative lighting */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === 'ADMIN' && (
          <>
            <StatCard
              title="Total Enrolled Students"
              value={stats.totalStudents ?? stats.studentsCount ?? '1,248'}
              subtitle="Active across all branches"
              icon={Users}
              color="brand"
              trend="+12% this term"
            />
            <StatCard
              title="Faculty Members"
              value={stats.totalFaculty ?? stats.facultyCount ?? '84'}
              subtitle="Professors & Instructors"
              icon={UserCheck}
              color="emerald"
            />
            <StatCard
              title="Departments & Programs"
              value={stats.totalDepartments ?? stats.departmentsCount ?? '8'}
              subtitle="Active academic divisions"
              icon={Building2}
              color="purple"
            />
            <StatCard
              title="Active Placement Drives"
              value={stats.totalDrives ?? stats.placementDrivesCount ?? '14'}
              subtitle="Partner company recruitments"
              icon={Briefcase}
              color="amber"
            />
          </>
        )}

        {role === 'STUDENT' && (
          <>
            <StatCard
              title="My Overall Attendance"
              value="89.4%"
              subtitle="Safe (Above 75% cutoff)"
              icon={CalendarCheck}
              color="emerald"
              trend="Good standing"
            />
            <StatCard
              title="Current CGPA"
              value={profile?.cgpa ? `${profile.cgpa} / 10` : '8.65 / 10'}
              subtitle="Semester 6 cumulative"
              icon={Award}
              color="brand"
            />
            <StatCard
              title="Pending Assignments"
              value="2 Due"
              subtitle="Cloud Computing & AI"
              icon={FileText}
              color="amber"
            />
            <StatCard
              title="Placement Drives Open"
              value={stats.placementDrivesCount ?? '6'}
              subtitle="Eligible to apply"
              icon={Briefcase}
              color="purple"
            />
          </>
        )}

        {role === 'FACULTY' && (
          <>
            <StatCard
              title="Assigned Classes"
              value="4 Subjects"
              subtitle="CS301, CS304, CS402, CS405"
              icon={BookOpen}
              color="brand"
            />
            <StatCard
              title="Average Class Attendance"
              value="91.2%"
              subtitle="Across all lecture sections"
              icon={CalendarCheck}
              color="emerald"
            />
            <StatCard
              title="Active Assignments"
              value="5 Active"
              subtitle="18 pending evaluations"
              icon={FileText}
              color="amber"
            />
            <StatCard
              title="Upcoming Exams"
              value="2 Scheduled"
              subtitle="Mid-Term Assessment"
              icon={Award}
              color="purple"
            />
          </>
        )}

        {role === 'PLACEMENT_OFFICER' && (
          <>
            <StatCard
              title="Active Drives"
              value={stats.placementDrivesCount ?? '14'}
              subtitle="On-Campus recruitment"
              icon={Briefcase}
              color="brand"
            />
            <StatCard
              title="Partner Companies"
              value={stats.companiesCount ?? '32'}
              subtitle="Tier 1 & MNC Partners"
              icon={Building2}
              color="emerald"
            />
            <StatCard
              title="Students Placed"
              value="214"
              subtitle="84% of eligible cohort"
              icon={UserCheck}
              color="purple"
              trend="+18% vs last year"
            />
            <StatCard
              title="Highest CTC Package"
              value="$145,000"
              subtitle="Average: $78,500"
              icon={Award}
              color="amber"
            />
          </>
        )}
      </div>

      {/* Main Dashboard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Charts & Key Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Trend Chart */}
          <DashboardCard
            title="Weekly Attendance & Engagement Trend"
            subtitle="Real-time campus biometric & lecture hall attendance rate (%)"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    name="Attendance %"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#attendanceColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Quick Action Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/timetable"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all group flex items-start space-x-3.5"
            >
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Class Timetable
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">View today's lecture schedule & room numbers</p>
              </div>
            </Link>

            <Link
              to="/assignments"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all group flex items-start space-x-3.5"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Assignments
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Check deadlines, submissions & evaluation marks</p>
              </div>
            </Link>

            <Link
              to="/exams"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-brand-500/40 hover:shadow-md transition-all group flex items-start space-x-3.5"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Exams & Grades
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Access hall tickets, semester results & CGPA</p>
              </div>
            </Link>
          </div>

          {/* Department Student Distribution */}
          {role === 'ADMIN' && (
            <DashboardCard
              title="Department Academic Strength"
              subtitle="Student enrollment distribution across core engineering & tech departments"
            >
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deptDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        border: 'none',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="students" name="Students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          )}
        </div>

        {/* Right Column: Announcements, Events & Quick Status */}
        <div className="space-y-6">
          {/* Campus Announcements Board */}
          <DashboardCard
            title="Official Announcements"
            subtitle="Latest circulars and university notices"
            action={
              <Link
                to="/announcements"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            }
          >
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent announcements posted</p>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={
                          item.priority === 'URGENT'
                            ? 'danger'
                            : item.category === 'ACADEMIC'
                            ? 'primary'
                            : 'default'
                        }
                        size="sm"
                      >
                        {item.category}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>

          {/* Quick System Support & Services */}
          <DashboardCard title="Campus Services" subtitle="Quick access to student & faculty assistance">
            <div className="space-y-2 text-xs">
              <Link
                to="/certificates"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-brand-600">Request Certificate</p>
                    <p className="text-[11px] text-slate-400">Bonafide, LOR, Transcripts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/complaints"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-amber-600">Grievance Redressal</p>
                    <p className="text-[11px] text-slate-400">Submit ticket & track resolution</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/internships"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-emerald-600">Internship Portal</p>
                    <p className="text-[11px] text-slate-400">Summer & winter industry roles</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};
