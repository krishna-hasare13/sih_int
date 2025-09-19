import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubjectScoresChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/subjects/scores");
                const data = await response.json();
                
                if (response.ok) {
                    const labels = data.map(item => item.subject);
                    const scores = data.map(item => item.test_score);

                    setChartData({
                        labels: labels,
                        datasets: [{
                            label: 'Average Score',
                            data: scores,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        }]
                    });
                }
            } catch (error) {
                console.error("Failed to fetch subject scores:", error);
            }
        };
        fetchScores();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Average Score by Subject' },
        },
        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default SubjectScoresChart;