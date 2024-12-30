import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminManageDepartments from './components/AdminManageDepartments';
import ManageVenue from './components/ManageVenue';
import Navbar from './components/Navbar';
import EventDashboard from './components/EventDashboard';
import ManageEvents from './components/ManageEvents';
import ManageSymposiums from './components/ManageSymposiums';
import EditSymposium from './components/EditSymposium';
import CreateEvent from './components/CreateEvent';
import EditEvent from './components/EditEvent';
import ParticipantSymposiumDashboard from './components/participentDashboard';
import SymposiumEvents from './components/participentevents';
import RegisteredEvents from './components/RegisteredEvents';
import RegisterForEvent from './components/RegisterEventForm';
import EventParticipants from './components/EventParticipants';

import axios from 'axios';

const App = () => {
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/get-role', {
                    withCredentials: true, // Include session cookie
                });
                setRole(response.data.role);
            } catch (err) {
                console.error('Error fetching role:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <Router>
            {/* Show Navbar conditionally */}
            {role && <Navbar role={role} setRole={setRole}  />}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={role ? <Navigate to={`/${role}/dashboard`} /> : <RoleSelection />} />
                <Route
                    path="/login/:role"
                    element={role ? <Navigate to={`/${role}/dashboard`} /> : <Login setRole={setRole} />}
                />

                {/* Event Coordinator Routes */}
                <Route
                    path="/event_coordinator/dashboard"
                    element={role === 'event_coordinator' ? <ManageSymposiums /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/create-symposium"
                    element={role === 'event_coordinator' ? <EventDashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/edit-symposium/:id"
                    element={role === 'event_coordinator' ? <EditSymposium /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/symposium/:symposiumId/events"
                    element={role === 'event_coordinator' ? <ManageEvents /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/create-event/:symposiumId"
                    element={role === 'event_coordinator' ? <CreateEvent /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/edit-event/:eventId"
                    element={role === 'event_coordinator' ? <EditEvent /> : <Navigate to="/" />}
                />
                <Route
                    path="/event_coordinator/event-participants/:eventId"
                    element={role === 'event_coordinator' ? <EventParticipants /> : <Navigate to="/" />}
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/manage-departments"
                    element={role === 'admin' ? <AdminManageDepartments /> : <Navigate to="/" />}
                />
                <Route
                    path="/admin/manage-venue"
                    element={role === 'admin' ? <ManageVenue /> : <Navigate to="/" />}
                />

                {/* Participant Routes */}
                <Route
                    path="/participant/dashboard"
                    element={role === 'participant' ? <ParticipantSymposiumDashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/participant/symposium/:symposiumid/events"
                    element={role === 'participant' ? <SymposiumEvents /> : <Navigate to="/" />}
                />
                <Route
                    path="/participant/registered"
                    element={role === 'participant' ? <RegisteredEvents /> : <Navigate to="/" />}
                />
                <Route
                    path="/participant/event/:id/register"
                    element={role === 'participant' ? <RegisterForEvent /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
