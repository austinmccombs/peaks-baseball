import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for CORS
api.interceptors.request.use(
  (config) => {
    // Add CORS headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;

// Players API
export const playersAPI = {
  getAll: () => api.get('/api/v1/players'),
  getById: (id) => api.get(`/api/v1/players/${id}`),
  create: (data) => api.post('/api/v1/players', data),
  update: (id, data) => api.put(`/api/v1/players/${id}`, data),
  delete: (id) => api.delete(`/api/v1/players/${id}`),
  getRosterStats: () => api.get('/api/v1/roster/stats'),
  getHighlights: (id) => api.get(`/api/v1/players/${id}/highlights`),
  getStats: (id) => api.get(`/api/v1/players/${id}/stats`),
  getGameLog: (id) => api.get(`/api/v1/players/${id}/game_log`),
};

// Admin Players API (includes deactivated players)
export const adminPlayersAPI = {
  getAll: () => api.get('/api/v1/admin/players'),
  getById: (id) => api.get(`/api/v1/players/${id}`),
  create: (data) => api.post('/api/v1/players', data),
  update: (id, data) => api.put(`/api/v1/players/${id}`, data),
  delete: (id) => api.delete(`/api/v1/players/${id}`),
};

// Games API
export const gamesAPI = {
  getAll: () => api.get('/api/v1/games'),
  getById: (id) => api.get(`/api/v1/games/${id}`),
  create: (data) => api.post('/api/v1/games', data),
  update: (id, data) => api.put(`/api/v1/games/${id}`, data),
  delete: (id) => api.delete(`/api/v1/games/${id}`),
  getStats: (id) => api.get(`/api/v1/games/${id}/stats`),
};

// Stats API
export const statsAPI = {
  getAll: () => api.get('/api/v1/stats'),
  getById: (id) => api.get(`/api/v1/stats/${id}`),
  create: (data) => api.post('/api/v1/stats', data),
  update: (id, data) => api.put(`/api/v1/stats/${id}`, data),
  delete: (id) => api.delete(`/api/v1/stats/${id}`),
  getSeasonStats: (season) => api.get(`/api/v1/season/stats?season=${season}`),
};

// Highlights API
export const highlightsAPI = {
  getAll: () => api.get('/api/v1/highlights'),
  getById: (id) => api.get(`/api/v1/highlights/${id}`),
  create: (data) => api.post('/api/v1/highlights', data),
  update: (id, data) => api.put(`/api/v1/highlights/${id}`, data),
  delete: (id) => api.delete(`/api/v1/highlights/${id}`),
}; 