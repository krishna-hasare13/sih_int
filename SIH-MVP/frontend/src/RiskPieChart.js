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
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(16, 185, 129, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#4b5563',
                },
            },
        },
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-300">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-900">Risk Distribution</h3>
            <Pie data={data} options={options} />
        </div>
    );
};

export default RiskPieChart;