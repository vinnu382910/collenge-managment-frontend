import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEvents } from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Search, Filter, ArrowUpDown, XCircle } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Workshop',
  'Hackathon',
  'Seminar',
  'Cultural',
  'Sports',
  'Technical',
  'Club Activity',
  'Competition'
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read URL query parameters
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'date_asc';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getEvents({
      category: category === 'All' ? '' : category,
      search,
      sort
    })
      .then(data => {
        setEvents(data || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to load events.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, search, sort]);

  // Sync state to URL search parameters
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setCategory('All');
    setSearch('');
    setSort('date_asc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Explore College Events
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Discover all upcoming workshops, technical conferences, hackathons, and cultural meets.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by event title, keywords, or venue..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearchChange({ target: { value: '' } })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="date_asc">Date: Earliest First</option>
              <option value="date_desc">Date: Latest First</option>
              <option value="title_asc">Title: A to Z</option>
              <option value="title_desc">Title: Z to A</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Events Results Section */}
      {loading ? (
        <LoadingSpinner text="Fetching events..." />
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 text-red-700">
          <p className="font-semibold text-base mb-1">Failed to load events</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="font-display font-semibold text-lg text-slate-700 mb-1">No matching events found</p>
          <p className="text-sm text-slate-500 mb-4">Try clearing your search query or choosing another category.</p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-4">
            <span>Showing {events.length} college events</span>
            {(category !== 'All' || search) && (
              <button
                onClick={handleClearFilters}
                className="text-indigo-600 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
