import axios from 'axios';
import UseAuth from './UseAuth';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
});

const UseAxios = () => {
  const { user } = UseAuth();
  const navigate = useNavigate();
  const isInterceptorSet = useRef(false);

  useEffect(() => {
    if (user?.accessToken && !isInterceptorSet.current) {
      // Request interceptor: attach token
      axiosSecure.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor: handle error
      axiosSecure.interceptors.response.use(
        (response) => response,
        (error) => {
          const status = error?.response?.status;
          if (status === 403 || status === 401) {
            navigate('/forbiden'); // redirect if forbidden
          }
          return Promise.reject(error);
        }
      );

      isInterceptorSet.current = true;
    }
  }, [user?.accessToken, navigate]);

  return axiosSecure;
};

export default UseAxios;
