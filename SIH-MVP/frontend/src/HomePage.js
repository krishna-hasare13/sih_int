import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthContext } from './AuthContext';

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
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const location = useLocation();

    // Create a ref for the login section
    const loginSectionRef = useRef(null);
    const roleRef = useRef(null);
    const featuresRef = useRef(null);
    const studentCardRef = useRef(null);
    const AdminCardRef = useRef(null);
    const [roleVisible, setRoleVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [studentCardVisible, setStudentCardVisible] = useState(false);
    const [AdminCardVisible, setAdminCardVisible] = useState(false);

    // Scroll to the login section when the component loads if a flag is set in the state
    useEffect(() => {
        if (location.state?.scrollToLogin) {
            loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.state?.scrollToLogin]);

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
        const ref = AdminCardRef.current;
        const observer = new window.IntersectionObserver(
            ([entry]) => setAdminCardVisible(entry.isIntersecting),
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
            <Navbar isLoggedIn={isLoggedIn} username={username} logout={logout} />
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
                    counseling management. Empowering students, Admins, and guardians with
                    data-driven insights for academic success.
                </p>
            </header>

            {/* Login Portals Section */}
            <section id="login-portals-section" ref={loginSectionRef} className="py-20 px-4 text-center">
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
                        ref={AdminCardRef}
                        className={
                            `flex-1 flex flex-col justify-between p-10 rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-emerald-100/80 via-white/90 to-yellow-100/80 transform transition-transform duration-500 hover:scale-105 hover:shadow-3xl animate-card2 ` +
                            (AdminCardVisible ? 'opacity-100 translate-y-0 animate-fadeup' : 'opacity-0 translate-y-12')
                        }
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-4 text-sky-700">Admin Login</h3>
                            <p className="text-gray-700">Monitor all students, identify risks, and manage interventions.</p>
                        </div>
                        <button
                            onClick={() => handleLoginRedirect('Admin')}
                            className="mt-8 w-full py-3 px-4 rounded-xl bg-sky-700 text-white font-bold text-lg shadow-lg hover:bg-sky-800 transition-all duration-300 animate-bouncein2"
                        >
                            Continue as Admin
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 text-center bg-gradient-to-br from-sky-50/90 via-white/90 to-emerald-50/80">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-yellow-500 animate-slidein3 transition-all duration-700 pb-2">
                    Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <FadeUpCard visible={true} delay={0.1}>
                        <h3 className="text-2xl font-bold mb-4 text-sky-700">ML-Driven Risk Assessment</h3>
                        <p className="text-gray-700">Advanced machine learning algorithms analyze academic patterns to identify students at risk of dropping out before it's too late.</p>
                    </FadeUpCard>
                    <FadeUpCard visible={true} delay={0.3}>
                        <h3 className="text-2xl font-bold mb-4 text-emerald-700">Early Intervention System</h3>
                        <p className="text-gray-700">Proactive alerts and automated notifications enable timely interventions through structured counseling programs.</p>
                    </FadeUpCard>
                    <FadeUpCard visible={true} delay={0.5}>
                        <h3 className="text-2xl font-bold mb-4 text-yellow-600">Data-Driven Insights</h3>
                        <p className="text-gray-700">Comprehensive analytics and reporting tools provide actionable insights for educational stakeholders.</p>
                    </FadeUpCard>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default HomePage;