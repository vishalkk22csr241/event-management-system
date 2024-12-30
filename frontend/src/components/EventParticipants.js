import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventParticipants = () => {
    const { eventId } = useParams();
    const [formField, setformField] = useState([]);
    const [participants, setParticipants] = useState([]);

    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/event/${eventId}/participants`, {
                withCredentials: true,
            });
            console.log(response.data);
            setformField(response.data.registrationForm);
            setParticipants(response.data.participants);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [eventId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Event Participants</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                {formField.map((field, index) => (
                            
                            
                                
                                    <td className="border px-4 py-2">{field.fieldName}</td>
                                
                                ))}
                                </tr>
                </thead>
                {participants.map((participant, index) => (
                        <tr>
                            
                            
                                {Object.entries(participant.participantData || {}).map(([key, value]) => (
                                    <td className="border px-4 py-2">{value.value}</td>
                                ))}
                        </tr>
                    ))}
                <tbody>
                    
                </tbody>
            </table>
        </div>
    );
};

export default EventParticipants;
