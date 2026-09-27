import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CalendarCheck, 
  Trophy, 
  Cpu, 
  Music, 
  Code, 
  Rocket, 
  CheckCircle2 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Workshop', icon: Code, color: 'from-blue-500 to-indigo-600', count: 'Hands-on Labs' },
  { name: 'Hackathon', icon: Rocket, color: 'from-purple-500 to-pink-600', count: '36h Competitions' },
  { name: 'Seminar', icon: Compass, color: 'from-emerald-500 to-teal-600', count: 'Tech Talks' },
  { name: 'Cultural', icon: Music, color: 'from-pink-500 to-rose-600', count: 'Music & Dance' },
  { name: 'Sports', icon: Trophy, color: 'from-amber-500 to-orange-600', count: 'Tournaments' },
  { name: 'Technical', icon: Cpu, color: 'from-cyan-500 to-blue-600', count: 'Coding & CTFs' }
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents({ sort: 'date_asc' })
      .then(data => {
        setEvents(data || []);
      })
      .catch(err => {
        console.error('Failed to load events:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const featuredEvents = events.slice(0, 3);
  const upcomingEvents = events.slice(3, 7);

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Official Campus Event Management System
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Discover College Events. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Register. Participate.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find hackathons, workshops, seminars, cultural events and more — all in one place. Connect with campus clubs and elevate your college journey.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-14 inline-grid grid-cols-3 gap-6 sm:gap-12 py-4 px-8 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-md">
            <div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-indigo-600">10+</p>
              <p className="text-xs text-slate-500 font-medium">Active Events</p>
            </div>
            <div className="border-x border-slate-100 px-6 sm:px-10">
              <p className="font-display font-bold text-2xl sm:text-3xl text-purple-600">8</p>
              <p className="text-xs text-slate-500 font-medium">Categories</p>
            </div>
            <div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-pink-600">100%</p>
              <p className="text-xs text-slate-500 font-medium">Verified Campus Fests</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Handpicked Highlights</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
              Featured Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View all events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured college events..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EVENT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Diverse Opportunities</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
            Browse by Event Category
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Filter activities based on your academic path, creative passions, and competitive drive.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${cat.name}`}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. UPCOMING EVENTS */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">Mark Your Calendar</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
                Upcoming College Events
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>Explore full schedule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* 5. HOW EVENTHUB WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Simple & Seamless</span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mt-1">
              How EventHub Works
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Three effortless steps between you and your next campus accomplishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Discover Events</h3>
              <p className="text-sm text-slate-300">
                Explore tech workshops, hackathons, and cultural fests with smart search and category filters.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">1-Click Registration</h3>
              <p className="text-sm text-slate-300">
                Sign in with your verified student profile and claim your seat before the registration deadline.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-pink-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Participate & Excel</h3>
              <p className="text-sm text-slate-300">
                Receive venue reminders, view your schedule in your Student Dashboard, and win prizes!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI ASSISTANT PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-100 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Powered by Google Gemini
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Need Help Finding the Perfect Event?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ask our Gemini AI Assistant any question: "What technical hackathons are open this month?", "Recommend me beginner coding events", or "When is the next cultural dance showdown?".
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Launch EventHub AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
