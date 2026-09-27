import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getEventById, getEventRegistrations } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { ArrowLeft, Users, Mail, GraduationCap, School, Calendar, AlertCircle } from 'lucide-react';

export default function AdminRegistrations() {
  const { id } = useParams();
  const { token } = useAuth();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getEventById(id, token),
      getEventRegistrations(id, token)
    ])
      .then(([eventData, regData]) => {
        setEvent(eventData);
        setRegistrations(regData || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to load attendee registrations.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return <LoadingSpinner text="Fetching registered students roster..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Manage Events
      </Link>

      {/* Event Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {event?.category}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
            {event?.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organized by {event?.organizer} • {new Date(event?.event_date).toLocaleDateString()} at {event?.venue}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Registered</p>
            <p className="font-display font-bold text-2xl text-slate-900">
              {registrations.length} / {event?.max_participants}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registrations Table */}
      {registrations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-800">No Registrations Yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            No students have registered for this event yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Registered Students ({registrations.length})
            </h2>
            <span className="text-xs text-slate-400">Official Roster</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Year</th>
                  <th className="px-6 py-4 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((student, idx) => (
                  <tr key={student.registration_id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {student.full_name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-indigo-600">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      {student.department || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">
                      {student.year || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-xs text-slate-400">
                      {new Date(student.registered_at).toLocaleDateString()} at {new Date(student.registered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
