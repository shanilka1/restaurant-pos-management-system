import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [role, setRole] = useState(() => user?.role || null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        try {
            if (token) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setRole(null);
        }
    };

    useEffect(() => {
        if (token && !user) {
            authService.getUser()
                .then(response => {
                    const fetchedUser = response.data.data;
                    setUser(fetchedUser);
                    setRole(fetchedUser.role);
                    localStorage.setItem('user', JSON.stringify(fetchedUser));
                })
                .catch(() => {
                    // Silently fail or logout only if no cached user exists
                    if (!localStorage.getItem('user')) {
                        logout();
                    }
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
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(access_token);
        setUser(userData);
        setRole(userData.role);
        return userData;
    };

    const register = async (data) => {
        const response = await authService.register(data);
        const { user: userData, access_token } = response.data.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(access_token);
        setUser(userData);
        setRole(userData.role);
        return userData;
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
