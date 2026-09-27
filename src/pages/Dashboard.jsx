import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyEvents } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  GraduationCap, 
  Compass 
} from 'lucide-react';

export default function Dashboard() {
  const { profile, token } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMyEvents(token)
        .then(data => {
          setRegisteredEvents(data || []);
        })
        .catch(err => {
          console.error('Error fetching registered events:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = registeredEvents.filter(e => e.event_date >= today);
  const completedEvents = registeredEvents.filter(e => e.event_date < today);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Welcome Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            {profile?.department || 'Student Portal'} • {profile?.year || 'Campus Scholar'}
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            Welcome, {profile?.full_name || 'Student'}! 👋
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            Stay on top of your registered workshops, hackathons, and campus activities. Discover new events happening this semester.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registered</p>
            <p className="font-display font-bold text-3xl text-slate-900 mt-0.5">{registeredEvents.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming Events</p>
            <p className="font-display font-bold text-3xl text-emerald-600 mt-0.5">{upcomingEvents.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Events</p>
            <p className="font-display font-bold text-3xl text-slate-700 mt-0.5">{completedEvents.length}</p>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/events"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">Browse Events</p>
              <p className="text-xs text-slate-500">Discover new opportunities</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
        </Link>

        <Link
          to="/my-events"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">My Events</p>
              <p className="text-xs text-slate-500">Manage your registrations</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
        </Link>

        <Link
          to="/ai-assistant"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">AI Assistant</p>
              <p className="text-xs text-slate-500">Get event recommendations</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
        </Link>
      </div>

      {/* 4. Upcoming Registered Events Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Your Upcoming Registered Events
          </h2>
          <Link to="/my-events" className="text-sm font-semibold text-indigo-600 hover:underline">
            View all ({registeredEvents.length})
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading your registrations..." />
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="font-semibold text-slate-700">No upcoming events registered.</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Explore our event catalog and reserve your seat today!</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium text-xs shadow-sm hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(evt => (
              <div 
                key={evt.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/events/${evt.id}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </Link>
                  <span className="text-[11px] text-slate-400">
                    Registered on {new Date(evt.registered_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
