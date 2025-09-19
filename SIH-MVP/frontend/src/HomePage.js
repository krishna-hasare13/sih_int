import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = (role) => {
    // This function will redirect to your login page with the selected role
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI Dropout Prediction and Counseling System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Our system provides a data-driven approach to identify and support at-risk students. By
          analyzing key metrics like attendance, test scores, and fee status, we empower educators
          and counselors with timely insights to intervene early and improve student retention rates.
        </p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Access the Dashboard</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleLoginRedirect('student')}
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Student Login
          </button>
          <button
            onClick={() => handleLoginRedirect('mentor')}
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Mentor Login
          </button>
          <button
            onClick={() => handleLoginRedirect('counselor')}
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            Counselor Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;