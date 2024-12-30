import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageVenue = () => {
    const [venues, setVenues] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        incharge: '',
        capacity: '',
        type: 'Seminar Hall',
        department: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch venues
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/venues', { withCredentials: true });
                setVenues(response.data.venues);
            } catch (err) {
                console.error('Failed to fetch venues:', err);
            }
        };

        fetchVenues();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add a new venue
    const handleAddVenue = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/admin/add-venue', formData, { withCredentials: true });
            setVenues([...venues, response.data.venue]);
            setSuccess('Venue added successfully!');
            setError('');
            setFormData({ name: '', incharge: '', capacity: '', type: 'Seminar Hall', department: '' });
        } catch (err) {
            setError('Failed to add venue. Please try again.');
            setSuccess('');
        }
    };

    // Delete a venue
    const handleDeleteVenue = async (id) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-venue/${id}`, { withCredentials: true });
                setVenues(venues.filter((venue) => venue._id !== id));
                setSuccess('Venue deleted successfully!');
                setError('');
            } catch (err) {
                setError('Failed to delete venue.');
                setSuccess('');
            }
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-center">Manage Venues</h1>

            {/* Add Venue Form */}
            <form onSubmit={handleAddVenue} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg mx-auto space-y-4">
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Venue Name"
                    className="border p-2 w-full rounded"
                    required
                />
                <input
                    type="text"
                    name="incharge"
                    value={formData.incharge}
                    onChange={handleInputChange}
                    placeholder="In-Charge Name"
                    className="border p-2 w-full rounded"
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Capacity"
                    className="border p-2 w-full rounded"
                    required
                />
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded"
                >
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                </select>
                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="border p-2 w-full rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600">
                    Add Venue
                </button>
            </form>

            {/* Venue List */}
            <h2 className="text-2xl font-semibold mb-4 text-center">Existing Venues</h2>
            {venues.length === 0 ? (
                <p className="text-center text-gray-600">No venues available.</p>
            ) : (
                <ul className="space-y-6 max-w-4xl mx-auto">
                    {venues.map((venue) => (
                        <li key={venue._id} className="bg-white p-6 rounded shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{venue.name}</h3>
                                <p className="text-gray-700">In-Charge: {venue.incharge}</p>
                                <p className="text-gray-700">Capacity: {venue.capacity}</p>
                                <p className="text-gray-700">Type: {venue.type}</p>
                                <p className="text-gray-700">Department: {venue.department}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteVenue(venue._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageVenue;
