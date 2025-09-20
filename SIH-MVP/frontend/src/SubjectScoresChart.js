import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubjectScoresChart = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            try {
                // NOTE: Using mock data for a stable demonstration.
                // Replace this with your actual fetch call.
                // const response = await fetch("http://127.0.0.1:5000/api/subjects/scores");
                // if (!response.ok) throw new Error('Network response was not ok');
                // const data = await response.json();

                // Mock data
                const data = [
                    { subject: 'Data Structures', test_score: 82 },
                    { subject: 'Algorithms', test_score: 75 },
                    { subject: 'Database Mgmt', test_score: 88 },
                    { subject: 'OS', test_score: 71 },
                    { subject: 'Networking', test_score: 91 },
                    { subject: 'Software Engg', test_score: 85 },
                ];

                const labels = data.map(item => item.subject);
                const scores = data.map(item => item.test_score);

                // A vibrant, theme-consistent color palette for the bars
                const themeColors = [
                    'rgba(14, 165, 233, 0.8)',   // sky-500
                    'rgba(16, 185, 129, 0.8)',   // emerald-500
                    'rgba(245, 158, 11, 0.8)',    // amber-500
                    'rgba(139, 92, 246, 0.8)',   // violet-500
                    'rgba(236, 72, 153, 0.8)',   // pink-500
                    'rgba(22, 163, 74, 0.8)',    // green-600
                ];

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Average Score',
                        data: scores,
                        backgroundColor: themeColors,
                        borderColor: themeColors.map(color => color.replace('0.8', '1')), // Make border fully opaque
                        borderWidth: 1,
                        borderRadius: 5,
                    }]
                });
            } catch (error) {
                console.error("Failed to fetch subject scores:", error);
                setChartData({ labels: [], datasets: [] }); // Set to empty on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchScores();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Hide legend as colors are for distinction, not data series
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Average Score (%)', color: '#4b5563' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { color: '#374151' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#374151' }
            }
        }
    };

    return (
        <div className="p-6 h-full bg-gradient-to-br from-sky-50/80 via-white to-yellow-50/80 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
            <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-amber-500">
                Subject Performance Analysis
            </h3>
            <div style={{ position: 'relative', height: '350px' }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full text-gray-500">Loading Scores...</div>
                ) : chartData && chartData.datasets?.[0]?.data.length > 0 ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-500">No subject data available.</div>
                )}
            </div>
        </div>
    );
};

export default SubjectScoresChart;