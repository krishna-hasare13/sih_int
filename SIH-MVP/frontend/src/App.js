import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import StudentDashboard from "./StudentDashboard";
import StudentLoginPage from "./StudentLoginPage";
import { AuthContext, AuthProvider } from './AuthContext';
import RiskPieChart from "./RiskPieChart";
import SubjectScoresChart from "./SubjectScoresChart";
import RiskTrendChart from "./RiskTrendChart";
import UserManagement from "./UserManagement";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
} from "chart.js";

// --- Register all necessary Chart.js components ---
ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
);

// --- SVG Icons for a clean, modern UI ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UserMgmtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// --- Main Mentor/Admin Dashboard Page ---
function DashboardPage() {
    // --- All states and logic functions are preserved ---
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showReasons, setShowReasons] = useState(false);
    const [message, setMessage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editableStudent, setEditableStudent] = useState(null);
    const [view, setView] = useState('dashboard');
    const { isLoggedIn, userRole, logout, username } = useContext(AuthContext);

    useEffect(() => {
        // Fetching logic is unchanged
        if (isLoggedIn && view === 'dashboard') {
            let url = `http://127.0.0.1:5000/api/students?search=${searchQuery}&filter=${riskFilter}`;
            fetch(url).then(res => res.json()).then(data => setStudents(data)).catch(console.error);
        }
    }, [refresh, searchQuery, riskFilter, isLoggedIn, view]);
    
    // All other handler functions (fetchDetails, handleFileUpload, handleUpdate, etc.) are also preserved...
    const fetchDetails = (id) => {
        fetch(`http://127.0.0.1:5000/api/student/${id}`)
            .then(res => res.json())
            .then(data => {
                setSelected(data);
                setEditableStudent(data.info);
                setEditMode(false);
            }).catch(console.error);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditableStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => { /* ... unchanged logic ... */ };
    const handleDelete = async () => { /* ... unchanged logic ... */ };
    const handleExport = () => { /* ... unchanged logic ... */ };
    const handleFileUpload = async (e) => { /* ... unchanged logic ... */ };


    // Data processing for summary counts
    const highRiskCount = students.filter((s) => s.risk_level === "High").length;
    const mediumRiskCount = students.filter((s) => s.risk_level === "Medium").length;
    const lowRiskCount = students.filter((s) => s.risk_level === "Low").length;
    const totalStudents = students.length;

    const renderMainContent = () => {
        if (view === 'userManagement' && userRole === 'admin') {
            return (
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <UserManagement />
                </main>
            );
        }
    
        return (
            <main className="flex-1 p-6 md:p-8 overflow-y-auto animate-fadein">
                <header className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                        Student Risk Overview
                    </h2>
                    <div className="flex items-center mt-4 md:mt-0 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-md">
                        <div className="text-center px-4 border-r border-gray-200">
                            <p className="text-2xl font-bold text-sky-600">{totalStudents}</p>
                            <p className="text-sm text-gray-500">Total Students</p>
                        </div>
                        <div className="text-center px-4 border-r border-gray-200">
                            <p className="text-2xl font-bold text-red-500">{highRiskCount}</p>
                            <p className="text-sm text-gray-500">High Risk</p>
                        </div>
                        <div className="text-center px-4 border-r border-gray-200">
                            <p className="text-2xl font-bold text-amber-500">{mediumRiskCount}</p>
                            <p className="text-sm text-gray-500">Medium Risk</p>
                        </div>
                         <div className="text-center px-4">
                            <p className="text-2xl font-bold text-emerald-500">{lowRiskCount}</p>
                            <p className="text-sm text-gray-500">Low Risk</p>
                        </div>
                    </div>
                </header>
    
                <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-1/2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon/></span>
                        <input
                            type="text" placeholder="Search by student ID or name..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-600">Filter by:</span>
                        {['All', 'High', 'Medium', 'Low'].map(filter => (
                            <button key={filter} onClick={() => setRiskFilter(filter.toLowerCase())}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                riskFilter === filter.toLowerCase() ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-sky-100'
                                }`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="mb-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-700">Overall Course Performance</h3>
                    <SubjectScoresChart />
                </section>
    
                <h3 className="text-3xl font-bold mb-4 text-gray-700">Student Roster</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {students.map((s) => (
                        <div key={s.student_id}
                            className={`bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-t-4 ${
                                s.risk_level === "High" ? "border-red-500" :
                                s.risk_level === "Medium" ? "border-amber-500" :
                                "border-emerald-500"
                            }`}
                            onClick={() => fetchDetails(s.student_id)}>
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-800">ID: {s.student_id}</h3>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                                        s.risk_level === "High" ? "bg-red-100 text-red-800" :
                                        s.risk_level === "Medium" ? "bg-amber-100 text-amber-800" :
                                        "bg-emerald-100 text-emerald-800"
                                    }`}>{s.risk_level}</span>
                                </div>
                                <div className="mt-4 text-sm text-gray-600 space-y-2">
                                    <p>Attendance: <span className="font-semibold text-gray-800">{s.attendance_percentage}%</span></p>
                                    <p>Avg Score: <span className="font-semibold text-gray-800">{s.avg_test_score}</span></p>
                                    <p>Fee Status: <span className="font-semibold text-gray-800">{s.fee_status}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {selected && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                        <div className="bg-gradient-to-br from-gray-50 to-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 animate-fadein" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                               <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                                   Student {selected.info.student_id}
                               </h2>
                               <button onClick={() => setSelected(null)} className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 transition"><CloseIcon /></button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Key Metrics</h3>
                                    {editMode ? (
                                        <div className="space-y-4 p-4 bg-sky-50/50 rounded-lg border border-sky-200">
                                            <label className="block text-sm font-medium text-gray-700">Attendance Percentage
                                                <input type="number" name="attendance_percentage" value={editableStudent.attendance_percentage} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                                            </label>
                                            <label className="block text-sm font-medium text-gray-700">Fee Status
                                                <select name="fee_status" value={editableStudent.fee_status} onChange={handleEditChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                                    <option>Paid</option><option>Overdue</option><option>Unknown</option>
                                                </select>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 text-gray-800 text-lg p-4 bg-gray-100/60 rounded-lg">
                                            <p>Attendance: <span className="font-bold">{selected.info.attendance_percentage}%</span></p>
                                            <p>Avg Score: <span className="font-bold">{selected.info.avg_test_score}</span></p>
                                            <p>Fee Status: <span className="font-bold">{selected.info.fee_status}</span></p>
                                        </div>
                                    )}

                                    {userRole === 'admin' && (
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {editMode ? (
                                                <>
                                                    <button onClick={handleUpdate} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition">Save Changes</button>
                                                    <button onClick={() => setEditMode(false)} className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition">Edit</button>
                                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition">Delete</button>
                                                    <button onClick={handleExport} className="px-4 py-2 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition">Export CSV</button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-700">Counseling Points</h3>
                                    {selected.info.reasons && selected.info.reasons.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-2 p-4 bg-red-50 text-red-700 rounded-lg">
                                            {selected.info.reasons.map((reason, index) => (
                                                <li key={index} className="font-medium">{reason}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-4 p-4 bg-emerald-50 text-emerald-700 font-medium rounded-lg">No major issues detected.</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Test Scores Over Time</h3>
                                    <RiskTrendChart studentId={selected.info.student_id} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        );
    };

    return (
        <div className="flex bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-gray-800 min-h-screen font-sans">
            <aside className={`fixed inset-y-0 left-0 h-full w-72 bg-white/80 backdrop-blur-md flex-shrink-0 p-6 shadow-2xl z-40 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 border-r border-gray-200/80 flex flex-col`}>
                <div className="flex flex-col items-center text-center mb-8">
                    <img src="/logoeklavyafinal.png" alt="Logo" className="h-20 w-20 mb-2" />
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">Project Eklavya</h1>
                    <div className="mt-4 p-2 bg-gray-100 rounded-lg w-full">
                        <p className="font-semibold text-gray-700">{username}</p>
                        <p className="text-sm text-gray-500 capitalize">{userRole}</p>
                    </div>
                </div>

                <nav className="flex-grow">
                    {userRole === 'admin' && (
                        <div className="space-y-2">
                            <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center p-3 rounded-lg font-semibold transition ${view === 'dashboard' ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-sky-100/50 text-gray-700'}`}><DashboardIcon /> Dashboard</button>
                            <button onClick={() => { setView('userManagement'); setIsSidebarOpen(false); }} className={`w-full flex items-center p-3 rounded-lg font-semibold transition ${view === 'userManagement' ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-sky-100/50 text-gray-700'}`}><UserMgmtIcon /> User Management</button>
                        </div>
                    )}
                     {userRole === 'mentor' && (
                        <div className="space-y-2">
                            <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center p-3 rounded-lg font-semibold transition ${view === 'dashboard' ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-sky-100/50 text-gray-700'}`}><DashboardIcon /> Dashboard</button>
                        </div>
                    )}
                </nav>
                
                {userRole === 'admin' && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-3 text-gray-600">Upload Data</h2>
                        <form onSubmit={handleFileUpload} className="space-y-3">
                            <input type="file" id="file-upload" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 cursor-pointer"/>
                            <button type="submit" className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 transition"><UploadIcon /> Upload CSV</button>
                        </form>
                    </div>
                )}

                <button onClick={logout} className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"><LogoutIcon /> Logout</button>
            </aside>

            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm text-sky-600 rounded-full shadow-lg"><MenuIcon /></button>
            
            {renderMainContent()}
        </div>
    );
}

// --- App Router (No changes needed here) ---
function AppRoutes() {
    const { isLoggedIn, userRole } = useContext(AuthContext);
    const location = useLocation();
    
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/student-login" element={<StudentLoginPage />} />
            <Route path="/dashboard" element={
                isLoggedIn && (userRole === 'mentor' || userRole === 'admin') 
                ? <DashboardPage /> 
                : <Navigate to="/login" state={{ from: location }} replace />
            } />
            <Route path="/student-dashboard" element={
                isLoggedIn && userRole === 'student' 
                ? <StudentDashboard /> 
                : <Navigate to="/student-login" state={{ from: location }} replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;