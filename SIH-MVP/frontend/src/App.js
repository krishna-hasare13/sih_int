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
      return <UserManagement />;
    }

    return (
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <header className="flex items-center mb-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 mr-4 bg-blue-600 text-white rounded-full md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Student Risk Overview</h2>
          </header>

          {/* Top Summary Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center p-6 mb-8 bg-white rounded-xl shadow-lg space-y-4 md:space-y-0">
            {summaryData.map(item => (
                <div key={item.label} className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`}></span>
                    <p className="text-lg font-medium text-gray-600">{item.label}: <span className="font-bold">{item.count}</span></p>
                </div>
            ))}
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-6 space-y-4 md:space-y-0">
              <input
                  type="text"
                  placeholder="Search by student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                  {['All', 'High', 'Medium', 'Low'].map(filter => (
                      <button
                          key={filter}
                          onClick={() => setRiskFilter(filter.toLowerCase())}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                              riskFilter === filter.toLowerCase()
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                          {filter}
                      </button>
                  ))}
              </div>
          </div>

          <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Overall Course Performance</h2>
              <SubjectScoresChart />
          </div>

          {/* Student List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {students.map((s) => (
              <div
                key={s.student_id}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                  s.risk_level === "High" ? "bg-red-100 border-red-500 border" :
                  s.risk_level === "Medium" ? "bg-yellow-100 border-yellow-500 border" :
                  "bg-emerald-100 border-emerald-500 border"
                }`}
                onClick={() => fetchDetails(s.student_id)}
              >
                <h3 className="text-xl font-semibold text-gray-900">ID: {s.student_id}</h3>
                <p className="text-sm font-bold mt-2 text-gray-600">Risk: <span className="font-extrabold">{s.risk_level}</span></p>
                <div className="mt-4 text-sm text-gray-700 space-y-1">
                  <p>Attendance: <span className="font-medium">{s.attendance_percentage}%</span></p>
                  <p>Avg Score: <span className="font-medium">{s.avg_test_score}</span></p>
                  <p>Fee Status: <span className="font-medium">{s.fee_status}</span></p>
                </div>
              </div>
            ))}
          </div>
            {console.log("Selected Student:", selected)}
          {/* Student Details */}
          {selected && selected.info && (
            <div className="bg-white p-10 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Student {selected.info.student_id}
                </h2>
                <span className={`px-4 py-2 text-sm font-bold rounded-full ${
                  selected.info.risk_level === "High" ? "bg-red-600 text-white" :
                  selected.info.risk_level === "Medium" ? "bg-yellow-600 text-gray-900" :
                  "bg-emerald-600 text-white"
                }`}>
                  {selected.info.risk_level} Risk
                </span>
              </div>

              <p className="text-gray-600 mb-6">Detailed information and risk factors for this student.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Key Metrics */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Key Metrics</h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm text-gray-600">Attendance:</span>
                        <input type="number" name="attendance_percentage" value={editableStudent.attendance_percentage} onChange={handleEditChange} className="mt-1 block w-full border rounded-md p-2"/>
                      </label>
                      <label className="block">
                        <span className="text-sm text-gray-600">Fee Status:</span>
                        <select name="fee_status" value={editableStudent.fee_status} onChange={handleEditChange} className="mt-1 block w-full border rounded-md p-2">
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3 text-gray-900">
                      <p>Attendance: <span className="font-bold">{selected.info.attendance_percentage}%</span></p>
                      <p>Avg Score: <span className="font-bold">{selected.info.avg_test_score}</span></p>
                      <p>Fee Status: <span className="font-bold">{selected.info.fee_status}</span></p>
                    </div>
                  )}

                  {userRole === 'admin' && (
                    <div className="mt-6 space-x-2">
                      {editMode ? (
                        <>
                          <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">Save</button>
                          <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-400 text-gray-900 rounded-lg shadow-md hover:bg-gray-500 transition">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Edit</button>
                          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition">Delete</button>
                        </>
                      )}
                      <button onClick={handleExport} className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition">Export CSV</button>
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-700">Reasons for Risk</h3>
                  <button
                    onClick={() => setShowReasons(!showReasons)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    {showReasons ? "Hide Counseling Points" : "Show Counseling Points"}
                  </button>
                  {showReasons && selected.info.reasons && selected.info.reasons.length > 0 ? (
                    <ul className="list-disc list-inside mt-4 text-red-600 space-y-1">
                      {selected.info.reasons.map((reason, index) => (
                        <li key={index} className="text-sm font-medium">{reason}</li>
                      ))}
                    </ul>
                  ) : (
                    showReasons && <p className="mt-4 text-emerald-600 font-medium">No major issues detected.</p>
                  )}
                </div>

                {/* Right Column - Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Test Scores Over Time</h3>
                  <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-300">
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