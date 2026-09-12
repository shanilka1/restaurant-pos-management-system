import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            authService.getUser()
                .then(response => {
                    setUser(response.data.data);
                    setRole(response.data.data.role);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { user: userData, access_token } = response.data.data;
        
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(userData);
        setRole(userData.role);
    };

    const logout = async () => {
        try {
            if (token) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setRole(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
