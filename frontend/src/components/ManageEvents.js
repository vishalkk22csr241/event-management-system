import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const { symposiumId } = useParams();
    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/event/symposiums/${symposiumId}/events`, {
                withCredentials: true,
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [symposiumId]);

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/event/events/${eventId}`, {
                withCredentials: true,
            });
            alert("Event deleted successfully.");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
            {/* Create Button */}
            <button
                onClick={() => navigate(`/event_coordinator/create-event/${symposiumId}`)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
            >
                Create Event
            </button>
            <div className="grid grid-cols-1 gap-4">
                {events.map((event) => (
                    <div key={event._id} className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">{event.name}</h2>
                        <p>{event.description}</p>
                        <p>Type: {event.type}</p>
                        <p>Competition: {event.competitionType}</p>
                        <button
                            onClick={() => navigate(`/event_coordinator/edit-event/${event._id}`)}
                            className="bg-green-500 text-white mt-2 px-4 py-1 rounded"
                        >
                            Edit Event
                        </button>
                        <button
                            onClick={() => navigate(`/event_coordinator/event-participants/${event._id}`)}
                            className="bg-purple-500 text-white mt-2 px-4 py-1 rounded"
                        >
                            View Participants
                        </button>
                        <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="bg-red-500 text-white mt-2 px-4 py-1 rounded"
                        >
                            Delete Event
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageEvents;
