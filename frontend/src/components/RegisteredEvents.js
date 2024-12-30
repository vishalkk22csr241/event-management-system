import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisteredEvents = () => {
    const [registeredEvents, setRegisteredEvents] = useState([]);
    

    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/participant//registered-events`,{withCredentials : true});
                setRegisteredEvents(response.data);
            } catch (error) {
                console.error('Error fetching registered events:', error);
            }
        };

        fetchRegisteredEvents();
    }, []);


   

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Registered Events</h1>
            <div className="grid grid-cols-1 gap-4">
                {registeredEvents.map((event) => (
                    <div key={event._id} className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">{event.name}</h2>
                        <p>{event.description}</p>
                        <p>Type: {event.type}</p>
                        
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisteredEvents;
