import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({setRole}) => {
    const { role } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:5000/auth/login`,
                { email, password, role },
                { withCredentials: true } // Include cookies in the request
            );

            setRole(role); // Update role in App state
            navigate(`/${role}/dashboard`, { replace: true }); // Redirect to dashboard
        
         } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h1>
                <form onSubmit={handleLogin} className="login-form">
                    {error && <p className="login-error">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
