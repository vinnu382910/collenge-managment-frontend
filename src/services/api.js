// Normalize API base URL (strips trailing /api or slash to prevent double /api/api/ in endpoints)
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

/**
 * Standard HTTP request wrapper with JSON headers and optional Bearer token
 */
async function request(endpoint, options = {}) {
  const { token, body, ...customConfig } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers
  };

  const config = {
    ...customConfig,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

// ==============================================================================
// 0. AUTHENTICATION SERVICES (Bypasses Supabase 429 Email Rate Limits)
// ==============================================================================
export async function registerStudentApi(studentData) {
  return request('/api/auth/register', {
    method: 'POST',
    body: studentData
  });
}

export async function registerAdminApi(adminData) {
  return request('/api/auth/admin-register', {
    method: 'POST',
    body: adminData
  });
}

// ==============================================================================
// 1. PUBLIC & EVENT SERVICES
// ==============================================================================
export async function getEvents(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const result = await request(`/api/events${queryString}`);
  return result.data;
}

export async function getEventById(id, token = null) {
  const result = await request(`/api/events/${id}`, { token });
  return result.data;
}

// ==============================================================================
// 2. STUDENT REGISTRATION SERVICES
// ==============================================================================
export async function registerForEvent(id, token) {
  return request(`/api/events/${id}/register`, {
    method: 'POST',
    token
  });
}

export async function cancelRegistration(id, token) {
  return request(`/api/events/${id}/register`, {
    method: 'DELETE',
    token
  });
}

export async function getMyEvents(token) {
  const result = await request('/api/my-events', { token });
  return result.data;
}

// ==============================================================================
// 3. PROFILE SERVICES
// ==============================================================================
export async function getProfile(token) {
  const result = await request('/api/profile', { token });
  return result.data;
}

export async function updateProfile(profileData, token) {
  const result = await request('/api/profile', {
    method: 'PUT',
    token,
    body: profileData
  });
  return result.data;
}

// ==============================================================================
// 4. ADMIN MANAGEMENT SERVICES
// ==============================================================================
export async function getAdminDashboard(token) {
  const result = await request('/api/admin/dashboard', { token });
  return result.data;
}

export async function getEventRegistrations(id, token) {
  const result = await request(`/api/admin/events/${id}/registrations`, { token });
  return result.data;
}

export async function createEvent(eventData, token) {
  return request('/api/events', {
    method: 'POST',
    token,
    body: eventData
  });
}

export async function updateEvent(id, eventData, token) {
  return request(`/api/events/${id}`, {
    method: 'PUT',
    token,
    body: eventData
  });
}

export async function deleteEvent(id, token) {
  return request(`/api/events/${id}`, {
    method: 'DELETE',
    token
  });
}

// ==============================================================================
// 5. GEMINI AI ASSISTANT SERVICE
// ==============================================================================
export async function askAIAssistant(message) {
  const result = await request('/api/ai/assistant', {
    method: 'POST',
    body: { message }
  });
  return result.data;
}
