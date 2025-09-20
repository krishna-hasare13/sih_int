import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
} from "chart.js";

// Register all necessary components for Chart.js, including the Filler for gradients
ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
);

// Logout Icon SVG for the button
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

function StudentDashboard() {
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('studentUsername');
        navigate('/student-login');
    };

    useEffect(() => {
        const username = localStorage.getItem('studentUsername');
        if (!username) {
            navigate('/student-login');
            return;
        }

        // Using a mock fetch for stable demonstration. Replace with your actual fetch.
        const fetchStudentData = async () => {
            setIsLoading(true);
            try {
                // const response = await fetch(`http://127.0.0.1:5000/api/student/${username}`);
                // if (!response.ok) throw new Error("Failed to fetch student data");
                // const data = await response.json();

                // Mock Data for consistent styling demonstration
                const data = {
                    info: {
                        name: "Aisha Sharma",
                        sem1_att: 85, sem2_att: 91, sem3_att: 88, sem4_att: 92, sem5_att: 86, sem6_att: 94,
                        sem1_cgpa: 8.2, sem2_cgpa: 8.5, sem3_cgpa: 8.4, sem4_cgpa: 8.8, sem5_cgpa: 8.7, sem6_cgpa: 9.1,
                    }
                };

                setStudentData(data.info);
            } catch (err) {
                console.error(err);
                setStudentData(null); // Handle error case
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    // --- Chart Configurations ---
    const attendance = studentData ? [studentData.sem1_att, studentData.sem2_att, studentData.sem3_att, studentData.sem4_att, studentData.sem5_att, studentData.sem6_att] : [];
    const cgpa = studentData ? [studentData.sem1_cgpa, studentData.sem2_cgpa, studentData.sem3_cgpa, studentData.sem4_cgpa, studentData.sem5_cgpa, studentData.sem6_cgpa] : [];
    
    const chartLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
    const commonOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#374151' } },
            x: { grid: { display: false }, ticks: { color: '#374151' } }
        }
    };
    
    const attendanceData = {
        labels: chartLabels,
        datasets: [{
            label: "Attendance %", data: attendance,
            backgroundColor: 'rgba(14, 165, 233, 0.8)', // sky-500
            borderColor: 'rgba(14, 165, 233, 1)',
            borderRadius: 5, borderWidth: 1
        }],
    };

    const performanceData = {
        labels: chartLabels,
        datasets: [{
            label: "CGPA", data: cgpa, fill: true,
            borderColor: "rgba(16, 185, 129, 1)", // emerald-500
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
                return gradient;
            },
            pointBackgroundColor: "rgba(16, 185, 129, 1)", pointBorderColor: '#fff',
            tension: 0.4,
        }],
    };

    const events = [
        { id: 1, title: "Mentor Session - Database Systems", date: "25 Sep 2025" },
        { id: 2, title: "Career Guidance Meeting", date: "30 Sep 2025" },
        { id: 3, title: "Workshop on Advanced Algorithms", date: "15 Oct 2025" },
    ];
    
    if (isLoading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-gray-900 p-8 animate-fadein">
            {/* --- Header --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-400 drop-shadow-sm">
                        Welcome, {studentData?.name || "Student"}! 🎓
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">Here’s your academic progress overview.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 md:mt-0 flex items-center px-5 py-3 bg-white/80 text-sky-700 rounded-xl shadow-lg hover:bg-white hover:shadow-2xl transition-all duration-300 font-semibold backdrop-blur-sm border border-gray-200"
                >
                    <LogoutIcon />
                    Logout
                </button>
            </header>

            {/* --- Charts Grid --- */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 h-full bg-gradient-to-br from-sky-50/80 via-white to-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                    <h2 className="text-2xl font-bold text-sky-700 mb-4">Attendance Overview</h2>
                    <div style={{ height: '300px' }}><Bar data={attendanceData} options={commonOptions} /></div>
                </div>
                <div className="p-6 h-full bg-gradient-to-br from-emerald-50/80 via-white to-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-4">Academic Performance</h2>
                    <div style={{ height: '300px' }}><Line data={performanceData} options={{ ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, max: 10 } } }} /></div>
                </div>
            </main>

            {/* --- Upcoming Events --- */}
            <section className="p-6 bg-gradient-to-br from-white via-white to-yellow-50/80 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">📅 Upcoming Events</h2>
                <ul className="space-y-4">
                    {events.map((event) => (
                        <li key={event.id} className="flex items-center justify-between p-4 bg-white/60 rounded-lg border-l-4 border-yellow-400">
                            <div>
                                <p className="font-semibold text-gray-800">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.date}</p>
                            </div>
                            <button className="text-sky-600 hover:text-sky-800 font-medium transition">Details</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default StudentDashboard;