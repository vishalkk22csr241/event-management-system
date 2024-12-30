import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'participant',
        rollNo: '',
        dept: '',
        yearOfStudy: '',
        passOutYear: '',
        section: '',
        clubName: '',
        venueName: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/users', {
                    withCredentials: true,
                });
                setUsers(response.data.users || {});
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (id, currentRole, newRole) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/change-role/${id}`,
                { currentRole, newRole },
                { withCredentials: true }
            );
            setSuccess('Role updated successfully!');
            setTimeout(() => setSuccess(''), 3000); // Auto-hide success message
            window.location.reload(); // Refresh user list
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating role');
            setTimeout(() => setError(''), 3000); // Auto-hide error message
        }
    };

    const handleDelete = async (id, role) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
                    data: { role },
                    withCredentials: true,
                });
                setSuccess('User deleted successfully!');
                setTimeout(() => setSuccess(''), 3000);
                window.location.reload();
            } catch (error) {
                setError(error.response?.data?.message || 'Error deleting user');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            setTimeout(() => setError(''), 3000);
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:5000/api/admin/create-user',
                formData,
                { withCredentials: true }
            );
            const newUser = response.data.user;
            setUsers((prev) => ({
                ...prev,
                [formData.role]: [...(prev[formData.role] || []), newUser],
            }));
            setSuccess('User created successfully!');
            setTimeout(() => setSuccess(''), 3000);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'participant',
                rollNo: '',
                dept: '',
                yearOfStudy: '',
                passOutYear: '',
                section: '',
                clubName: '',
                venueName: '',
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating user');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

            {/* Notifications */}
            {success && <div className="bg-green-500 text-white p-3 mb-4 rounded">{success}</div>}
            {error && <div className="bg-red-500 text-white p-3 mb-4 rounded">{error}</div>}

            {/* Create User Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-2xl font-semibold mb-4">Create User</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        required
                    >
                        <option value="participant">Participant</option>
                        <option value="event_coordinator">Event Coordinator</option>
                        <option value="venue_incharge">Venue In-Charge</option>
                        <option value="admin">Admin</option>
                    </select>
                    {/* Role-specific fields */}
                    {formData.role === 'participant' && (
                        <>
                            <input
                                type="text"
                                name="rollNo"
                                placeholder="Roll Number"
                                value={formData.rollNo}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="dept"
                                placeholder="Department"
                                value={formData.dept}
                                onChange={handleInputChange}
                                className="p-2 border rounded"
                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="col-span-1 md:col-span-2 bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Create User
                    </button>
                </form>
            </div>

            {/* Existing Users Table */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold mb-4">Existing Users</h2>
                {Object.keys(users).length === 0 ? (
                    <p className="text-gray-500">No users found.</p>
                ) : (
                    Object.keys(users).map((role) => (
                        <div key={role} className="mb-6">
                            <h3 className="text-xl font-bold mb-2 capitalize">{role}</h3>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b py-2">Name</th>
                                        <th className="border-b py-2">Email</th>
                                        <th className="border-b py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users[role].map((user) => (
                                        <tr key={user._id}>
                                            <td className="border-b py-2">{user.name}</td>
                                            <td className="border-b py-2">{user.email}</td>
                                            <td className="border-b py-2 flex gap-2">
                                                <select
                                                    value={role}
                                                    onChange={(e) =>
                                                        handleRoleChange(user._id, role, e.target.value)
                                                    }
                                                    className="p-1 border rounded"
                                                >
                                                    {Object.keys(users).map((r) => (
                                                        <option key={r} value={r}>
                                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="bg-red-500 text-white py-1 px-3 rounded"
                                                    onClick={() => handleDelete(user._id, role)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
