import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api', // Match server port
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
