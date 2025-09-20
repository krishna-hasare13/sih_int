import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import Papa from "papaparse";
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
  const studentName = "Priya Sharma"; // Can be dynamic if you have a login system

  useEffect(() => {
    Papa.parse("/student.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const studentData = results.data.find(
          (row) => row.name === studentName
        );
        if (studentData) {
          setAttendance([
            Number(studentData.sem1_att),
            Number(studentData.sem2_att),
            Number(studentData.sem3_att),
            Number(studentData.sem4_att),
            Number(studentData.sem5_att),
            Number(studentData.sem6_att)
          ]);

          setCgpa([
            Number(studentData.sem1_cgpa),
            Number(studentData.sem2_cgpa),
            Number(studentData.sem3_cgpa),
            Number(studentData.sem4_cgpa),
            Number(studentData.sem5_cgpa),
            Number(studentData.sem6_cgpa)
          ]);
        }
      },
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

  // Dummy events (you can also fetch them dynamically later)
  const events = [
    { id: 1, title: "Mentor Session - Database Systems", date: "25 Sep 2025" },
    { id: 2, title: "Career Guidance Meeting", date: "30 Sep 2025" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {studentName}! 🎓</h1>
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