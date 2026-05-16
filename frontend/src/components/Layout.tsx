import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full z-10 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">GigFlow</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.name} <span className="text-xs text-gray-500 dark:text-gray-400">({user?.role})</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
