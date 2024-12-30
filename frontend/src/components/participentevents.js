import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SymposiumEvents = () => {
    const { symposiumid } = useParams();
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/participant/symposiums/${symposiumid}/events`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [symposiumid]);


    const handleEventClick = (id) => {
        navigate(`/participant/event/${id}/register`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Events in Symposium</h1>
            <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                    <div key={event._id} className="p-4 bg-white rounded-lg shadow"  onClick={() => handleEventClick(event._id)}>
                        <h2 className="font-bold text-lg">{event.name}</h2>
                        <p>{event.description}</p>
                        <p>Type: {event.type}</p>
                        <p>
                        Registration Start At: {new Date(event.registrationStart).toLocaleDateString()} at{' '}
                            {new Date(event.registrationStart).toLocaleTimeString()}
                        </p>

                        <p>
                        Registration End At: {new Date(event.registrationEnd).toLocaleDateString()} at{' '}
                            {new Date(event.registrationEnd).toLocaleTimeString()}
                        </p>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SymposiumEvents;
