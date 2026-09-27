import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase.js';
import { registerStudentApi, registerAdminApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from public.profiles
  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    return null;
  }

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    if (data?.user) {
      await fetchProfile(data.user.id);
    }
    return data;
  }

  // Student Signup via Backend (No 429 email rate limits)
  async function signup(studentData) {
    const result = await registerStudentApi(studentData);
    await login(studentData.email, studentData.password);
    return result;
  }

  // Admin Signup via Backend (Validates passcode, sets admin role, no 429)
  async function adminSignup(adminData) {
    const result = await registerAdminApi(adminData);
    await login(adminData.email, adminData.password);
    return result;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  const role = profile?.role || 'student';
  const isAdmin = role === 'admin';
  const token = session?.access_token || null;

  const value = {
    user,
    session,
    token,
    profile,
    role,
    isAdmin,
    loading,
    login,
    signup,
    adminSignup,
    logout,
    refreshProfile: () => user && fetchProfile(user.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
