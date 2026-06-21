import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-cards border border-border rounded-xl shadow-lg fade-in">
      <h2 className="text-2xl font-bold text-textPrimary text-center mb-6">Welcome Back</h2>
      
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
          <input 
            type="email" 
            required
            className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textSecondary mb-1">Password</label>
          <input 
            type="password" 
            required
            className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-textPrimary focus:outline-none focus:border-primary transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-surface font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Sign In
        </button>
      </form>
      
      <p className="text-textSecondary text-center mt-6 text-sm">
        Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
