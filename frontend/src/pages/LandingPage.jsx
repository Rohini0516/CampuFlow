import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Briefcase,
  MessageSquare,
  Building2,
  Check,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
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
    <div className="min-h-screen bg-[#FFF5F1]/60 text-[#2D2526] font-sans selection:bg-[#F4A6A6] selection:text-white">
      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F0D9D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E27B88] via-[#F4A6A6] to-[#D9828B] flex items-center justify-center text-white font-extrabold shadow-md shadow-[#F4A6A6]/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-[#2D2526] text-lg sm:text-xl tracking-tight block leading-none">
                College Management System
              </span>
              <span className="text-[10px] font-bold text-[#A95763] uppercase tracking-widest block mt-0.5">
                Unified Campus Platform • Peach Pink Edition
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-[#6F6264]">
            <a href="#home" className="hover:text-[#A95763] transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-[#A95763] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#A95763] transition-colors">
              How It Works
            </a>
            <a href="#dashboard-preview" className="hover:text-[#A95763] transition-colors">
              Overview
            </a>
            <a href="#about" className="hover:text-[#A95763] transition-colors">
              About
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] hover:from-[#A95763] hover:to-[#7E3B46] text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#F4A6A6]/30 transition-all hover:shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#A95763] hover:bg-[#FFF5F1] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#F0D9D5] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#2D2526] hover:bg-[#FFF5F1]"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#2D2526] hover:bg-[#FFF5F1]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#2D2526] hover:bg-[#FFF5F1]"
            >
              How It Works
            </a>
            <a
              href="#dashboard-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#2D2526] hover:bg-[#FFF5F1]"
            >
              Overview
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#2D2526] hover:bg-[#FFF5F1]"
            >
              About
            </a>

            <div className="pt-4 border-t border-[#F0D9D5] flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center font-extrabold text-white bg-gradient-to-r from-[#E27B88] to-[#A95763] rounded-xl shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 sm:pt-20 pb-16 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#F4A6A6]/20 via-[#FFD6C9]/20 to-[#EFA7B5]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#F0D9D5] text-[#A95763] font-bold text-xs sm:text-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-[#E27B88]" />
                <span>Unified Campus Operations Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2D2526] tracking-tight leading-[1.15]">
                Smart College <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#A95763] via-[#E27B88] to-[#D9828B] bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6F6264] font-semibold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Manage students, faculty, academics, attendance, communication, and college
                operations from one unified peach-pink platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] hover:from-[#A95763] hover:to-[#7E3B46] text-white font-black text-base rounded-2xl shadow-xl shadow-[#F4A6A6]/35 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-6 border-t border-[#F0D9D5] grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#2D2526]">100%</h4>
                  <p className="text-xs font-semibold text-[#6F6264]">Role-Based Security</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#2D2526]">24/7</h4>
                  <p className="text-xs font-semibold text-[#6F6264]">E-Certificate Desk</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#2D2526]">10+</h4>
                  <p className="text-xs font-semibold text-[#6F6264]">Departments Active</p>
                </div>
              </div>
            </div>

            {/* Right Dashboard UI Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Back Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E27B88] to-[#A95763] rounded-3xl blur-xl opacity-30" />

                {/* Main Glass Card Preview */}
                <div className="relative bg-white rounded-3xl border border-[#F0D9D5] p-6 shadow-xl text-[#2D2526]">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0D9D5] mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-[#E27B88]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFD6C9]" />
                      <div className="w-3 h-3 rounded-full bg-[#EFA7B5]" />
                    </div>
                    <span className="text-[11px] font-mono text-[#A95763] font-bold uppercase tracking-wider">
                      Peach-Pink Live Portal
                    </span>
                  </div>

                  {/* Dashboard Content Mock */}
                  <div className="space-y-4">
                    {/* Top Stat Cards Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-[#FFF5F1] rounded-2xl border border-[#F0D9D5]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#6F6264]">Total Students</span>
                          <Users className="w-4 h-4 text-[#A95763]" />
                        </div>
                        <p className="text-xl font-black text-[#2D2526]">2,450</p>
                        <span className="text-[10px] text-emerald-600 font-bold">Active Enrolled</span>
                      </div>

                      <div className="p-3.5 bg-[#FFF5F1] rounded-2xl border border-[#F0D9D5]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#6F6264]">Attendance Rate</span>
                          <ClipboardCheck className="w-4 h-4 text-[#E27B88]" />
                        </div>
                        <p className="text-xl font-black text-[#2D2526]">94.2%</p>
                        <span className="text-[10px] text-[#A95763] font-bold">Daily Average</span>
                      </div>
                    </div>

                    {/* Class Schedule Mini Card */}
                    <div className="p-4 bg-gradient-to-r from-[#FFF5F1] to-[#FFD6C9]/40 rounded-2xl border border-[#F0D9D5] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-white text-[#A95763] shadow-sm border border-[#F0D9D5]">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D2526]">Advanced Web Development</h5>
                          <p className="text-[11px] text-[#6F6264]">Room 304 • Prof. Sarah Jenkins</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#E27B88] text-white text-[10px] font-extrabold">
                        ONGOING
                      </span>
                    </div>

                    {/* Recent Announcement Item */}
                    <div className="p-3.5 bg-[#FFF5F1]/80 rounded-2xl border border-[#F0D9D5] flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-white text-[#A95763] border border-[#F0D9D5] flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#2D2526] truncate">
                          Mid-Semester Exam Schedules Released
                        </p>
                        <p className="text-[11px] text-[#6F6264] truncate">
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
      <section id="features" className="py-16 sm:py-24 bg-white border-y border-[#F0D9D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#A95763] mb-2">
              Comprehensive Features
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-[#2D2526] tracking-tight">
              Everything Your College Needs in One Platform
            </p>
            <p className="text-sm sm:text-base text-[#6F6264] mt-3 font-semibold">
              Unified tools engineered to streamline academics, operations, examination management, and student communication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-[#FFF5F1]/50 border border-[#F0D9D5] hover:bg-white hover:shadow-lg hover:border-[#E27B88] transition-all card-hover flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#F0D9D5] text-[#A95763] flex items-center justify-center group-hover:bg-[#E27B88] group-hover:text-white transition-colors shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF5F1] border border-[#F0D9D5] text-[#A95763] text-[11px] font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-[#2D2526] mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#6F6264] font-medium leading-relaxed">
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
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#2D2526] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#F4A6A6] mb-2">
              Simple Workflow
            </h2>
            <p className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              How It Works
            </p>
            <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
              Get your institution onboarded in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#3C3234] border border-white/10 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#F4A6A6] block mb-4">01</span>
                <h3 className="text-xl font-bold text-white mb-2">Sign Up / Login</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Users securely access the college management platform with customized role-based credentials.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#3C3234] border border-white/10 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#F4A6A6] block mb-4">02</span>
                <h3 className="text-xl font-bold text-white mb-2">Manage & Collaborate</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Manage students, faculty, academics, timetables, attendance, and administrative records.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#3C3234] border border-white/10 relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-black text-[#F4A6A6] block mb-4">03</span>
                <h3 className="text-xl font-bold text-white mb-2">Analyze & Verify</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Use real-time dashboards, digital certificate desks, and centralized reporting to optimize operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-16 sm:py-20 bg-[#FFF5F1]/80 border-t border-[#F0D9D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#A95763]">
            About The Platform
          </h2>
          <p className="text-xl sm:text-3xl font-black text-[#2D2526] tracking-tight leading-snug">
            A unified digital platform designed to simplify academic and administrative management for modern educational institutions.
          </p>
          <p className="text-xs sm:text-sm text-[#6F6264] font-semibold leading-relaxed max-w-2xl mx-auto">
            College Management System connects students, professors, department heads, and campus leaders into one seamless, secure digital ecosystem — powering everyday campus operations with clarity and speed.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) SECTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#E27B88] via-[#F4A6A6] to-[#A95763] text-white p-8 sm:p-14 shadow-xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to simplify college management?
              </h2>
              <p className="text-sm sm:text-base text-[#FFF5F1] font-semibold">
                Bring your academic and administrative operations together in one peach-pink platform.
              </p>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#A95763] hover:bg-[#FFF5F1] font-black text-base rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 text-[#A95763]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2D2526] text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#E27B88] flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                College Management System
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-slate-300">
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
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 College Management System. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
