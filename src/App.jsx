import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyEvents from './pages/MyEvents.jsx';
import Profile from './pages/Profile.jsx';
import AIAssistant from './pages/AIAssistant.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminEvents from './pages/AdminEvents.jsx';
import AdminCreateEvent from './pages/AdminCreateEvent.jsx';
import AdminEditEvent from './pages/AdminEditEvent.jsx';
import AdminRegistrations from './pages/AdminRegistrations.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<Navigate to="/login?portal=admin" replace />} />
          <Route path="/admin/register" element={<Navigate to="/register?portal=admin" replace />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />

          {/* Student Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-events" 
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <AdminRoute>
                <AdminEvents />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events/create" 
            element={
              <AdminRoute>
                <AdminCreateEvent />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events/:id/edit" 
            element={
              <AdminRoute>
                <AdminEditEvent />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events/:id/registrations" 
            element={
              <AdminRoute>
                <AdminRegistrations />
              </AdminRoute>
            } 
          />

          {/* Catch-All Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
