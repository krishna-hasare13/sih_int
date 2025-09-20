import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Filler plugin is required for gradient backgrounds
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Register the Filler plugin
);

// A helper function to create the gradient fill
const createGradient = (ctx, area) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0)'); // sky-500 transparent
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.4)'); // sky-500 with 40% opacity
    return gradient;
};

const RiskTrendChart = ({ studentId }) => {
    const [chartData, setChartData] = useState(null); // Initial state is null
    const [isLoading, setIsLoading] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchTrends = async () => {
            if (!studentId) return;
            setIsLoading(true);
            try {
                // NOTE: Using a mock response for demonstration.
                // Replace this with your actual fetch call.
                // const response = await fetch(`http://127.0.0.1:5000/api/student/trends/${studentId}`);
                // if (!response.ok) throw new Error('Network response was not ok');
                // const data = await response.json();

                // Mock data for demonstration purposes
                const data = [
                    { test_number: 1, test_score: 65 },
                    { test_number: 2, test_score: 72 },
                    { test_number: 3, test_score: 70 },
                    { test_number: 4, test_score: 81 },
                    { test_number: 5, test_score: 78 },
                    { test_number: 6, test_score: 85 },
                ];

                const labels = data.map(item => `Test ${item.test_number}`);
                const scores = data.map(item => item.test_score);

                setChartData({
                    labels: labels,
                    datasets: [{
                        fill: true, // This is crucial for the background gradient
                        label: 'Test Score Trend',
                        data: scores,
                        borderColor: 'rgba(14, 165, 233, 1)', // sky-500
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) return null; // Wait for chart area to be available
                            return createGradient(ctx, chartArea);
                        },
                        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
                        tension: 0.4 // Creates a smooth curve
                    }]
                });
            } catch (error) {
                console.error("Failed to fetch trend data:", error);
                setChartData({ labels: [], datasets: [] }); // Set to empty on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrends();
    }, [studentId]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#374151', padding: 20 },
            },
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
                min: 0,
                max: 100,
                title: { display: true, text: 'Score (%)', color: '#4b5563' },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: { color: '#374151' }
            },
            x: {
                title: { display: true, text: 'Assessments', color: '#4b5563' },
                grid: { display: false },
                ticks: { color: '#374151' }
            }
        }
    };

    return (
        <div className="p-6 h-full bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/80 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
            <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-sky-500">
                Academic Performance Trend
            </h3>
            <div style={{ position: 'relative', height: '300px' }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">Loading Trend Data...</p>
                    </div>
                ) : chartData && chartData.datasets.length > 0 ? (
                    <Line ref={chartRef} data={chartData} options={options} />
                ) : (
                     <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No trend data available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskTrendChart;