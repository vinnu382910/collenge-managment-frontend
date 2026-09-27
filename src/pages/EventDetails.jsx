import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent, cancelRegistration } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles, 
  CalendarX 
} from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const loadEvent = () => {
    setLoading(true);
    getEventById(id, token)
      .then(data => {
        setEvent(data);
      })
      .catch(err => {
        setFeedback({ type: 'error', message: err.message || 'Failed to load event.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadEvent();
  }, [id, token]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await registerForEvent(id, token);
      setFeedback({ type: 'success', message: res.message || 'Registration successful!' });
      loadEvent(); // refresh registration count & state
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await cancelRegistration(id, token);
      setFeedback({ type: 'success', message: res.message || 'Registration cancelled.' });
      loadEvent();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to cancel registration.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-slate-600 mt-2 mb-6">The requested event could not be found or may have been deleted.</p>
        <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDeadline = new Date(event.registration_deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link 
        to="/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      {/* Main Banner */}
      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-lg bg-slate-900">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm mb-3">
            {event.category}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-snug">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Feedback Banner */}
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

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description & About */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-xl text-slate-900">About this Event</h2>
            <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Organizer Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Organized By</p>
              <h3 className="font-display font-bold text-slate-900 text-base">{event.organizer}</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule, Venue, & Registration Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              Event Logistics
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Date</p>
                  <p className="text-slate-600 text-xs">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Time</p>
                  <p className="text-slate-600 text-xs">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Venue</p>
                  <p className="text-slate-600 text-xs">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Capacity & Seats</p>
                  <p className="text-slate-600 text-xs">
                    <strong className="text-slate-900">{event.remaining_seats}</strong> seats available out of {event.max_participants}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarX className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Registration Deadline</p>
                  <p className="text-slate-600 text-xs">{formattedDeadline}</p>
                </div>
              </div>
            </div>

            {/* Registration Action Area */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              
              {!user ? (
                <div className="space-y-2 text-center">
                  <p className="text-xs text-slate-500 font-medium">Please login to register for this event.</p>
                  <Link
                    to="/login"
                    state={{ from: `/events/${id}` }}
                    className="w-full inline-flex items-center justify-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    Log In to Register
                  </Link>
                </div>
              ) : event.is_user_registered ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" /> You are Registered!
                  </div>
                  <button
                    onClick={handleCancelRegistration}
                    disabled={actionLoading}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                </div>
              ) : event.is_full ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm cursor-not-allowed"
                >
                  Event Full
                </button>
              ) : event.is_closed ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm cursor-not-allowed"
                >
                  Registration Closed
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {actionLoading ? 'Registering...' : 'Register Now'}
                </button>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
