
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import { AuthContext, AuthProvider } from './AuthContext';
import RiskPieChart from "./RiskPieChart";
import SubjectScoresChart from "./SubjectScoresChart";
import RiskTrendChart from "./RiskTrendChart";
import UserManagement from "./UserManagement";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

// DashboardPage is the old MainApp, only shown after login
function DashboardPage() {
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
    if (isLoggedIn && view === 'dashboard') {
      let url = `http://127.0.0.1:5000/api/students?search=${searchQuery}&filter=${riskFilter}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => setStudents(data))
        .catch((error) => console.error('Failed to fetch students:', error));
    }
  }, [refresh, searchQuery, riskFilter, isLoggedIn, view]);

  const fetchDetails = (id) => {
    fetch(`http://127.0.0.1:5000/api/student/${id}`)
      .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
      .then((data) => {
        console.log("Fetched Student Details:", data);
        setSelected(data);
        setEditableStudent(data.info);
        setEditMode(false);
      })
      .catch((error) => console.error('Failed to fetch student details:', error));
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setRefresh(prev => !prev);
      }
    } catch (error) {
      setMessage('An error occurred during upload.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/student/update", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: editableStudent.student_id, updates: {
          attendance_percentage: editableStudent.attendance_percentage,
          fee_status: editableStudent.fee_status
        }})
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        setRefresh(prev => !prev);
        setEditMode(false);
        setSelected(null);
      }
    } catch (error) {
      alert("An error occurred while updating.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/student/delete/${selected.info.student_id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          setRefresh(prev => !prev);
          setSelected(null);
        }
      } catch (error) {
        alert("An error occurred while deleting.");
      }
    }
  };

  const handleExport = () => {
    const data = selected.info;
    const csvContent = 
      "Key,Value\n" +
      `Student ID,${data.student_id}\n` +
      `Attendance,${data.attendance_percentage}\n` +
      `Avg Score,${data.avg_test_score}\n` +
      `Fee Status,${data.fee_status}\n` +
      `Risk Level,${data.risk_level}\n` +
      `\nReasons for Risk\n` +
      data.reasons.map(r => `,"${r}"`).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { 
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `student_${data.student_id}_report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };


  const highRiskCount = students.filter((s) => s.risk_level === "High").length;
  const mediumRiskCount = students.filter((s) => s.risk_level === "Medium").length;
  const lowRiskCount = students.filter((s) => s.risk_level === "Low").length;

  const summaryData = [
    { label: 'High Risk', count: highRiskCount, color: 'text-red-600', icon: '🚨' },
    { label: 'Medium Risk', count: mediumRiskCount, color: 'text-yellow-600', icon: '⚠️' },
    { label: 'Low Risk', count: lowRiskCount, color: 'text-emerald-600', icon: '✅' },
  ];



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
    <div className="flex bg-gray-100 text-gray-900 min-h-screen font-sans">
      {/* Sidebar Toggle Button for Mobile */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
<aside className={`fixed top-0 left-0 h-full w-80 bg-white flex-shrink-0 p-8 shadow-2xl z-40 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
  <div className="flex flex-col space-y-4 mb-10">
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-extrabold text-gray-900">AI Dashboard</h1>
      <button onClick={logout} className="p-2 bg-red-600 text-white rounded-full md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
    {/* Username display */}
    <div className="flex items-center space-x-2 text-gray-700">
      <span className="text-lg font-semibold">👤 {username}</span>
      <span className="text-sm text-gray-500">({userRole})</span>
    </div>
  </div>


        {/* Logout Button for Desktop */}
        <button onClick={logout} className="w-full py-2 px-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition hidden md:block mb-8">Logout</button>

        {/* Admin and Counselor links */}
        {userRole === 'admin' && (
          <div className="space-y-2 mb-8">
            <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl font-medium transition ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100'}`}>
              Dashboard
            </button>
            <button onClick={() => { setView('userManagement'); setIsSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl font-medium transition ${view === 'userManagement' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100'}`}>
              User Management
            </button>
          </div>
        )}
        {/* Counselor view */}
        {userRole === 'counselor' && (
          <div className="space-y-2 mb-8">
            <button onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }} className={`w-full text-left p-3 rounded-xl font-medium transition ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100'}`}>
              Dashboard
            </button>
          </div>
        )}

        {/* File Upload Section (visible only to admins) */}
        {userRole === 'admin' && (
          <div className="mb-8 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-600">Upload Data</h2>
              <form onSubmit={handleFileUpload} className="space-y-4">
                  <input type="file" id="file-upload" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                  <button type="submit" className="w-full py-2 px-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Upload CSV</button>
              </form>
              {message && <p className="mt-2 text-sm text-center font-medium">{message}</p>}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Student Summary</h2>
          <div className="space-y-4">
              {summaryData.map(item => (
                <div key={item.label} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-100 shadow-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg font-medium text-gray-900">{item.label}:</span>
                  <span className={`text-lg font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
          </div>
          <div className="mt-8">
            <RiskPieChart
              high={highRiskCount}
              medium={mediumRiskCount}
              low={lowRiskCount}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
}



// Handles routing and auth logic
function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? <DashboardPage /> : <Navigate to="/login" state={{ from: location }} replace />
        }
      />
      {/* Add more routes as needed */}
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