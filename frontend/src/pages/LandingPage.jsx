import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Award,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Clock,
  Briefcase,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  Check,
  Globe,
  Building2,
  Lock,
  UserPlus,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      desc: 'Centralized student lifecycle records, roll numbers, profiles, and academic status tracking.',
      badge: 'Core',
    },
    {
      icon: UserCheck,
      title: 'Faculty & Staff Portal',
      desc: 'Department assignments, subject allocations, cabin info, and faculty workload management.',
      badge: 'Academics',
    },
    {
      icon: ClipboardCheck,
      title: 'Attendance Tracking',
      desc: 'Real-time daily attendance recording, percentage statistics, and low-attendance warnings.',
      badge: 'Operations',
    },
    {
      icon: BookOpen,
      title: 'Course & Academic Management',
      desc: 'Departmental curriculum structure, semester subjects, and syllabus tracking.',
      badge: 'Curriculum',
    },
    {
      icon: Calendar,
      title: 'Timetable & Scheduling',
      desc: 'Interactive weekly class schedules, lecture timings, and faculty allocations.',
      badge: 'Scheduling',
    },
    {
      icon: Award,
      title: 'Examination & Marks',
      desc: 'Semester exam scheduling, grading schemes, mark entries, and transcript generation.',
      badge: 'Exams',
    },
    {
      icon: FileText,
      title: 'E-Certificates Desk',
      desc: 'Digital requests, Registrar approvals, and printable Bonafide/Transcript certificates.',
      badge: 'E-Services',
    },
    {
      icon: MessageSquare,
      title: 'Notices & Communication',
      desc: 'Campus-wide announcements, targeted department notices, and instant alert logs.',
      badge: 'Connect',
    },
    {
      icon: Briefcase,
      title: 'Placement & Internships',
      desc: 'Corporate recruiter listings, student job applications, and recruitment statistics.',
      badge: 'Careers',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control',
      desc: 'Granular permissions tailored for Administrators, Faculty, Students, and Placement Officers.',
      badge: 'Security',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      desc: 'Campus-wide enrollment insights, departmental performance graphs, and operational dashboards.',
      badge: 'Insights',
    },
    {
      icon: Building2,
      title: 'Grievance Resolution Desk',
      desc: 'Confidential student complaint submission, status tracking, and resolution logs.',
      badge: 'Support',
    },
  ];

  const benefits = [
    {
      title: 'Centralized College Information',
      desc: 'Eliminate scattered spreadsheets with a single, secure source of truth for all campus data.',
    },
    {
      title: 'Faster Administration',
      desc: 'Streamline daily administrative approvals, document requests, and student verifications.',
    },
    {
      title: 'Easy Faculty Management',
      desc: 'Assign subjects, monitor class timetables, and track departmental performance effortlessly.',
    },
    {
      title: 'Role-Based Security',
      desc: 'Protect sensitive academic records with strict enterprise-grade role authorization.',
    },
    {
      title: 'Real-Time Insights',
      desc: 'Gain instant visibility into attendance trends, exam performance, and placement drives.',
    },
    {
      title: 'Mobile & Desktop Ready',
      desc: 'Access your campus portal seamlessly across smartphones, tablets, and desktop workstations.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight block leading-none">
                College Management System
              </span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mt-0.5">
                Unified Campus Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#home" className="hover:text-brand-600 transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-brand-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </a>
            <a href="#dashboard-preview" className="hover:text-brand-600 transition-colors">
              Dashboard
            </a>
            <a href="#about" className="hover:text-brand-600 transition-colors">
              About
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-3.5 py-2 text-slate-700 hover:text-brand-600 font-bold text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-2 text-slate-700 hover:text-brand-600 font-bold text-sm transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/login?tab=register"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all hover:shadow-lg hover:shadow-brand-600/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#dashboard-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Dashboard Preview
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              About
            </a>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100"
              >
                Sign Up
              </Link>
              <Link
                to="/login?tab=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold text-white bg-brand-600 rounded-xl shadow-md"
              >
                Get Started
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-white bg-emerald-600 rounded-xl shadow-md"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-400/15 via-indigo-400/15 to-blue-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Unified Campus Operations Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Smart College <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Manage students, faculty, academics, attendance, communication, and college
                operations from one unified platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/login?tab=register"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-brand-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <GraduationCap className="w-5 h-5 text-brand-600" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-base rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <span>Sign Up</span>
                </Link>

                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Open Dashboard</span>
                  </Link>
                )}
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">100%</h4>
                  <p className="text-xs font-semibold text-slate-500">Role-Based Security</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">24/7</h4>
                  <p className="text-xs font-semibold text-slate-500">E-Certificate Desk</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">10+</h4>
                  <p className="text-xs font-semibold text-slate-500">Departments Active</p>
                </div>
              </div>
            </div>

            {/* Right Dashboard UI Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Back Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl blur-xl opacity-20" />

                {/* Main Glass Card Preview */}
                <div className="relative bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Live Portal Mockup
                    </span>
                  </div>

                  {/* Dashboard Content Mock */}
                  <div className="space-y-4">
                    {/* Top Stat Cards Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-400">Total Students</span>
                          <Users className="w-4 h-4 text-brand-400" />
                        </div>
                        <p className="text-xl font-bold text-white">2,450</p>
                        <span className="text-[10px] text-emerald-400 font-medium">Active Enrolled</span>
                      </div>

                      <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-400">Attendance Rate</span>
                          <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xl font-bold text-white">94.2%</p>
                        <span className="text-[10px] text-slate-400 font-medium">Daily Average</span>
                      </div>
                    </div>

                    {/* Class Schedule Mini Card */}
                    <div className="p-4 bg-gradient-to-r from-brand-900/60 to-indigo-900/60 rounded-2xl border border-brand-500/30 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Advanced Web Development</h5>
                          <p className="text-[11px] text-slate-300">Room 304 • Prof. Sarah Jenkins</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        ONGOING
                      </span>
                    </div>

                    {/* Recent Announcement Item */}
                    <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-800 flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">
                          Mid-Semester Exam Schedules Released
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Check exam desk for detailed timetable and seating arrangements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-2">
              Comprehensive Features
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything Your College Needs in One Platform
            </p>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Unified tools engineered to streamline academics, operations, examination management, and student communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:border-brand-300 transition-all card-hover flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-400 mb-2">
              Simple Workflow
            </h2>
            <p className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              How It Works
            </p>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Get your institution onboarded in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-brand-400 block mb-4">01</span>
                <h3 className="text-xl font-bold text-white mb-2">Sign Up / Login</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Users securely access the college management platform with customized role-based credentials.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-brand-400 block mb-4">02</span>
                <h3 className="text-xl font-bold text-white mb-2">Manage & Collaborate</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Manage students, faculty, academics, timetables, attendance, and administrative records.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-brand-400 block mb-4">03</span>
                <h3 className="text-xl font-bold text-white mb-2">Analyze & Verify</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Use real-time dashboards, digital certificate desks, and centralized reporting to optimize operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section id="dashboard-preview" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-2">
              Intuitive Interface
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Powerful Dashboard for Smarter Campus Management
            </p>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              Real-time operational metrics and quick management modules in one centralized view.
            </p>
          </div>

          {/* Interactive Visual Preview Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Campus Operational Health
                </span>
                <h3 className="text-lg font-bold text-slate-900">Academic Year 2025 - 2026</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Live Systems Connected
                </span>
              </div>
            </div>

            {/* Metric Pills Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Total Students</span>
                <span className="text-2xl font-black text-slate-900">2,450</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Active Faculty</span>
                <span className="text-2xl font-black text-slate-900">128</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Attendance Rate</span>
                <span className="text-2xl font-black text-slate-900">94.2%</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">Departments</span>
                <span className="text-2xl font-black text-slate-900">10</span>
              </div>
            </div>

            {/* Quick Access Modules Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-brand-600 text-white">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Daily Attendance</h4>
                  <p className="text-[11px] text-slate-500">Track section-wise records</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">E-Certificate Desk</h4>
                  <p className="text-[11px] text-slate-500">Issue bonafide certificates</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Placement Cell</h4>
                  <p className="text-[11px] text-slate-500">Recruiter drive scheduling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
                Practical Benefits
              </h2>
              <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Why Colleges Choose College Management System
              </p>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Designed to minimize manual paperwork, eliminate communication silos, and optimize administrative efficiency across every department.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                    <p className="text-xs text-slate-600 font-normal leading-normal">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600">
            About The Platform
          </h2>
          <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            A unified digital platform designed to simplify academic and administrative management for modern educational institutions.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            College Management System connects students, professors, department heads, and campus leaders into one seamless, secure digital ecosystem — powering everyday campus operations with clarity and speed.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) SECTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-blue-700 text-white p-8 sm:p-14 shadow-2xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to simplify college management?
              </h2>
              <p className="text-sm sm:text-base text-brand-100 font-medium">
                Bring your academic and administrative operations together in one platform.
              </p>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link
                to={isAuthenticated ? '/dashboard' : '/login?tab=register'}
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-900 hover:bg-slate-100 font-black text-base rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5 text-brand-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                College Management System
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-slate-400">
              <a href="#home" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About
              </a>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 College Management System. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
