import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

export const endpoints = {
  articles: (params) => api.get('/articles', { params }),
  article: (id) => api.get(`/articles/${id}`),
  issues: () => api.get('/issues'),
  issue: (id) => api.get(`/issues/${id}`),
  volumes: () => api.get('/volumes'),
  editorialBoard: () => api.get('/editorial-board'),
  search: (q, params) => api.get('/search', { params: { q, ...params } }),
  // Do not set Content-Type manually here — axios/the browser must generate
  // the multipart boundary themselves, or multer rejects the request.
  submit: (formData) => api.post('/submissions', formData),
};
