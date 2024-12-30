import React from "react";
import { useNavigate } from "react-router-dom";

const SymposiumCard = ({ symposium, onDelete }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/event_coordinator/edit-symposium/${symposium._id}`);
    };

    const handleManageEvents = () => {
        navigate(`/event_coordinator/symposium/${symposium._id}/events`);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{symposium.name}</h2>
            <p>{symposium.description}</p>
            <p>
                {new Date(symposium.startDate).toLocaleString()} -{" "}
                {new Date(symposium.endDate).toLocaleString()}
            </p>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handleEdit}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={handleManageEvents}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                >
                    Manage Events
                </button>
                <button
                    onClick={() => onDelete(symposium._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default SymposiumCard;
