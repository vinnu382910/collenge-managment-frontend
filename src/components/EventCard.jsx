import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const CATEGORY_STYLES = {
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  Hackathon: 'bg-purple-50 text-purple-700 border-purple-200',
  Seminar: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cultural: 'bg-pink-50 text-pink-700 border-pink-200',
  Sports: 'bg-amber-50 text-amber-700 border-amber-200',
  Technical: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Club Activity': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Competition: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function EventCard({ event }) {
  const categoryStyle = CATEGORY_STYLES[event.category] || 'bg-slate-100 text-slate-700 border-slate-200';
  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Event Image & Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.image_url || defaultImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = defaultImage; }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryStyle}`}>
            {event.category}
          </span>
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {event.is_full && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shadow-sm">
              Event Full
            </span>
          )}
          {event.is_closed && !event.is_full && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-white shadow-sm">
              Closed
            </span>
          )}
          {!event.is_full && !event.is_closed && event.remaining_seats <= 15 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm animate-pulse">
              Only {event.remaining_seats} seats left!
            </span>
          )}
        </div>
      </div>

      {/* Event Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Metadata Grid */}
          <div className="space-y-2 text-xs text-slate-500 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-medium text-slate-700">{formattedDate}</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong className="text-slate-800">{event.remaining_seats ?? (event.max_participants - (event.current_registrations || 0))}</strong> seats remaining of {event.max_participants}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${event.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-medium text-sm transition-all border border-slate-200 hover:border-indigo-600 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
