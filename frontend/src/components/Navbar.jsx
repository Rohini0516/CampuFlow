import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  CheckCheck,
} from 'lucide-react';
import { Badge } from './UIStates';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/communication/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (err) {
      // silent catch
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/communication/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F0D9D5] px-4 sm:px-6 py-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Logo/Search */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-[#A95763] hover:bg-[#FFF5F1] transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center space-x-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E27B88] to-[#A95763] flex items-center justify-center text-white font-bold shadow-sm">
              CMS
            </div>
            <span className="font-extrabold text-[#2D2526] text-lg tracking-tight">College Management</span>
          </Link>

          <div className="hidden sm:flex items-center relative w-64 md:w-80">
            <Search className="w-4 h-4 text-[#A95763]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects, events, students..."
              className="w-full pl-9 pr-4 py-2 bg-[#FFF5F1]/80 border border-[#F0D9D5] rounded-xl text-xs sm:text-sm text-[#2D2526] placeholder-[#6F6264]/60 focus:bg-white focus:border-[#E27B88] focus:ring-2 focus:ring-[#F4A6A6]/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-[#A95763] hover:bg-[#FFF5F1] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E27B88] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#F0D9D5] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[#F0D9D5] flex items-center justify-between bg-[#FFF5F1]/60">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-[#2D2526] text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                      <Badge variant="rose" size="sm">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-[#A95763] hover:text-[#7E3B46] flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#F0D9D5]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6F6264]">
                      No notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          setShowNotifDropdown(false);
                          if (notif.link) navigate(notif.link);
                        }}
                        className={`p-3.5 hover:bg-[#FFF5F1]/50 transition-colors cursor-pointer text-left ${
                          !notif.isRead ? 'bg-[#FFF5F1]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-[#2D2526]">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#E27B88] flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-[#6F6264] mt-1 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-[#A95763]/80 mt-1.5 block">
                          {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-[#F0D9D5] bg-[#FFF5F1]/60 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifDropdown(false)}
                    className="text-xs font-bold text-[#A95763] hover:text-[#7E3B46]"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-[#FFF5F1] transition-colors border border-transparent hover:border-[#F0D9D5]"
            >
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F4A6A6&color=fff`
                }
                alt={user?.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-[#FFD6C9]"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#2D2526] line-clamp-1 leading-tight">{user?.name}</p>
                <div className="mt-0.5">
                  <Badge variant="peach" size="sm">
                    {user?.role?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#F0D9D5] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 border-b border-[#F0D9D5] bg-[#FFF5F1]">
                  <p className="text-sm font-bold text-[#2D2526]">{user?.name}</p>
                  <p className="text-xs text-[#6F6264] truncate">{user?.email}</p>
                  <div className="mt-2">
                    <Badge variant="peach" size="sm">
                      {user?.role?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="p-1.5">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-[#2D2526] hover:bg-[#FFF5F1] rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-[#A95763]" />
                    <span>My Profile & Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
