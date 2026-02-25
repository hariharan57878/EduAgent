import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.patch('/auth/profile', profileData),
};

// AI Services
export const aiService = {
  generateRoadmap: (data) => api.post('/agent/generate-roadmap', data),
  chat: (message, context) => api.post('/agent/chat', { message, context }),
  generateVoice: (text, voiceId) => api.post('/agent/generate-voice', { text, voiceId }, { responseType: 'arraybuffer' }),
};

// Roadmap Services
export const roadmapService = {
  getAll: () => api.get('/roadmaps'),
  getById: (id) => api.get(`/roadmaps/${id}`),
  save: (roadmap) => api.post('/roadmaps', roadmap),
  delete: (id) => api.delete(`/roadmaps/${id}`),
};

// Community Services
export const communityService = {
  getPosts: (channel) => api.get('/posts', { params: { channel } }),
  createPost: (postData) => api.post('/posts', postData),
};

// Onboarding Services
export const onboardingService = {
  complete: (data) => api.post('/onboarding/complete', data),
};

export default api;
