const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  },

  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  }
};

export const complaintApi = {
  getAll: () => api.get('/complaints'),
  getById: (id: string) => api.get(`/complaints/${id}`),
  create: (data: any) => api.post('/complaints', data),
  update: (id: string, data: any) => api.patch(`/complaints/${id}`, data),
  delete: (id: string) => api.delete(`/complaints/${id}`)
};

export const userApi = {
  getProfile: (userId: string) => api.get(`/users/profile/${userId}`),
  updateProfile: (userId: string, data: any) => api.patch(`/users/profile/${userId}`, data),
  getSettings: (userId: string) => api.get(`/users/settings/${userId}`),
  updateSettings: (userId: string, data: any) => api.patch(`/users/settings/${userId}`, data),
  changePassword: (userId: string, data: any) => api.post(`/users/password/${userId}`, data),
  getAll: () => api.get('/users')
};

export const responseApi = {
  getByComplaint: (complaintId: string) => api.get(`/responses/${complaintId}`),
  create: (complaintId: string, data: any) => api.post(`/responses/${complaintId}`, data),
  delete: (responseId: string) => api.delete(`/responses/${responseId}`)
};
