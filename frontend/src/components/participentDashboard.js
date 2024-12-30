import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ParticipantSymposiumDashboard = () => {
    const [symposiums, setSymposiums] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSymposiums = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/participant/symposiums');
                setSymposiums(response.data);
            } catch (error) {
                console.error('Error fetching symposiums:', error);
            }
        };

        fetchSymposiums();
    }, []);

    

    const handleSymposiumClick = (id) => {
        navigate(`/participant/symposium/${id}/events`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Symposiums</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {symposiums.map((symposium) => (
                    <div
                        key={symposium._id}
                        className="p-4 bg-white rounded-lg shadow cursor-pointer"
                        onClick={() => handleSymposiumClick(symposium._id)}
                    >
                        <h2 className="font-bold text-lg">{symposium.name}</h2>
                        <p>{symposium.description}</p>
                        <p>StartDate: {new Date(symposium.startDate).toLocaleDateString()}</p>
                        <p>EndDate: {new Date(symposium.endDate).toLocaleDateString()}</p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipantSymposiumDashboard;
