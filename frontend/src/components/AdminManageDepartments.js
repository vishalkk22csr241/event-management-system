import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ name: "", duration: "" });
    const [newSection, setNewSection] = useState({ departmentId: "", sectionName: "" });

    // Fetch all departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/departments", {
                withCredentials: true, // Include session cookie
            });
            setDepartments(response.data.departments);
        } catch (error) {
            console.error("Error fetching departments:", error);
            alert("Error fetching departments.");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Create a new department
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/admin/create-department", newDepartment, {
                withCredentials: true,
            });
            alert("Department created successfully!");
            setNewDepartment({ name: "", duration: "" });
            fetchDepartments();
        } catch (error) {
            console.error("Error creating department:", error);
            alert("Error creating department.");
        }
    };

    // Add a new section
    const handleAddSection = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:5000/api/admin/add-section/${newSection.departmentId}`,
                { sectionName: newSection.sectionName },
                {
                    withCredentials: true,
                }
            );
            alert("Section added successfully!");
            setNewSection({ departmentId: "", sectionName: "" });
            fetchDepartments();
        } catch (error) {
            console.error("Error adding section:", error);
            alert("Error adding section.");
        }
    };

    // Delete a Department
    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-department/${departmentId}`, {
                    withCredentials: true,
                });
                alert("Department deleted successfully!");
                fetchDepartments();
            } catch (error) {
                console.error("Error deleting department:", error);
                alert("Error deleting department.");
            }
        }
    };

    // Delete a section
    const handleDeleteSection = async (departmentId, sectionId) => {
        if (window.confirm("Are you sure you want to delete this section?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-section/${departmentId}/${sectionId}`, {
                    withCredentials: true,
                });
                alert("Section deleted successfully!");
                fetchDepartments();
            } catch (error) {
                console.error("Error deleting section:", error);
                alert("Error deleting section.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Departments</h1>

            {/* Create Department */}
            <form
                onSubmit={handleCreateDepartment}
                className="mb-8 p-4 bg-white shadow-md rounded-md space-y-4"
            >
                <h2 className="text-xl font-semibold">Create Department</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Department Name"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Course Duration (years)"
                        value={newDepartment.duration}
                        onChange={(e) => setNewDepartment({ ...newDepartment, duration: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Create
                </button>
            </form>

            {/* Department List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept._id} className="p-4 bg-white shadow-md rounded-md">
                        <h3 className="text-lg font-bold mb-2">
                            {dept.name} ({dept.duration} years)
                        </h3>
                        <button
                            onClick={() => handleDeleteDepartment(dept._id)}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 mb-4"
                        >
                            Delete
                        </button>
                        <ul className="mb-4">
                            {dept.sections.map((section) => (
                                <li key={section._id} className="flex justify-between items-center">
                                    <span>{section.name}</span>
                                    <button
                                        onClick={() => handleDeleteSection(dept._id, section._id)}
                                        className="bg-red-400 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleAddSection} className="space-y-2">
                            <input
                                type="text"
                                placeholder="New Section Name"
                                value={newSection.sectionName}
                                onChange={(e) => setNewSection({ departmentId: dept._id, sectionName: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Add Section
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminManageDepartments;
