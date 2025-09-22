import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 text-gray-900 animate-fadein">
            <Navbar />
            <main className="flex-grow pt-28 pb-16 px-4 md:px-8">
                <div className="max-w-4xl mx-auto bg-white/90 p-10 md:p-16 rounded-3xl shadow-2xl border-t-4 border-emerald-500 text-center animate-fadein">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600 mb-6">About Project Eklavya</h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8">
                        Project Eklavya is an initiative born from the Smart India Hackathon to combat student dropout rates in public educational institutions. Our mission is to empower mentors and counselors with data-driven insights, enabling them to provide timely support and guidance to at-risk students.
                    </p>
                    <p className="text-md md:text-lg text-gray-600 mb-8">
                        We believe in proactive intervention over reactive measures. By intelligently fusing existing data on attendance, academic performance, and financial status, our platform provides a clear, consolidated view that highlights students who need help the most.
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Core Philosophy</h2>
                    <p className="text-lg text-gray-600">
                        Our system is not designed to replace the human element in education, but to augment it. The AI model serves as a powerful early warning system, providing educators with the information they need to apply their expertise, empathy, and judgment to help students succeed. We are committed to building a transparent and user-friendly tool that creates a meaningful impact on student lives.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;