import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Subtitle */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Event<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">
              College Event Management System. Discover, register, and participate in hackathons, workshops, and fests.
            </p>
            <p className="text-xs text-indigo-400 font-semibold tracking-wide uppercase">
              "Discover. Register. Participate."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/events" className="hover:text-indigo-400 transition-colors">All Events</Link></li>
              <li><Link to="/events?category=Workshop" className="hover:text-indigo-400 transition-colors">Workshops</Link></li>
              <li><Link to="/events?category=Hackathon" className="hover:text-indigo-400 transition-colors">Hackathons</Link></li>
              <li><Link to="/events?category=Cultural" className="hover:text-indigo-400 transition-colors">Cultural Fests</Link></li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Student Hub</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/my-events" className="hover:text-indigo-400 transition-colors">My Registrations</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">My Profile</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Assistant</Link></li>
            </ul>
          </div>

          {/* College Administration */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Administration</h4>
            <p className="text-sm text-slate-400 mb-3">
              Apex Institute of Technology<br />
              Student Affairs Directorate<br />
              Block A, Campus Main Gate
            </p>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Admin Portal
            </Link>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EventHub College Management System. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with Supabase, Express & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
