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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-gray-900 animate-fadein">
            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center text-center py-20 md:py-32 px-4 bg-gradient-to-br from-sky-100/90 via-white/90 to-emerald-100/80 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-sky-400/30 via-emerald-400/20 to-white/10 rounded-full blur-3xl animate-blob1"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-300/30 via-sky-400/20 to-white/10 rounded-full blur-3xl animate-blob2"></div>
                </div>
                <img src="/logoeklavyafinal.png" alt="Project Eklavya Logo" style={{ height: 180, width: 'auto', marginBottom: 16, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }} className="z-10 transition-transform duration-500 hover:scale-105" />
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-400 drop-shadow-lg z-10 animate-slidein">Project Eklavya</h1>
                <p className="text-2xl mt-4 text-gray-700 font-medium z-10 animate-fadein2">Empowering Futures • Growing Together</p>
                <p className="text-lg mt-1 text-blue-500 font-semibold z-10 animate-fadein3">Academic Excellence Platform</p>
                <h2 className="text-3xl md:text-4xl font-bold mt-12 text-gray-800 z-10 animate-fadein4">Helping Students Stay on Track</h2>
                <p className="text-lg md:text-xl max-w-3xl mt-4 text-gray-700 z-10 animate-fadein5">
                    AI-powered educational dashboard system for dropout prevention and student
                    counseling management. Empowering students, mentors, and guardians with
                    data-driven insights for academic success.
                </p>
            </header>

            {/* Login Portals Section */}
            <section className="py-20 px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-yellow-500 mb-12 animate-slidein2">Choose Your Role</h2>
                <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto items-stretch">
                    <div className="flex-1 flex flex-col justify-between p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 transform transition-transform duration-500 hover:scale-105 hover:shadow-3xl animate-card1">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-purple-700">Student Login</h3>
                            <p className="text-gray-700">Access your academic progress and risk status.</p>
                        </div>
                        <button
                            onClick={() => handleLoginRedirect('student')}
                            className="mt-8 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 animate-bouncein"
                        >
                            Continue as Student
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-100/80 via-white/90 to-yellow-100/80 transform transition-transform duration-500 hover:scale-105 hover:shadow-3xl animate-card2">
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-purple-700">Mentor Login</h3>
                            <p className="text-gray-700">Monitor all students, identify risks, and manage interventions.</p>
                        </div>
                        <button
                            onClick={() => handleLoginRedirect('mentor')}
                            className="mt-8 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 animate-bouncein2"
                        >
                            Continue as Mentor
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 text-center bg-gradient-to-br from-sky-50/90 via-white/90 to-emerald-50/80">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-yellow-500 animate-slidein3">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <div className="bg-white/90 p-10 rounded-3xl shadow-xl border-0 transform transition-transform duration-500 hover:scale-105 animate-card3">
                        <h3 className="text-2xl font-bold mb-4 text-sky-700">ML-Driven Risk Assessment</h3>
                        <p className="text-gray-700">Advanced machine learning algorithms analyze academic patterns to identify students at risk of dropping out before it's too late.</p>
                    </div>
                    <div className="bg-white/90 p-10 rounded-3xl shadow-xl border-0 transform transition-transform duration-500 hover:scale-105 animate-card4">
                        <h3 className="text-2xl font-bold mb-4 text-emerald-700">Early Intervention System</h3>
                        <p className="text-gray-700">Proactive alerts and automated notifications enable timely interventions through structured counseling programs.</p>
                    </div>
                    <div className="bg-white/90 p-10 rounded-3xl shadow-xl border-0 transform transition-transform duration-500 hover:scale-105 animate-card5">
                        <h3 className="text-2xl font-bold mb-4 text-yellow-600">Data-Driven Insights</h3>
                        <p className="text-gray-700">Comprehensive analytics and reporting tools provide actionable insights for educational stakeholders.</p>
                    </div>
                </div>
            </section>
            {/* Animations (Tailwind custom classes or add to your CSS) */}
            <style>{`
                @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadein { animation: fadein 1s ease-in; }
                @keyframes fadein2 { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} }
                .animate-fadein2 { animation: fadein2 1.2s 0.2s both; }
                .animate-fadein3 { animation: fadein2 1.2s 0.4s both; }
                .animate-fadein4 { animation: fadein2 1.2s 0.6s both; }
                .animate-fadein5 { animation: fadein2 1.2s 0.8s both; }
                @keyframes slidein { from { opacity: 0; transform: translateY(-40px);} to { opacity: 1; transform: none;} }
                .animate-slidein { animation: slidein 1.2s 0.1s both; }
                .animate-slidein2 { animation: slidein 1.2s 0.3s both; }
                .animate-slidein3 { animation: slidein 1.2s 0.5s both; }
                @keyframes bouncein { 0% { transform: scale(0.9);} 60% { transform: scale(1.05);} 100% { transform: scale(1);} }
                .animate-bouncein { animation: bouncein 0.8s 0.6s both; }
                .animate-bouncein2 { animation: bouncein 0.8s 0.8s both; }
                @keyframes blob1 { 0%, 100% { transform: scale(1) translateY(0);} 50% { transform: scale(1.1) translateY(20px);} }
                .animate-blob1 { animation: blob1 12s infinite ease-in-out; }
                @keyframes blob2 { 0%, 100% { transform: scale(1) translateY(0);} 50% { transform: scale(1.08) translateY(-20px);} }
                .animate-blob2 { animation: blob2 14s infinite ease-in-out; }
                .animate-card1 { animation: fadein2 1.2s 1.0s both; }
                .animate-card2 { animation: fadein2 1.2s 1.2s both; }
                .animate-card3 { animation: fadein2 1.2s 1.4s both; }
                .animate-card4 { animation: fadein2 1.2s 1.6s both; }
                .animate-card5 { animation: fadein2 1.2s 1.8s both; }
            `}</style>
        </div>
    );
};

export default HomePage;