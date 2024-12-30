import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ role ,setRole }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
            setRole(null); // Clear role state
            navigate('/', { replace: true }); // Redirect to root
        
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Failed to logout. Please try again.');
        }
    };

    const getNavLinks = () => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard' },
                    { name: 'Manage Departments', path: '/admin/manage-departments' },
                    { name: 'Manage Venue', path: '/admin/manage-venue' },
                ];
            case 'event_coordinator':
                return [
                    { name: 'Dashboard', path: '/event_coordinator/dashboard' },
                    { name: 'Create Symposium', path: '/event_coordinator/create-symposium' },
                ];
            case 'participant':
                    return [
                        { name: 'Dashboard', path: '/participant/dashboard' },
                        { name: 'Registered Events', path: '/participant/registered' },
                    ];
            default:
                return [];
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold hover:text-gray-200">
                    Event Manager
                </Link>
                
                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    {getNavLinks().map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative hover:text-gray-200 transition duration-200 ${
                                location.pathname === link.path
                                    ? 'text-white after:w-full'
                                    : 'text-gray-300 after:w-0'
                            }`}
                        >
                            {link.name}
                            <span
                                className={`absolute left-0 bottom-0 h-1 bg-white transition-all duration-300 ${
                                    location.pathname === link.path ? 'w-full' : 'w-0'
                                }`}
                            />
                        </Link>
                    ))}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
