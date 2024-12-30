import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateEvent = ({  onEventCreated }) => {
    const { symposiumId } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "technical",
        competitionType: "solo",
        eligibilityCriteria: "",
        registrationStart: "",
        registrationEnd: "",
        maxParticipants: "",
        symposium: symposiumId,
        poster: null,
        registrationForm: [],
    });

    const [symposiums, setSymposiums] = useState([]);

    // Fetch symposiums for selection if symposiumId is not provided
    useEffect(() => {
        if (!symposiumId) {
            const fetchSymposiums = async () => {
                const response = await axios.get("http://localhost:5000/api/event/symposiums", {
                    withCredentials: true,
                });
                setSymposiums(response.data);
            };
            fetchSymposiums();
        }
    }, [symposiumId]);

    const handleDeleteField = (index) => {
        setFormData((prev) => ({
            ...prev,
            registrationForm: prev.registrationForm.filter((_, i) => i !== index),
        }));
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, poster: e.target.files[0] }));
    };

    const handleAddField = () => {
        setFormData((prev) => ({
            ...prev,
            registrationForm: [...prev.registrationForm, { fieldName: "", fieldType: "text", required: false }],
        }));
    };

    const handleFieldChange = (index, field, value) => {
        const updatedForm = [...formData.registrationForm];
        updatedForm[index][field] = value;
        setFormData((prev) => ({ ...prev, registrationForm: updatedForm }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventFormData = new FormData();

Object.keys(formData).forEach((key) => {
    if (key === "registrationForm") {
        eventFormData.append(key, JSON.stringify(formData[key])); // Serialize form
    } else if (key === "poster" && formData[key] instanceof File) {
        eventFormData.append(key, formData[key]); // Handle poster file
    } else {
        eventFormData.append(key, formData[key]); // Other fields
    }
});


        try {
            await axios.post(`http://localhost:5000/api/event/symposiums/${symposiumId}/events`, eventFormData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            alert("Event created successfully!");
            
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
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

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                    name="description"
                    className="w-full border rounded-lg p-2"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Type</label>
                <select
                    name="type"
                    className="w-full border rounded-lg p-2"
                    value={formData.type}
                    onChange={handleInputChange}
                >
                    <option value="technical">Technical</option>
                    <option value="non_technical">Non-Technical</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Competition Type</label>
                <select
                    name="competitionType"
                    className="w-full border rounded-lg p-2"
                    value={formData.competitionType}
                    onChange={handleInputChange}
                >
                    <option value="solo">Solo</option>
                    <option value="team">Team</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Eligibility Criteria</label>
                <input
                    type="text"
                    name="eligibilityCriteria"
                    className="w-full border rounded-lg p-2"
                    value={formData.eligibilityCriteria}
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Registration Start</label>
                <input
                    type="datetime-local"
                    name="registrationStart"
                    className="w-full border rounded-lg p-2"
                    value={formData.registrationStart}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Registration End</label>
                <input
                    type="datetime-local"
                    name="registrationEnd"
                    className="w-full border rounded-lg p-2"
                    value={formData.registrationEnd}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Max Participants</label>
                <input
                    type="number"
                    name="maxParticipants"
                    className="w-full border rounded-lg p-2"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                />
            </div>

            {!symposiumId && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Symposium</label>
                    <select
                        name="symposium"
                        className="w-full border rounded-lg p-2"
                        value={formData.symposium}
                        onChange={handleInputChange}
                    >
                        {symposiums.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Poster</label>
                <input type="file" name="poster" onChange={handleFileChange} />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Registration Form Fields</label>
                {formData.registrationForm.map((field, index) => (
                    <div key={index} className="flex items-center gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Field Name"
                            value={field.fieldName}
                            onChange={(e) => handleFieldChange(index, "fieldName", e.target.value)}
                            className="border rounded-lg p-2 flex-1"
                        />
                        <select
                            value={field.fieldType}
                            onChange={(e) => handleFieldChange(index, "fieldType", e.target.value)}
                            className="border rounded-lg p-2"
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                        </select>
                        <label>
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                    handleFieldChange(index, "required", e.target.checked)
                                }
                            />
                            Required
                        </label>
                        <button
                             type="button"
                             onClick={() => handleDeleteField(index)}
                             className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                        >
                                 Delete
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddField}
                    className="bg-green-500 text-white py-1 px-4 rounded"
                >
                    Add Field
                </button>
            </div>

            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Event
            </button>
        </form>
    );
};

export default CreateEvent;
