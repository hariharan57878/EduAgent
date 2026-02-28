import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api', // Match server port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Demo Mode State (Resets on refresh as requested)
let isDemoMode = false;

export const enableDemoMode = () => {
  isDemoMode = true;
};

// Add a request interceptor to add token
client.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    // Add demo mode header
    if (isDemoMode) {
      config.headers['X-DEMO-MODE'] = 'true';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
