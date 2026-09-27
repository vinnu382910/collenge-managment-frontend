import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Calendar, Lock, Mail, ArrowRight, AlertCircle, Shield, User, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPortal = searchParams.get('portal') === 'admin' ? 'admin' : 'student';
  const [portal, setPortal] = useState(initialPortal);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (searchParams.get('portal') === 'admin') {
      setPortal('admin');
    }
  }, [searchParams]);

  const handlePortalSwitch = (newPortal) => {
    setPortal(newPortal);
    setError('');
    const newParams = new URLSearchParams(searchParams);
    if (newPortal === 'admin') {
      newParams.set('portal', 'admin');
    } else {
      newParams.delete('portal');
    }
    setSearchParams(newParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      // Determine redirection based on role
      if (portal === 'admin' || email === 'admin@eventhub.edu') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillStudentDemo = () => {
    setPortal('student');
    setEmail('rahul.sharma@eventhub.edu');
    setPassword('StudentPassword123!');
    setError('');
  };

  const fillAdminDemo = () => {
    setPortal('admin');
    setEmail('admin@eventhub.edu');
    setPassword('AdminPassword123!');
    setError('');
  };

  return (
    <div className="min-h-[82vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg transition-colors ${
          portal === 'admin' 
            ? 'bg-gradient-to-tr from-purple-700 to-indigo-700 shadow-purple-200' 
            : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-200'
        }`}>
          {portal === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <Calendar className="w-7 h-7" />}
        </div>

        <h1 className="mt-4 font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          {portal === 'admin' ? 'Campus Admin Portal' : 'Student Event Portal'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {portal === 'admin'
            ? 'Sign in with staff credentials to manage events and student rosters'
            : 'Sign in to access your registered workshops, hackathons & campus events'}
        </p>

        {/* Portal Switcher Tabs */}
        <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-200/80 border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => handlePortalSwitch('student')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              portal === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              portal === 'admin'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administrator Sign In</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`bg-white py-8 px-6 shadow-xl sm:rounded-3xl sm:px-10 border transition-all ${
          portal === 'admin' ? 'border-purple-200 shadow-purple-100/50' : 'border-slate-200 shadow-slate-200/50'
        }`}>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {portal === 'admin' ? 'Official Staff Email' : 'Student Email'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portal === 'admin' ? 'admin@eventhub.edu' : 'student@eventhub.edu'}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50 ${
                portal === 'admin'
                  ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              <span>{loading ? 'Authenticating...' : portal === 'admin' ? 'Sign In as Administrator' : 'Sign In as Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              One-Click Demo Fill (Workshop Helper)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillStudentDemo}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-100"
              >
                <User className="w-3.5 h-3.5" />
                <span>Fill Student</span>
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors border border-purple-100"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Fill Admin</span>
              </button>
            </div>
          </div>

          {/* Registration Navigation Links */}
          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            {portal === 'admin' ? (
              <p>
                New campus staff or event director?{' '}
                <Link to="/register?portal=admin" className="font-semibold text-purple-700 hover:underline">
                  Register as Administrator
                </Link>
              </p>
            ) : (
              <p>
                New student without an account?{' '}
                <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                  Create Student Account
                </Link>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
