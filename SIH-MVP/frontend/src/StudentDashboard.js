import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { Bar, Line } from "react-chartjs-2";
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


function StudentDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [cgpa, setCgpa] = useState([]);
  const [studentName, setStudentName] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // Logout handler for student
  const handleLogout = () => {
    logout();
    localStorage.removeItem('studentUsername');
    navigate('/student-login');
  };

  useEffect(() => {
    // Get username from localStorage
    const username = localStorage.getItem('studentUsername');
    if (!username) {
      setStudentName("Student");
      setAttendance([]);
      setCgpa([]);
      return;
    }
    // Fetch the logged-in student's data from backend using username
    fetch(`http://127.0.0.1:5000/api/student/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch student data");
        return res.json();
      })
      .then((data) => {
        setStudentName(data.info?.name || "Student");
        setAttendance([
          Number(data.info?.sem1_att),
          Number(data.info?.sem2_att),
          Number(data.info?.sem3_att),
          Number(data.info?.sem4_att),
          Number(data.info?.sem5_att),
          Number(data.info?.sem6_att)
        ]);
        setCgpa([
          Number(data.info?.sem1_cgpa),
          Number(data.info?.sem2_cgpa),
          Number(data.info?.sem3_cgpa),
          Number(data.info?.sem4_cgpa),
          Number(data.info?.sem5_cgpa),
          Number(data.info?.sem6_cgpa)
        ]);
      })
      .catch((err) => {
        setStudentName("Student");
        setAttendance([]);
        setCgpa([]);
      });
  }, []);

  const attendanceData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"],
    datasets: [
      {
        label: "Attendance %",
        data: attendance,
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const performanceData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"],
    datasets: [
      {
        label: "CGPA",
        data: cgpa,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.3,
        fill: false,
      },
    ],
  };


  // Dummy events (replace with backend fetch if available)
  const events = [
    { id: 1, title: "Mentor Session - Database Systems", date: "25 Sep 2025" },
    { id: 2, title: "Career Guidance Meeting", date: "30 Sep 2025" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome back, {studentName}! 🎓</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition font-semibold"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-600 mb-6">Here’s your academic progress overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>
          <Bar data={attendanceData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Academic Performance Trend</h2>
          <Line data={performanceData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">📅 Upcoming Events</h2>
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
              <button className="text-blue-600 hover:underline">Reschedule</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDashboard;