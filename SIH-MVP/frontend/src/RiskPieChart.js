import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskPieChart = ({ high, medium, low }) => {
    const data = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [
            {
                label: '# of Students',
                data: [high, medium, low],
                // Updated with thematic, vibrant colors from your homepage's palette
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',   // Tailwind's red-500
                    'rgba(251, 191, 36, 0.8)',   // Tailwind's amber-400
                    'rgba(16, 185, 129, 0.8)',   // Tailwind's emerald-500
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(16, 185, 129, 1)',
                ],
                // Adds a subtle effect when hovering over a slice
                hoverOffset: 8,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Helps with responsiveness in flex/grid layouts
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#374151', // text-gray-700 for better consistency
                    font: {
                        size: 14,
                        family: 'inherit', // Uses the parent font
                    },
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 8,
            }
        },
        // Adds a smooth animation on initial load
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    return (
        // --- STYLING UPDATES START HERE ---
        // Container now uses a soft gradient, deeper shadow, and more rounding
        <div className="p-6 h-full bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/80 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
            {/* Title now uses the same gradient text effect as the homepage */}
            <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-emerald-600 to-sky-500">
                Student Risk Distribution
            </h3>
            {/* Added a container to better control chart height */}
            <div style={{ position: 'relative', height: '300px' }}>
                 <Pie data={data} options={options} />
            </div>
        </div>
        // --- STYLING UPDATES END HERE ---
    );
};

export default RiskPieChart;