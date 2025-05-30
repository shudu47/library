import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username and password are required');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/admin');
      } else {
        setErrorMsg('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-primary-700 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Administrator Login</h1>
          <p className="text-primary-100 mt-2">
            Access the library management system
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
              {errorMsg}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-10"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full py-2.5"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center text-sm text-gray-500">
            <p>This login is restricted to library administrators only.</p>
            <p className="mt-1">
              Students can search and check book availability without logging in.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;