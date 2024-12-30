import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate(`/login/${role}`);
    };

    return (
        <div className="role-selection-container">
            <h1 className="title">Select Your Role</h1>
            <div className="buttons-container">
                <button onClick={() => handleRoleSelect('participant')} className="role-button">Participant</button>
                <button onClick={() => handleRoleSelect('event_coordinator')} className="role-button">Event Coordinator</button>
                <button onClick={() => handleRoleSelect('admin')} className="role-button">Admin</button>
            </div>
        </div>
    );
};

export default RoleSelection;
