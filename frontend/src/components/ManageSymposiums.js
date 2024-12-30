import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SymposiumCard from "./SymposiumCard";



const ManageSymposiums = () => {
    const navigate = useNavigate();
    const [symposiums, setSymposiums] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSymposiums = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/event/symposiums/manage", {
                withCredentials: true,
            });
            setSymposiums(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching symposiums:", error);
        }
    };

    useEffect(() => {
        fetchSymposiums();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/event/symposiums/${id}`, {
                withCredentials: true,
            });
            alert("Symposium deleted successfully.");
            fetchSymposiums();
        } catch (error) {
            console.error("Error deleting symposium:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Symposiums</h1>
             {/* Create Button */}
             <button
                onClick={() => navigate("/event_coordinator/create-symposium")}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
            >
                Create Symposium
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : symposiums.length > 0 ? (
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {symposiums.map((symposium) => (
                        <SymposiumCard
                            key={symposium._id}
                            symposium={symposium}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <p>No symposiums found.</p>
            )}
        </div>
    );
};

export default ManageSymposiums;
