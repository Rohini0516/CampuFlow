import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Bell,
  CheckCheck,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/communication/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/communication/notifications/read-all');
      toast.success('All notifications marked as read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your notification alerts..." fullScreen />;
  }

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2526] tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#E27B88]" />
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6264] mt-0.5 font-medium">
            Real-time alerts, class updates, assignment deadlines, and event invites
          </p>
        </div>

        {unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="peach-button-secondary text-xs flex items-center space-x-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-[#F0D9D5] shadow-sm overflow-hidden divide-y divide-[#F0D9D5]">
        {notifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="You're all caught up!"
              description="No new notification alerts at the moment."
            />
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => notif.link && navigate(notif.link)}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                notif.link ? 'cursor-pointer hover:bg-[#FFF5F1]/60' : ''
              } ${!notif.isRead ? 'bg-[#FFF5F1]/50' : ''}`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-[#2D2526] text-sm sm:text-base">{notif.title}</h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#E27B88] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#6F6264] leading-relaxed font-medium">{notif.message}</p>
                <div className="flex items-center space-x-3 text-[11px] text-[#A95763] pt-1 font-semibold">
                  <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {notif.link && (
                <button className="p-2 rounded-xl text-[#A95763] hover:text-[#E27B88] hover:bg-[#FFF5F1] transition-colors flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
