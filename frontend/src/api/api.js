import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.9:8000/api/',
  timeout: 10000,
});

export default api;