import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const UserManagement = () => {
    // CSV Import/Export
    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            // Parse CSV (assume header: username,password,role)
            const lines = text.split(/\r?\n/).filter(Boolean);
            const header = lines[0].split(',');
            const usersToAdd = lines.slice(1).map(line => {
                const values = line.split(',');
                return {
                    username: values[header.indexOf('username')],
                    password: values[header.indexOf('password')],
                    role: values[header.indexOf('role')] || 'admin',
                };
            });
            // Send each user to backend
            for (const user of usersToAdd) {
                await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });
            }
            setRefresh(prev => !prev);
            alert('CSV import complete!');
        };
        reader.readAsText(file);
    };

    const handleExportCSV = () => {
        if (!users.length) return;
        const header = 'username,role';
        const rows = users.map(u => `${u.username},${u.role}`);
        const csvContent = [header, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [message, setMessage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const { isLoggedIn, userRole } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn && userRole === 'admin') {
            fetch('http://127.0.0.1:5000/api/users')
                .then(res => res.json())
                .then(data => setUsers(data));
        }
    }, [refresh, isLoggedIn, userRole]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();
        setMessage(data.message);
        if (response.ok) {
            setRefresh(prev => !prev);
            setUsername('');
            setPassword('');
        }
    };
    
    const handleUpdateUser = async (user) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username, role: editRole }),
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            setEditingUser(null);
            setRefresh(prev => !prev);
        }
    } catch (error) {
        alert("An error occurred while updating.");
    }
};

    const handleDeleteUser = async (username) => {
        if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
            const response = await fetch(`http://127.0.0.1:5000/api/user/delete/${username}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                setRefresh(prev => !prev);
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
            {/* CSV Import/Export Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <label className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 font-semibold transition">
                        Upload CSV
                        <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
                    </label>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition"
                >
                    Export Users as CSV
                </button>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>
            <p className="text-gray-600 mb-8">Create new user accounts and manage existing ones.</p>

            {/* Create User Form */}
            <form onSubmit={handleCreateUser} className="space-y-4 mb-10 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Create User</button>
                {message && <p className="mt-2 text-sm text-center font-medium">{message}</p>}
            </form>

            {/* User List Table */}
            <div className="overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Users</h3>
                <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {editingUser?.username === user.username ? (
                                        <select
                                            value={editRole}
                                            onChange={(e) => setEditRole(e.target.value)}
                                            className="p-1 border rounded-md"
                                        >
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingUser?.username === user.username ? (
                                        <>
                                            <button onClick={() => handleUpdateUser(user)} className="text-green-600 hover:text-green-900 mr-4">Save</button>
                                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setEditingUser(user); setEditRole(user.role); }} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                            <button onClick={() => handleDeleteUser(user.username)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;