import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState([]);
    const [userData, setUserData] = useState({});  // Data to store the participant's inputs

    useEffect(() => {
        // Fetch event details along with its registration form fields
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/participant/eventbyId/${id}`);
                const eventData = response.data;
                console.log(eventData);
                setEvent(eventData);
                setFormData(eventData.registrationForm); // Set the form fields
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e, fieldName) => {
        setUserData({
            ...userData,
            [fieldName]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/participant/event/${id}/register`, {
                formData: Object.keys(userData).map((key) => ({
                    fieldName: key,
                    value: userData[key],
                }))},{withCredentials : true }
            );

            alert('Registration successful');
            navigate('/participant/registered'); // Redirect to the registered events page
        } catch (error) {
            console.error('Error during registration:', error);
            alert(error.response.data.message || 'Error during registration');
        }
    };

    if (!event) {
        return <div>Loading event details...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    {formData.map((field) => (
                        <div key={field.fieldName} className="mb-4">
                            <label className="block text-gray-700 font-bold">{field.fieldName}</label>
                            <input
                                type={field.fieldType}
                                placeholder={`Enter ${field.fieldName}`}
                                required={field.required}
                                value={userData[field.fieldName] || ''}
                                onChange={(e) => handleChange(e, field.fieldName)}
                                className="border rounded-lg p-2 w-full"
                            />
                        </div>
                    ))}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Register</button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForEvent;
