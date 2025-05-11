import React from 'react';
import Dashboard from './components/Dashboard';
import './styles/tailwind.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Dashboard />
    </div>
  );
};

export default App;