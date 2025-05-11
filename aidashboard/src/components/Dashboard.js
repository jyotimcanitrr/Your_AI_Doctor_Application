import React from 'react';
import '../styles/tailwind.css';

const Dashboard = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Welcome to AI Doctor Consultation</h1>
      <p className="mt-2 text-lg">Your personal health assistant powered by AI.</p>

      <div className="mt-5 p-5 bg-gray-100 rounded-lg shadow-md text-gray-800">
        <h3 className="text-2xl font-semibold">AI Doctor Consultation</h3>
        <img src="https://example.com/doctor.jpg" alt="Doctor Consultation" className="w-full rounded-lg mb-4" />
        
        <p>
          Welcome to your AI-powered health assistant! Our platform provides a virtual consultation service where you can receive preliminary advice on various health concerns. Using advanced algorithms, our AI assistant analyzes your symptoms and offers guidance based on your input. 
        </p>
        
        <img src="https://example.com/consultation.png" alt="Consultation Process" className="w-full rounded-lg mt-5" />
        
        <p className="mt-4">
          <strong>How it works:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>1. Describe your symptoms or health concerns.</li>
            <li>2. The AI will analyze your inputs and suggest possible causes.</li>
            <li>3. Based on your symptoms, the AI will recommend next steps—whether it's self-care, seeing a doctor, or seeking emergency help.</li>
          </ul>
        </p>
        <p className="mt-4">
          <strong>Important Notes:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>The AI assistant provides general guidance. For accurate diagnosis, always consult a professional healthcare provider.</li>
            <li>This service is not intended to replace a doctor's advice.</li>
            <li>If your symptoms are severe or life-threatening, seek immediate medical attention.</li>
          </ul>
        </p>
        <p className="mt-4">
          Stay healthy and take care! Remember, while AI can help identify patterns, nothing replaces the expertise of a real doctor. If you're ever in doubt, it's always best to seek in-person medical care.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;