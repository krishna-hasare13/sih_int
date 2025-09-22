import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Navbar = () => {
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 py-4 px-6 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-3">
                    <img src="/logoeklavyafinal.png" alt="Logo" className="h-10 w-10 transition-transform duration-300 hover:rotate-6" />
                    <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-yellow-500">
                        Project Eklavya
                    </Link>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/about" className="text-lg font-semibold text-gray-700 hover:text-sky-600 transition">
                        About Us
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <span className="text-lg font-semibold text-gray-700">Hi, {username}</span>
                            <button 
                                onClick={handleLogout} 
                                className="px-5 py-2 text-sm font-bold rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={handleLoginClick} className="px-5 py-2 text-sm font-bold rounded-full bg-sky-600 text-white shadow-md hover:bg-sky-700 transition">
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;