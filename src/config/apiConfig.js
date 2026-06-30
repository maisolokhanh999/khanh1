import axios from 'axios';

// Detecta a URL do backend baseado no ambiente
const getBackendURL = () => {
  if (typeof window !== 'undefined') {
    // Em desenvolvimento: localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Em produção: Render
    return 'https://backend-nad5.onrender.com';
  }
  return 'https://backend-nad5.onrender.com';
};

const BACKEND_URL = getBackendURL();

// Criar axios instance com configuração padrão
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export default api;
