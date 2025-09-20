import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = (role) => {
        if (role === 'student') {
            navigate('/student-login');
        } else {
            navigate(`/login?role=${role}`);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center text-center p-16 md:p-24 bg-white shadow-md">
                <img src="/logo.png" alt="Abhyudaya Logo" className="h-24 w-24 mb-4" />
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">Abhyudaya</h1>
                <p className="text-xl mt-2 text-gray-600">Empowering Futures • Growing Together</p>
                <p className="text-md mt-1 text-blue-600 font-medium">Academic Excellence Platform</p>
                <h2 className="text-3xl md:text-4xl font-bold mt-12 text-gray-800">Helping Students Stay on Track</h2>
                <p className="text-lg md:text-xl max-w-3xl mt-4 text-gray-700">
                    AI-powered educational dashboard system for dropout prevention and student
                    counseling management. Empowering students, mentors, and guardians with
                    data-driven insights for academic success.
                </p>
            </header>

            {/* Login Portals Section */}
            <section className="p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Choose Your Role</h2>
                <div className="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto">
                    <div className="flex-1 p-8 rounded-xl shadow-lg border border-gray-200 bg-white">
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">Student Login</h3>
                        <p className="text-gray-600">Access your academic progress and risk status.</p>
                        <button
                            onClick={() => handleLoginRedirect('student')}
                            className="mt-6 w-full py-3 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Continue as Student
                        </button>
                    </div>
                    <div className="flex-1 p-8 rounded-xl shadow-lg border border-gray-200 bg-white">
                        <h3 className="text-2xl font-bold mb-4 text-purple-600">Mentor Login</h3>
                        <p className="text-gray-600">Monitor all students, identify risks, and manage interventions.</p>
                        <button
                            onClick={() => handleLoginRedirect('mentor')}
                            className="mt-6 w-full py-3 px-4 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                        >
                            Continue as Mentor
                        </button>
                    </div>
                    <div className="flex-1 p-8 rounded-xl shadow-lg border border-gray-200 bg-white">
                        <h3 className="text-2xl font-bold mb-4 text-red-600">Counselor Login</h3>
                        <p className="text-gray-600">View student data and provide guidance with data-driven insights.</p>
                        <button
                            onClick={() => handleLoginRedirect('counselor')}
                            className="mt-6 w-full py-3 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        >
                            Continue as Counselor
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="p-16 text-center bg-gray-50">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">ML-Driven Risk Assessment</h3>
                        <p className="text-gray-600">Advanced machine learning algorithms analyze academic patterns to identify students at risk of dropping out before it's too late.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Early Intervention System</h3>
                        <p className="text-gray-600">Proactive alerts and automated notifications enable timely interventions through structured counseling programs.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Data-Driven Insights</h3>
                        <p className="text-gray-600">Comprehensive analytics and reporting tools provide actionable insights for educational stakeholders.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;