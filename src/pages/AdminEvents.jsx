import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getEvents, deleteEvent } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { PlusCircle, Edit, Trash2, Users, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  const fetchAllEvents = () => {
    setLoading(true);
    getEvents({ sort: 'date_asc' })
      .then(data => {
        setEvents(data || []);
      })
      .catch(err => {
        setFeedback({ type: 'error', message: err.message || 'Failed to fetch events.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleDelete = async (id, title) => {
    // Confirmation dialog before deletion (Section 16 requirement)
    const confirmed = window.confirm(`Are you sure you want to delete this event?\n\n"${title}"\n\nAll existing student registrations for this event will also be removed.`);
    if (!confirmed) return;

    setDeletingId(id);
    setFeedback({ type: '', message: '' });

    try {
      await deleteEvent(id, token);
      setFeedback({ type: 'success', message: `Event "${title}" and all related registrations were deleted successfully.` });
      fetchAllEvents();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete event.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Manage College Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, update, monitor capacity, and manage registrations across all campus fests.
          </p>
        </div>

        <Link
          to="/admin/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
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
        <LoadingSpinner text="Loading events roster..." />
      ) : events.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
          <p className="font-semibold text-slate-700">No events currently exist in the database.</p>
          <Link
            to="/admin/events/create"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs"
          >
            <PlusCircle className="w-4 h-4" /> Create First Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Event Title</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Date & Time</th>
                  <th className="px-4 py-4">Venue</th>
                  <th className="px-4 py-4 text-center">Capacity</th>
                  <th className="px-4 py-4 text-center">Registrations</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map(evt => {
                  const today = new Date().toISOString().split('T')[0];
                  const isClosed = evt.registration_deadline < today;
                  const isFull = (evt.current_registrations || 0) >= evt.max_participants;

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-display font-semibold text-slate-900 line-clamp-1">{evt.title}</div>
                        <div className="text-xs text-slate-400">{evt.organizer}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {evt.category}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <div className="font-medium text-slate-800">{new Date(evt.event_date).toLocaleDateString()}</div>
                        <div className="text-slate-400">{evt.start_time?.slice(0, 5)}</div>
                      </td>

                      <td className="px-4 py-4 max-w-[150px] truncate text-xs">
                        {evt.venue}
                      </td>

                      <td className="px-4 py-4 text-center font-semibold text-slate-800">
                        {evt.max_participants}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <Link
                          to={`/admin/events/${evt.id}/registrations`}
                          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{evt.current_registrations || 0}</span>
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {isFull ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Full
                          </span>
                        ) : isClosed ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Closed
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Open
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/events/${evt.id}`}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Public Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/events/${evt.id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(evt.id, evt.title)}
                            disabled={deletingId === evt.id}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
