import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Calendar, 
  Lock, 
  Mail, 
  User, 
  School, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Shield, 
  KeyRound, 
  Sparkles 
} from 'lucide-react';

const COLLEGES_LIST = [
  'Apex Institute of Technology (Main Campus)', // Top Priority
  'Apex School of Engineering & Technology',
  'Apex College of Management & Commerce',
  'Apex Institute of Medical Sciences & Technology',
  'City Engineering College',
  'State Technological University',
  'National Institute of Technology',
  'Other Institution / College'
];

const DEPARTMENTS_LIST = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil & Environmental Engineering',
  'Electrical & Electronics Engineering',
  'Business Administration (BBA / MBA)',
  'Student Affairs & Event Directorate (Faculty)'
];

const YEARS_LIST = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Postgraduate / Research Scholar',
  'Faculty / Staff Coordinator'
];

export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPortal = searchParams.get('portal') === 'admin' ? 'admin' : 'student';
  const [portal, setPortal] = useState(initialPortal);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    college: 'Apex Institute of Technology (Main Campus)',
    customCollege: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    admin_passcode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signup, adminSignup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('portal') === 'admin') {
      setPortal('admin');
      setFormData(prev => ({
        ...prev,
        department: 'Student Affairs & Event Directorate (Faculty)',
        year: 'Faculty / Staff Coordinator'
      }));
    }
  }, [searchParams]);

  const handlePortalSwitch = (newPortal) => {
    setPortal(newPortal);
    setError('');
    const newParams = new URLSearchParams(searchParams);
    if (newPortal === 'admin') {
      newParams.set('portal', 'admin');
      setFormData(prev => ({
        ...prev,
        department: 'Student Affairs & Event Directorate (Faculty)',
        year: 'Faculty / Staff Coordinator'
      }));
    } else {
      newParams.delete('portal');
      setFormData(prev => ({
        ...prev,
        department: 'Computer Science & Engineering',
        year: '1st Year'
      }));
    }
    setSearchParams(newParams);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const effectiveCollege = formData.college === 'Other Institution / College' 
      ? (formData.customCollege.trim() || 'Other College')
      : formData.college;

    try {
      if (portal === 'admin') {
        // Administrator Registration
        await adminSignup({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          college: effectiveCollege,
          department: formData.department,
          year: formData.year,
          admin_passcode: formData.admin_passcode
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        // Student Registration
        await signup({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          college: effectiveCollege,
          department: formData.department,
          year: formData.year
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors.map(e => e.message).join(' • '));
      } else {
        setError(err.message || 'Registration failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminPasscodeDemo = () => {
    setFormData(prev => ({ ...prev, admin_passcode: 'ADMIN2026' }));
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg transition-colors ${
          portal === 'admin' 
            ? 'bg-gradient-to-tr from-purple-700 to-indigo-700 shadow-purple-200' 
            : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-200'
        }`}>
          {portal === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <Calendar className="w-7 h-7" />}
        </div>

        <h1 className="mt-4 font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          {portal === 'admin' ? 'Administrator Account Registration' : 'Student Account Registration'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {portal === 'admin'
            ? 'Authorized faculty and event coordinators portal registration'
            : 'Join EventHub to register for workshops, hackathons, and campus activities'}
        </p>

        {/* Portal Switcher Tabs */}
        <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => handlePortalSwitch('student')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              portal === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Registration</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              portal === 'admin'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Registration</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className={`bg-white py-8 px-6 shadow-xl sm:rounded-3xl sm:px-10 border transition-all ${
          portal === 'admin' ? 'border-purple-200 shadow-purple-100/50' : 'border-slate-200 shadow-slate-200/50'
        }`}>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>
                {portal === 'admin'
                  ? 'Admin account created! Entering Command Center...'
                  : 'Account registered successfully! Redirecting to Dashboard...'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder={portal === 'admin' ? 'e.g. Prof. Vikram Sharma' : 'e.g. Rahul Sharma'}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {portal === 'admin' ? 'Official Staff Email *' : 'Student Email *'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={portal === 'admin' ? 'staff@eventhub.edu' : 'student@eventhub.edu'}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="password"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* College Selection (Priority Ordered) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College / Institution *
              </label>
              <div className="relative">
                <School className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  required
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {COLLEGES_LIST.map((col, idx) => (
                    <option key={col} value={col}>
                      {idx === 0 ? `⭐ ${col} (Primary Campus)` : col}
                    </option>
                  ))}
                </select>
              </div>

              {formData.college === 'Other Institution / College' && (
                <input
                  type="text"
                  required
                  name="customCollege"
                  value={formData.customCollege}
                  onChange={handleChange}
                  placeholder="Enter full name of your college/university"
                  className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Department and Academic Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {DEPARTMENTS_LIST.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {portal === 'admin' ? 'Designation / Standing' : 'Academic Year *'}
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {YEARS_LIST.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Admin Authorization Passcode (Admin Portal Only) */}
            {portal === 'admin' && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Admin Authorization Passcode *
                  </label>
                  <button
                    type="button"
                    onClick={fillAdminPasscodeDemo}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill Demo Code
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    name="admin_passcode"
                    value={formData.admin_passcode}
                    onChange={handleChange}
                    placeholder="Enter security passcode (Demo: ADMIN2026)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-purple-700">
                  Required to prevent unauthorized elevation to the administrator role. Use demo passcode: <strong>ADMIN2026</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 ${
                portal === 'admin'
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              <span>
                {loading
                  ? 'Creating Account...'
                  : portal === 'admin'
                  ? 'Complete Admin Registration'
                  : 'Complete Student Registration'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Navigation */}
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Already have an account?{' '}
            <Link
              to={portal === 'admin' ? '/login?portal=admin' : '/login'}
              className={`font-semibold hover:underline ${portal === 'admin' ? 'text-purple-700' : 'text-indigo-600'}`}
            >
              {portal === 'admin' ? 'Sign in to Admin Portal' : 'Sign in to Student Portal'}
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
