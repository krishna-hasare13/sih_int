import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// FadeUpCard component for feature cards
function FadeUpCard({ visible, delay, children }) {
    return (
        <div
            className={
                `bg-white/90 p-10 rounded-3xl shadow-xl border-0 transform transition-transform duration-500 hover:scale-105 ` +
                (visible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
            }
            style={{ animationDelay: visible ? `${delay}s` : '0s' }}
        >
            {children}
        </div>
    );
}

const HomePage = () => {
    const navigate = useNavigate();
    // Refs and state for scroll animations
    const roleRef = useRef(null);
    const featuresRef = useRef(null);
    const studentCardRef = useRef(null);
    const mentorCardRef = useRef(null);
    const [roleVisible, setRoleVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [studentCardVisible, setStudentCardVisible] = useState(false);
    const [mentorCardVisible, setMentorCardVisible] = useState(false);

    useEffect(() => {
        const ref = roleRef.current;
        const observer = new window.IntersectionObserver(
            ([entry]) => setRoleVisible(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (ref) observer.observe(ref);
        return () => { if (ref) observer.unobserve(ref); };
    }, []);

    useEffect(() => {
        const ref = featuresRef.current;
        const observer = new window.IntersectionObserver(
            ([entry]) => setFeaturesVisible(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (ref) observer.observe(ref);
        return () => { if (ref) observer.unobserve(ref); };
    }, []);

    useEffect(() => {
        const ref = studentCardRef.current;
        const observer = new window.IntersectionObserver(
            ([entry]) => setStudentCardVisible(entry.isIntersecting),
            { threshold: 0.2 }
        );
        if (ref) observer.observe(ref);
        return () => { if (ref) observer.unobserve(ref); };
    }, []);

    useEffect(() => {
        const ref = mentorCardRef.current;
        const observer = new window.IntersectionObserver(
            ([entry]) => setMentorCardVisible(entry.isIntersecting),
            { threshold: 0.2 }
        );
        if (ref) observer.observe(ref);
        return () => { if (ref) observer.unobserve(ref); };
    }, []);

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
                <img src="/logoeklavyafinal.png" alt="Project Eklavya Logo" style={{ height: 340, width: 'auto', marginBottom: 10 }} className="z-10 transition-transform duration-500 hover:scale-105" />
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-400 drop-shadow-lg z-10 animate-slidein pb-2">Project Eklavya</h1>
                <p className="text-2xl mt-4 text-gray-700 font-medium z-10 animate-fadein2 pb-1">Empowering Futures • Growing Together</p>
                <p className="text-lg mt-1 text-blue-500 font-semibold z-10 animate-fadein3">Academic Excellence Platform</p>
                <h2 className="text-3xl md:text-4xl font-bold mt-12 text-gray-800 z-10 animate-fadein4 pb-2">Helping Students Stay on Track</h2>
                <p className="text-lg md:text-xl max-w-3xl mt-4 text-gray-700 z-10 animate-fadein5">
                    AI-powered educational dashboard system for dropout prevention and student
                    counseling management. Empowering students, mentors, and guardians with
                    data-driven insights for academic success.
                </p>
            </header>

            {/* Login Portals Section */}
            <section className="py-20 px-4 text-center">
                <h2
                    ref={roleRef}
                    className={
                        `text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-yellow-500 mb-12 transition-all duration-700 pb-2 ` +
                        (roleVisible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
                    }
                >
                    Choose Your Role
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-10 max-w-5xl mx-auto items-stretch">
                    <div
                        ref={studentCardRef}
                        className={
                            `flex-1 flex flex-col justify-between p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 transform transition-transform duration-500 hover:scale-105 hover:shadow-3xl animate-card1 ` +
                            (studentCardVisible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
                        }
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-sky-700">Student Login</h3>
                            <p className="text-gray-700">Access your academic progress and risk status.</p>
                        </div>
                        <button
                            onClick={() => handleLoginRedirect('student')}
                            className="mt-8 w-full py-3 px-4 rounded-xl bg-sky-700 text-white font-bold text-lg shadow-lg hover:bg-sky-800 transition-all duration-300 animate-bouncein"
                        >
                            Continue as Student
                        </button>
                    </div>
                    <div
                        ref={mentorCardRef}
                        className={
                            `flex-1 flex flex-col justify-between p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-100/80 via-white/90 to-yellow-100/80 transform transition-transform duration-500 hover:scale-105 hover:shadow-3xl animate-card2 ` +
                            (mentorCardVisible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
                        }
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-sky-700">Mentor Login</h3>
                            <p className="text-gray-700">Monitor all students, identify risks, and manage interventions.</p>
                        </div>
                        <button
                            onClick={() => handleLoginRedirect('mentor')}
                            className="mt-8 w-full py-3 px-4 rounded-xl bg-sky-700 text-white font-bold text-lg shadow-lg hover:bg-sky-800 transition-all duration-300 animate-bouncein2"
                        >
                            Continue as Mentor
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 text-center bg-gradient-to-br from-sky-50/90 via-white/90 to-emerald-50/80">
                <h2
                    ref={featuresRef}
                    className={
                        `text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-yellow-500 animate-slidein3 transition-all duration-700 pb-2 ` +
                        (featuresVisible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
                    }
                >
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <FadeUpCard visible={featuresVisible} delay={0.1}>
                        <h3 className="text-2xl font-bold mb-4 text-sky-700">ML-Driven Risk Assessment</h3>
                        <p className="text-gray-700">Advanced machine learning algorithms analyze academic patterns to identify students at risk of dropping out before it's too late.</p>
                    </FadeUpCard>
                    <FadeUpCard visible={featuresVisible} delay={0.3}>
                        <h3 className="text-2xl font-bold mb-4 text-emerald-700">Early Intervention System</h3>
                        <p className="text-gray-700">Proactive alerts and automated notifications enable timely interventions through structured counseling programs.</p>
                    </FadeUpCard>
                    <FadeUpCard visible={featuresVisible} delay={0.5}>
                        <h3 className="text-2xl font-bold mb-4 text-yellow-600">Data-Driven Insights</h3>
                        <p className="text-gray-700">Comprehensive analytics and reporting tools provide actionable insights for educational stakeholders.</p>
                    </FadeUpCard>
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
                @keyframes fadeup { from { opacity: 0; transform: translateY(48px);} to { opacity: 1; transform: none;} }
                .animate-fadeup { animation: fadeup 0.9s cubic-bezier(0.23, 1, 0.32, 1) both; }
            `}</style>
        </div>
    );
}

export default HomePage;