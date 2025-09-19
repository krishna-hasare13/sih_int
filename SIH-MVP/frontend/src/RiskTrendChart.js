import React, { useEffect, useState } from 'react';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RiskTrendChart = ({ studentId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/student/trends/${studentId}`);
                const data = await response.json();
                
                if (response.ok) {
                    const labels = data.map(item => `Test ${item.test_number}`);
                    const scores = data.map(item => item.test_score);

                    setChartData({
                        labels: labels,
                        datasets: [{
                            label: 'Test Score Trend',
                            data: scores,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.4
                        }]
                    });
                }
            } catch (error) {
                console.error("Failed to fetch trend data:", error);
            }
        };
        if (studentId) {
            fetchTrends();
        }
    }, [studentId]);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Performance Trend' },
        },
        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner border border-gray-300">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default RiskTrendChart;