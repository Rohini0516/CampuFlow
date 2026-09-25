import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  CalendarCheck,
  FileText,
  Award,
  Calendar,
  Briefcase,
  Layers,
  MessageSquareWarning,
  FileCheck2,
  Bell,
  Megaphone,
  BarChart3,
  Clock,
  LogOut,
  Building,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    if (role === 'ADMIN') {
      return [
        ...commonItems,
        { section: 'Academic Management' },
        { name: 'Students', path: '/students', icon: Users },
        { name: 'Faculty', path: '/faculty', icon: UserCheck },
        { name: 'Departments', path: '/departments', icon: Building2 },
        { name: 'Subjects', path: '/subjects', icon: BookOpen },
        { name: 'Timetable', path: '/timetable', icon: Clock },
        { name: 'Student Projects', path: '/projects', icon: Layers },
        { section: 'Operations' },
        { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { name: 'Examinations', path: '/exams', icon: Award },
        { name: 'Campus Events', path: '/events', icon: Calendar },
        { name: 'Placements', path: '/placements', icon: Briefcase },
        { section: 'Services & Support' },
        { name: 'Academic Reports', path: '/reports', icon: BarChart3 },
        { name: 'Grievances', path: '/complaints', icon: MessageSquareWarning },
        { name: 'Certificates', path: '/certificates', icon: FileCheck2 },
        { name: 'Announcements', path: '/announcements', icon: Megaphone },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ];
    }

    if (role === 'FACULTY') {
      return [
        ...commonItems,
        { section: 'Teaching & Classes' },
        { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { name: 'Assignments', path: '/assignments', icon: FileText },
        { name: 'Examinations & Marks', path: '/exams', icon: Award },
        { name: 'Timetable', path: '/timetable', icon: Clock },
        { name: 'Subjects', path: '/subjects', icon: BookOpen },
        { name: 'Student Projects', path: '/projects', icon: Layers },
        { section: 'Campus Life' },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Announcements', path: '/announcements', icon: Megaphone },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
      ];
    }

    if (role === 'PLACEMENT_OFFICER') {
      return [
        ...commonItems,
        { section: 'Corporate & Drives' },
        { name: 'Placement Drives', path: '/placements', icon: Briefcase },
        { name: 'Partner Companies', path: '/companies', icon: Building },
        { name: 'Internships', path: '/internships', icon: Layers },
        { name: 'Eligible Students', path: '/students', icon: Users },
        { name: 'Placement Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Announcements', path: '/announcements', icon: Megaphone },
      ];
    }

    // STUDENT
    return [
      ...commonItems,
      { section: 'My Academics' },
      { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
      { name: 'Timetable', path: '/timetable', icon: Clock },
      { name: 'Assignments', path: '/assignments', icon: FileText },
      { name: 'Exams & Results', path: '/exams', icon: Award },
      { name: 'My Projects', path: '/projects', icon: Layers },
      { section: 'Career & Opportunities' },
      { name: 'Placements', path: '/placements', icon: Briefcase },
      { name: 'Internships', path: '/internships', icon: Layers },
      { section: 'Campus & Support' },
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Grievances', path: '/complaints', icon: MessageSquareWarning },
      { name: 'Certificates', path: '/certificates', icon: FileCheck2 },
      { name: 'Announcements', path: '/announcements', icon: Megaphone },
      { name: 'Academic Reports', path: '/reports', icon: BarChart3 },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-50 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-brand-500/30 tracking-wider">
              CF
            </div>
            <div>
              <h1 className="font-black text-white text-sm tracking-tight leading-snug">
                College Management System
              </h1>
              <span className="text-[10px] font-semibold text-brand-400 tracking-wider uppercase">
                Enterprise Platform
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <p
                  key={idx}
                  className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                >
                  {item.section}
                </p>
              );
            }

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User info & Signout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b62f6&color=fff`
                }
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
