import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

// --- Icon Components for a cleaner UI ---
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


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
    const [role, setRole] = useState('admin'); // Default role
    const [message, setMessage] = useState({ text: '', type: '' });
    const [refresh, setRefresh] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const { isLoggedIn, userRole } = useContext(AuthContext);

    useEffect(() => {
        if (isLoggedIn && userRole === 'admin') {
            fetch('http://127.0.0.1:5000/api/users')
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Failed to fetch users:", err));
        }
    }, [refresh, isLoggedIn, userRole]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        // Add more roles to the form if needed
        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });
        const data = await response.json();
        setMessage({ text: data.message, type: response.ok ? 'success' : 'error' });
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
            setMessage({ text: data.message, type: response.ok ? 'success' : 'error' });
            if (response.ok) {
                setEditingUser(null);
                setRefresh(prev => !prev);
            }
        } catch (error) {
            setMessage({ text: "An error occurred while updating.", type: 'error' });
        }
    };

    const handleDeleteUser = async (username) => {
        if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
            const response = await fetch(`http://127.0.0.1:5000/api/user/delete/${username}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            setMessage({ text: data.message, type: response.ok ? 'success' : 'error' });
            if (response.ok) {
                setRefresh(prev => !prev);
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>
            <p className="text-gray-600 mb-8">Create new user accounts and manage existing ones.</p>

            {/* --- Create User Form --- */}
            <form onSubmit={handleCreateUser} className="space-y-4 mb-10 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-lg">
                <h3 className="text-xl font-semibold text-sky-800">Create New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition" required />
                    <select value={role} onChange={(e) => setRole(e.target.value)}
                        className="p-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition">
                        <option value="admin">Admin</option>
                        {/* Add other roles like 'mentor' or 'student' if your app supports them */}
                        <option value="mentor">Mentor</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition transform hover:scale-105">
                    Create User Account
                </button>
                {message.text && (
                    <p className={`mt-3 text-sm text-center font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {message.text}
                    </p>
                )}
            </form>

            {/* --- User List Table --- */}
            <div className="overflow-x-auto bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/80">
                <h3 className="text-xl font-semibold text-emerald-800 mb-4 px-2">Existing Users</h3>
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.username} className="border-b border-gray-200/80 hover:bg-sky-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 text-gray-700">
                                    {editingUser?.username === user.username ? (
                                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500">
                                            <option value="admin">Admin</option>
                                            <option value="mentor">Mentor</option>
                                            <option value="student">Student</option>
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${user.role === 'admin' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingUser?.username === user.username ? (
                                        <div className="flex justify-end items-center space-x-2">
                                            <button onClick={() => handleUpdateUser(user)} className="p-2 text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition"><SaveIcon /></button>
                                            <button onClick={() => setEditingUser(null)} className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition"><CancelIcon /></button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end items-center space-x-2">
                                            <button onClick={() => { setEditingUser(user); setEditRole(user.role); }} className="p-2 text-sky-600 bg-sky-100 rounded-full hover:bg-sky-200 transition"><EditIcon /></button>
                                            <button onClick={() => handleDeleteUser(user.username)} className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition"><DeleteIcon /></button>
                                        </div>
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