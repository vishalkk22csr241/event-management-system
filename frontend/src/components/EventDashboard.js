import React, { useState, useEffect } from "react";
import axios from "axios";

const SymposiumForm = ({ onSymposiumUpdated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "inter_college",
        startDate: "",
        endDate: "",
        venue: "",
    });

    const [filteredVenues, setFilteredVenues] = useState([]);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/event/venues", {
                    withCredentials: true, // Include session cookie
                });
                setFilteredVenues(response.data);
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };
        fetchVenues();
    }, []);

    const handleDateChange = async () => {
        const { startDate, endDate } = formData;
        if (startDate && endDate) {
            try {
                const response = await axios.post("http://localhost:5000/api/event/venues/available", {
                    startDate,
                    endDate,
                }, {
                    withCredentials: true, // Include session cookie
                });
                setFilteredVenues(response.data);
            } catch (error) {
                console.error("Error fetching available venues:", error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "startDate" || name === "endDate") {
            handleDateChange();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/event/symposiums", formData, {
                withCredentials: true,
            });
            alert("Symposium created successfully!");
        } catch (error) {
            console.error("Error creating symposium:", error);
            alert("Failed to create symposium.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
            {/* Name */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    className="w-full border rounded-lg p-2"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                    name="description"
                    className="w-full border rounded-lg p-2"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            {/* Type */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Type</label>
                <select
                    name="type"
                    className="w-full border rounded-lg p-2"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                >
                    <option value="inter_departmental">Inter-Departmental</option>
                    <option value="inter_college">Inter-College</option>
                    <option value="intra_college">Intra-College</option>
                </select>
            </div>

            {/* Start Date */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Start Date</label>
                <input
                    type="datetime-local"
                    name="startDate"
                    className="w-full border rounded-lg p-2"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* End Date */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">End Date</label>
                <input
                    type="datetime-local"
                    name="endDate"
                    className="w-full border rounded-lg p-2"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                />
            </div>

            {/* Venue */}
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Venue</label>
                <select
                    name="venue"
                    className="w-full border rounded-lg p-2"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select a Venue</option>
                    {filteredVenues.map((venue) => (
                        <option key={venue._id} value={venue._id}>
                            {venue.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Symposium
            </button>
        </form>
    );
};

export default SymposiumForm;
