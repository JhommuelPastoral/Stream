import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://streambackend-fvop.onrender.com/api',
  withCredentials: true
});

export default axiosInstance;
