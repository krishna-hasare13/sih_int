import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null); // <-- Added state for username

    const login = (role, user) => { // <-- Updated to accept username
        setIsLoggedIn(true);
        setUserRole(role);
        setUsername(user); // <-- Set the username
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setUsername(null); // <-- Clear the username on logout
        window.location.reload(); 
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};