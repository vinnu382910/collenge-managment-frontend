import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAdminDashboard } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { 
  Calendar, 
  Users, 
  Clock, 
  GraduationCap, 
  PlusCircle, 
  ListFilter, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminDashboard() {
  const { token, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getAdminDashboard(token)
        .then(res => {
          setData(res);
        })
        .catch(err => {
          console.error('Failed to load admin stats:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner text="Aggregating administrative statistics..." />;
  }

  const stats = data?.stats || {
    total_events: 0,
    upcoming_events: 0,
    total_registrations: 0,
    total_students: 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-sm text-slate-500">
              Welcome, {profile?.full_name || 'Administrator'} • Oversee campus events, registration quotas, and attendees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm transition-all"
          >
            <ListFilter className="w-4 h-4" />
            <span>Manage Events</span>
          </Link>
        </div>
      </div>

      {/* 1. Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Events</p>
            <p className="font-display font-bold text-3xl text-slate-900 mt-0.5">{stats.total_events}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Upcoming Events</p>
            <p className="font-display font-bold text-3xl text-purple-600 mt-0.5">{stats.upcoming_events}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registrations</p>
            <p className="font-display font-bold text-3xl text-emerald-600 mt-0.5">{stats.total_registrations}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Students</p>
            <p className="font-display font-bold text-3xl text-amber-600 mt-0.5">{stats.total_students}</p>
          </div>
        </div>
      </div>

      {/* 2. Recent Events and Recent Registrations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Events Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900">Recently Created Events</h3>
            <Link to="/admin/events" className="text-xs font-semibold text-indigo-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_events?.map(evt => (
              <div key={evt.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-display font-semibold text-sm text-slate-900 truncate">{evt.title}</h4>
                  <p className="text-xs text-slate-500">{evt.category} • {new Date(evt.event_date).toLocaleDateString()}</p>
                </div>
                <Link
                  to={`/admin/events/${evt.id}/registrations`}
                  className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  Attendees
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900">Recent Student Registrations</h3>
            <span className="text-xs text-slate-400">Live Activity Feed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_registrations?.map(reg => (
              <div key={reg.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-slate-900 truncate">
                    {reg.profiles?.full_name || 'Student'}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    Registered for: <strong className="text-slate-700">{reg.events?.title}</strong>
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {new Date(reg.registered_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
