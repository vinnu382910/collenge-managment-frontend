import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyEvents, cancelRegistration } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

export default function MyEvents() {
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = () => {
    setLoading(true);
    getMyEvents(token)
      .then(data => {
        setRegistrations(data || []);
      })
      .catch(err => {
        setFeedback({ type: 'error', message: err.message || 'Failed to load your registered events.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      fetchRegistrations();
    }
  }, [token]);

  const handleCancel = async (eventId, title) => {
    if (!confirm(`Are you sure you want to cancel your registration for "${title}"?`)) {
      return;
    }

    setCancellingId(eventId);
    setFeedback({ type: '', message: '' });

    try {
      await cancelRegistration(eventId, token);
      setFeedback({ type: 'success', message: `Registration for "${title}" has been cancelled.` });
      fetchRegistrations();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to cancel registration.' });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          My Registered Events
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Manage all college events and activities you have reserved a seat for.
        </p>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading your registered events..." />
      ) : registrations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center max-w-xl mx-auto">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-800 mb-1">
            No Events Registered Yet
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            You haven't signed up for any workshops or hackathons yet. Browse our open events!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map(evt => {
            const today = new Date().toISOString().split('T')[0];
            const isPast = evt.event_date < today;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {evt.category}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isPast ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isPast ? 'Completed' : 'Registered'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-medium text-slate-700">
                        {new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{evt.start_time?.slice(0, 5)} - {evt.end_time?.slice(0, 5)}</span>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                    Registration Date: {new Date(evt.registered_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to={`/events/${evt.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    View Event
                  </Link>
                  
                  {!isPast && (
                    <button
                      onClick={() => handleCancel(evt.id, evt.title)}
                      disabled={cancellingId === evt.id}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{cancellingId === evt.id ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
