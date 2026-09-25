import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';
import { Badge, LoadingSpinner, EmptyState } from '../components/UIStates';
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Tag,
  Sparkles,
} from 'lucide-react';

export const EventsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const role = user?.role;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [registeringId, setRegisteringId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    venue: 'Main University Auditorium',
    startDate: '',
    endDate: '',
    maxParticipants: 200,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      if (res.data.success) {
        setEvents(res.data.data.events || []);
      }
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.startDate || !newEvent.venue) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const res = await api.post('/events', newEvent);
      if (res.data.success) {
        toast.success('Campus event published successfully!');
        setIsCreateModalOpen(false);
        setNewEvent({
          title: '',
          description: '',
          category: 'TECHNICAL',
          venue: 'Main University Auditorium',
          startDate: '',
          endDate: '',
          maxParticipants: 200,
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      setRegisteringId(eventId);
      const res = await api.post(`/events/${eventId}/register`);
      if (res.data.success) {
        toast.success('You have successfully registered for this event!');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (filterCategory === 'ALL') return true;
    return ev.category === filterCategory;
  });

  if (loading) {
    return <LoadingSpinner text="Loading campus events calendar..." fullScreen />;
  }

  const categoryThemes = {
    TECHNICAL: 'primary',
    CULTURAL: 'purple',
    SPORTS: 'success',
    WORKSHOP: 'warning',
    SEMINAR: 'indigo',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Campus Life & Events Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hackathons, guest lectures, cultural fests, sports meets, and workshops
          </p>
        </div>

        {role !== 'STUDENT' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Host New Event</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'TECHNICAL', 'CULTURAL', 'WORKSHOP', 'SPORTS', 'SEMINAR'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No events scheduled"
              description="Check back later for newly announced workshops, hackathons, and gatherings."
            />
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant={categoryThemes[ev.category] || 'default'} size="sm">
                    {ev.category}
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-400">
                    Max: {ev.maxParticipants || 150} Seats
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">{ev.description}</p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(ev.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.venue}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={registeringId === ev._id}
                  onClick={() => handleRegisterEvent(ev._id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {registeringId === ev._id ? 'Registering...' : 'Register / RSVP Now'}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Host Campus Event"
        subtitle="Publish a workshop, hackathon, or university event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="e.g. AI Innovation Summit & Hackathon 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="TECHNICAL">Technical & Coding</option>
                <option value="CULTURAL">Cultural & Arts</option>
                <option value="WORKSHOP">Hands-on Workshop</option>
                <option value="SPORTS">Sports & Athletics</option>
                <option value="SEMINAR">Guest Lecture / Seminar</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Venue *</label>
              <input
                type="text"
                required
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                placeholder="Main Auditorium"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Event Description</label>
            <textarea
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Provide event details, schedule agenda, keynote speakers, or prize awards..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              Publish Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
