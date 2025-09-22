import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
} from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

function StudentDashboard() {
    const { isLoggedIn, username, logout } = useContext(AuthContext);
    const [studentData, setStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [expandedEventId, setExpandedEventId] = useState(null);

    const [events, setEvents] = useState([
        { id: 1, title: "Mentor Session - Database Systems", date: "25 Sep 2025" },
        { id: 2, title: "Career Guidance Meeting", date: "30 Sep 2025" },
        { id: 3, title: "Workshop on Advanced Algorithms", date: "15 Oct 2025" },
    ]);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        localStorage.removeItem("studentUsername");
        navigate("/student-login");
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem("studentUsername");
        if (!storedUsername) {
            navigate("/student-login");
            return;
        }

        const fetchStudentData = async () => {
            setIsLoading(true);
            try {
                // Fetch all students from backend API
                const response = await fetch("http://127.0.0.1:5000/api/students");
                const students = await response.json();

                // Find student by username (assuming student_id === username)
                const student = students.find(
                    (s) => s.student_id === storedUsername
                );

                if (student) {
                    // Aggregate semester data if needed, here just showing available fields
                    setStudentData({
                        name: storedUsername,
                        sem6_att: student.attendance_percentage,
                        avgMarks: student.test_score,
                        credits: 0, // Set actual value if available in CSV
                        sem6_cgpa: 0, // Set actual value if available in CSV
                        wellbeing: 75, // Placeholder, set actual value if available
                    });
                } else {
                    setStudentData(null);
                }
            } catch (err) {
                console.error(err);
                setStudentData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [navigate]);

    const attendance = studentData
        ? [
              studentData.sem1_att,
              studentData.sem2_att,
              studentData.sem3_att,
              studentData.sem4_att,
              studentData.sem5_att,
              studentData.sem6_att,
          ]
        : [];
    const cgpa = studentData
        ? [
              studentData.sem1_cgpa,
              studentData.sem2_cgpa,
              studentData.sem3_cgpa,
              studentData.sem4_cgpa,
              studentData.sem5_cgpa,
              studentData.sem6_cgpa,
          ]
        : [];

    const chartLabels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: { color: "#374151" },
            },
            x: { grid: { display: false }, ticks: { color: "#374151" } },
        },
    };

    const attendanceData = {
        labels: chartLabels,
        datasets: [
            {
                label: "Attendance %",
                data: attendance,
                backgroundColor: "rgba(14, 165, 233, 0.8)",
                borderColor: "rgba(14, 165, 233, 1)",
                borderRadius: 5,
                borderWidth: 1,
            },
        ],
    };

    const performanceData = {
        labels: chartLabels,
        datasets: [
            {
                label: "CGPA",
                data: cgpa,
                fill: true,
                borderColor: "rgba(16, 185, 129, 1)",
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.bottom,
                        0,
                        chartArea.top
                    );
                    gradient.addColorStop(0, "rgba(16, 185, 129, 0)");
                    gradient.addColorStop(1, "rgba(16, 185, 129, 0.4)");
                    return gradient;
                },
                pointBackgroundColor: "rgba(16, 185, 129, 1)",
                pointBorderColor: "#fff",
                tension: 0.4,
            },
        ],
    };

    const handleSchedule = () => {
        if (!scheduleDate || !scheduleTime) return;
        const newEvent = {
            id: events.length + 1,
            title: "Mentor Session with Dr. Rajesh Kumar",
            date: `${scheduleDate} at ${scheduleTime}`,
        };
        setEvents((prev) => [...prev, newEvent]);
        setIsScheduled(true);

        setTimeout(() => {
            setIsPopupOpen(false);
            setIsScheduled(false);
            setScheduleDate("");
            setScheduleTime("");
        }, 2500);
    };

    const toggleEventDetails = (id) => {
        setExpandedEventId(expandedEventId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Loading Dashboard...
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-2xl font-bold text-red-600">
                Data not available for this student.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-gray-900 p-8 animate-fadein">
            {/* --- Header --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-400 drop-shadow-sm">
                        Welcome, {username || "Student"}! 🎓
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                        Here’s your academic progress overview.
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-4 md:mt-0 flex items-center px-5 py-3 bg-white/80 text-sky-700 rounded-xl shadow-lg hover:bg-white hover:shadow-2xl transition-all duration-300 font-semibold backdrop-blur-sm border border-gray-200"
                >
                    <LogoutIcon />
                    Logout
                </button>
            </header>

            {/* --- Enhanced Profile & Mental Well-being --- */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Student Overview Card */}
                <div className="p-6 bg-white rounded-2xl shadow-lg">
                    <div className="mb-4">
                        <p className="text-xl font-bold text-gray-900">{studentData.name}</p>
                        <p className="text-gray-600">Semester: 6</p>
                        <p className="text-gray-600">PRN: 1234567890</p>
                    </div>
                    <hr className="border-t border-gray-300 mb-4"/>
                    <div className="grid grid-cols-4 text-center">
                        <div>
                            <p className="text-gray-900 font-bold">{studentData.sem6_att}%</p>
                            <p className="text-gray-600 text-sm">Attendance</p>
                        </div>
                        <div>
                            <p className="text-gray-900 font-bold">{studentData.test_score}</p>
                            <p className="text-gray-600 text-sm">Test Score</p>
                        </div>
                        <div>
                            <p className="text-gray-900 font-bold">{studentData.credits}</p>
                            <p className="text-gray-600 text-sm">Credits</p>
                        </div>
                        <div>
                            <p className="text-gray-900 font-bold">{studentData.sem6_cgpa}</p>
                            <p className="text-gray-600 text-sm">CGPA</p>
                        </div>
                    </div>
                </div>

                {/* Mental Well-being Card */}
                <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center">
                    <p className="text-xl font-bold text-gray-900 mb-2">Mental Well-being</p>
                    <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#3b82f6"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 56}
                                strokeDashoffset={
                                    2 * Math.PI * 56 * (1 - studentData.wellbeing / 100)
                                }
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-sky-600">
                            {studentData.wellbeing}%
                        </span>
                    </div>
                    <div className={`px-4 py-1 rounded-lg mb-2 font-semibold ${
                        studentData.wellbeing >= 75
                            ? "bg-green-100 text-green-800"
                            : studentData.wellbeing >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}>
                        {studentData.wellbeing >= 75
                            ? "Good"
                            : studentData.wellbeing >= 50
                            ? "Moderate"
                            : "Bad"}
                    </div>
                    <div className="p-2 bg-gray-100 text-gray-500 text-sm text-center rounded">
                        Regular self-assessment helps maintaining mental wellness.
                    </div>
                </div>
            </section>

            {/* --- Alert Box --- */}
            {studentData.sem6_att < 75 && (
                <div className="mb-8 p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                        Stay on Track
                    </h2>
                    <p className="text-gray-700">
                        Hi {studentData.name.split(" ")[0]}! We've noticed your
                        attendance has dropped to {studentData.sem6_att}% this
                        semester. Don't worry - it's not too late to turn things
                        around! Focus on attending your remaining classes
                        regularly, especially Database Systems and Software
                        Engineering. Consider forming study groups with
                        classmates and don't hesitate to reach out to your
                        professors during office hours. Remember, every small
                        step counts towards your success. You've got this!
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition">
                            Improve Attendance
                        </button>
                        <button className="px-4 py-2 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-600 transition">
                            Study Regularly
                        </button>
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600 transition"
                        >
                            Seek Help 
                        </button>
                    </div>
                </div>
            )}

            {/* --- Popup Window --- */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative animate-fadein">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            ✕
                        </button> 

                        {/* Blur Overlay when Scheduled */}
                        {isScheduled && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center rounded-2xl">
                                <p className="text-2xl font-semibold text-emerald-600">
                                    ✅ Mentor session scheduled successfully!
                                </p>
                            </div>
                        )}

                        {/* Heading */}
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-emerald-600 to-sky-400 mb-6">
                            Contact Mentor
                        </h2>

                        {/* Mentor Details */}
                        <div className="mb-6 space-y-3">
                            <p className="text-lg text-gray-800">
                                <strong>Name:</strong> Dr. Rajesh Kumar
                            </p>
                            <p className="text-lg text-gray-800">
                                <strong>Email:</strong> rajesh.kumar@university.edu
                            </p>
                            <p className="text-lg text-gray-800">
                                <strong>Phone:</strong> +91 98765 43210
                            </p>
                        </div>

                        {/* Schedule Session */}
                        <div className="space-y-4">
                            <label className="block text-gray-700 font-medium">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <label className="block text-gray-700 font-medium">
                                Select Time
                            </label>
                            <input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <button
                                onClick={handleSchedule}
                                className="w-full py-3 bg-gradient-to-r from-sky-600 to-emerald-500 text-white font-bold rounded-lg shadow hover:opacity-90 transition"
                            >
                                Schedule Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Charts --- */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 h-full bg-gradient-to-br from-sky-50/80 via-white to-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                    <h2 className="text-2xl font-bold text-sky-700 mb-4">
                        Attendance Overview
                    </h2>
                    <div style={{ height: "300px" }}>
                        <Bar data={attendanceData} options={commonOptions} />
                    </div>
                </div>
                <div className="p-6 h-full bg-gradient-to-br from-emerald-50/80 via-white to-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-4">
                        Academic Performance
                    </h2>
                    <div style={{ height: "300px" }}>
                        <Line
                            data={performanceData}
                            options={{
                                ...commonOptions,
                                scales: {
                                    ...commonOptions.scales,
                                    y: { ...commonOptions.scales.y, max: 10 },
                                },
                            }}
                        />
                    </div>
                </div>
            </main>

            {/* --- Upcoming Events --- */}
            <section className="p-6 bg-gradient-to-br from-white via-white to-yellow-50/80 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                    📅 Upcoming Events
                </h2>
                <ul className="space-y-4">
                    {events.map((event) => (
                        <li
                            key={event.id}
                            className="p-4 bg-white/60 rounded-lg border-l-4 border-yellow-400"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {event.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {event.date}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleEventDetails(event.id)}
                                    className="text-sky-600 hover:text-sky-800 font-medium transition"
                                >
                                    {expandedEventId === event.id
                                        ? "Hide"
                                        : "Details"}
                                </button>
                            </div>

                            {/* Dropdown Details */}
                            {expandedEventId === event.id && (
                                <div className="mt-3 p-3 bg-sky-50 rounded-lg border text-gray-700 animate-fadein">
                                    <p>
                                        <strong>Mentor:</strong> Dr. Rajesh Kumar
                                    </p>
                                    <p>
                                        <strong>Session:</strong> {event.title}
                                    </p>
                                    <p>
                                        <strong>Date & Time:</strong> {event.date}
                                    </p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default StudentDashboard;