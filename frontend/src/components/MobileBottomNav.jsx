import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Calendar,
  User,
  Briefcase,
  Users,
} from 'lucide-react';

export const MobileBottomNav = () => {
  const { user } = useAuth();
  const role = user?.role;

  const getNavTabs = () => {
    if (role === 'PLACEMENT_OFFICER') {
      return [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Drives', path: '/placements', icon: Briefcase },
        { name: 'Students', path: '/students', icon: Users },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (role === 'ADMIN') {
      return [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Students', path: '/students', icon: Users },
        { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    if (role === 'FACULTY') {
      return [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
        { name: 'Assignments', path: '/assignments', icon: BookOpen },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    }

    // Default for Student
    return [
      { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
      { name: 'Academics', path: '/assignments', icon: BookOpen },
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Profile', path: '/profile', icon: User },
    ];
  };

  const tabs = getNavTabs();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#F0D9D5] px-2 py-1.5 lg:hidden shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#A95763] font-bold bg-[#FFF5F1]'
                    : 'text-[#6F6264] hover:text-[#2D2526]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
