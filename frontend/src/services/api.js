const API_URL =
  import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('beauty_glow_token');
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erreur réseau');
  }

  return data;
}

export const api = {
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSite: () => request('/public/site'),

  createBooking: (payload) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAdminDashboard: () => request('/admin/dashboard'),

  getBookings: () => request('/bookings'),

  getMyBookings: () => request('/bookings/me'),

  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getContent: () => request('/admin/content'),

  updateContent: (payload) =>
    request('/admin/content', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  addGalleryImage: (payload) =>
    request('/admin/gallery', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteGalleryImage: (id) =>
    request(`/admin/gallery/${id}`, {
      method: 'DELETE',
    }),

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return request('/admin/upload', {
      method: 'POST',
      body: formData,
    });
  },
};