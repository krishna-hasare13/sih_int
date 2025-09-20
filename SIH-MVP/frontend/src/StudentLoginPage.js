import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    if (!username || !password) {
      setValidationError('Please fill out all fields.');
      return;
    }

    try {
  const response = await fetch('http://127.0.0.1:5000/api/student-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.role === 'student') {
        localStorage.setItem('studentUsername', username);
        navigate('/student-dashboard');
      } else {
        setError(data.message || 'Invalid credentials or not a student account.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 p-6">
      <div className="w-full max-w-md p-10 space-y-8 bg-white/90 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-2">Student Login</h2>
        <p className="text-center text-gray-600 text-lg mb-6">Sign in to view your academic dashboard.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="mt-1 block w-full px-5 py-3 border border-gray-300 bg-white/70 text-gray-800 placeholder-gray-500 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-5 py-3 border border-gray-300 bg-white/70 text-gray-800 placeholder-gray-500 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {validationError && (
            <div className="flex items-center p-3 rounded-lg bg-red-100 text-red-700 font-medium text-sm">
              {validationError}
            </div>
          )}
          {error && (
            <div className="flex items-center p-3 rounded-lg bg-red-100 text-red-700 font-medium text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:ring-offset-white/50 transition-all duration-300"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLoginPage;
