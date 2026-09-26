import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, DashboardCard } from '../components/Cards';
import { LoadingSpinner, Badge } from '../components/UIStates';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  CalendarCheck,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Analytics load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Computing university intelligence metrics..." fullScreen />;
  }

  const attendanceData = [
    { month: 'Jan', rate: 94 },
    { month: 'Feb', rate: 91 },
    { month: 'Mar', rate: 89 },
    { month: 'Apr', rate: 95 },
    { month: 'May', rate: 93 },
    { month: 'Jun', rate: 96 },
  ];

  const placementSalaryData = [
    { range: '< $60k', count: 18 },
    { range: '$60k-$90k', count: 64 },
    { range: '$90k-$120k', count: 92 },
    { range: '$120k-$150k', count: 48 },
    { range: '$150k+', count: 22 },
  ];

  const deptPerformanceData = [
    { dept: 'CSE', avgCgpa: 8.72, passRate: 98 },
    { dept: 'ECE', avgCgpa: 8.41, passRate: 95 },
    { dept: 'MECH', avgCgpa: 8.15, passRate: 92 },
    { dept: 'CIVIL', avgCgpa: 8.04, passRate: 91 },
    { dept: 'IT', avgCgpa: 8.63, passRate: 97 },
  ];

  const grievancePieData = [
    { name: 'Resolved', value: 78, color: '#10b981' },
    { name: 'In Review', value: 16, color: '#6366f1' },
    { name: 'Pending', value: 6, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#E27B88]" />
            Institutional Analytics & Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Key operational metrics, academic performance trends, placement records, and campus KPIs
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-[#FFF5F1] border border-[#F0D9D5] text-[#A95763] font-bold text-xs rounded-xl self-start sm:self-auto">
          Academic Year 2025-2026
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value="89.6%"
          subtitle="244 / 272 eligible placed"
          icon={Briefcase}
          color="peach"
          trend="+8.2% YoY"
        />
        <StatCard
          title="Average Campus CGPA"
          value="8.42"
          subtitle="Across all active engineering batches"
          icon={Award}
          color="rose"
          trend="+0.3 pts"
        />
        <StatCard
          title="Student-Faculty Ratio"
          value="15 : 1"
          subtitle="Accreditation tier-1 standard"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Grievance Resolution Rate"
          value="94.2%"
          subtitle="Average turnaround: 2.1 days"
          icon={CalendarCheck}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Packages Distribution */}
        <DashboardCard
          title="Placement CTC Compensation Distribution"
          subtitle="Annual package brackets received by graduating engineering cohort"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementSalaryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0D9D5" />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 11, fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2526',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Placed Students" fill="#E27B88" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Attendance Trends */}
        <DashboardCard
          title="Monthly Biometric Attendance Consistency"
          subtitle="Average percentage attendance across lecture terms"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A6A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F4A6A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0D9D5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2526',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Attendance %"
                  stroke="#E27B88"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rateColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Department CGPA Matrix */}
        <DashboardCard
          title="Departmental Academic Performance & CGPA"
          subtitle="Comparative analysis of average CGPA across faculties"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0D9D5" />
                <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fill: '#A95763', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2526',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="avgCgpa" name="Avg CGPA (/10)" fill="#D9828B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Grievance Resolution Health */}
        <DashboardCard
          title="Student Support & Grievance Resolution Ratio"
          subtitle="Operational status breakdown of all registered campus support tickets"
        >
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Resolved', value: 78, color: '#10b981' },
                    { name: 'In Review', value: 16, color: '#E27B88' },
                    { name: 'Pending', value: 6, color: '#f59e0b' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Resolved', value: 78, color: '#10b981' },
                    { name: 'In Review', value: 16, color: '#E27B88' },
                    { name: 'Pending', value: 6, color: '#f59e0b' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2D2526',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
