import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // We set the base URL for axios so we don't have to type it every time
  // Note: For production, this should point to your deployed backend URL.
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    // Check if user is already logged in by checking localStorage for user data
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      // Set the token for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      
      // Fetch fresh user data (triggers streak update on backend)
      axios.get('/api/auth/me')
        .then(response => {
          const freshUser = { ...response.data, token: parsedUser.token };
          localStorage.setItem('user', JSON.stringify(freshUser));
          setUser(freshUser);
        })
        .catch(error => {
          console.error("Error fetching fresh user data:", error);
          setUser(parsedUser); // Fallback to local storage if API fails
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshUser = async () => {
    if (axios.defaults.headers.common['Authorization']) {
      try {
        const response = await axios.get('/api/auth/me');
        const token = axios.defaults.headers.common['Authorization'].split(' ')[1];
        const freshUser = { ...response.data, token };
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      } catch (error) {
        console.error("Error refreshing user", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
