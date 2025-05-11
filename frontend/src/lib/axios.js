import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://streambackend-ov4o.onrender.com/api',
  withCredentials: true
});

export default axiosInstance;
