import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const departments = [
  {
    id: 1,
    name: 'Cardiology',
    description: 'Heart and cardiovascular system specialists',
    icon: '❤️',
    doctors: 5
  },
  {
    id: 2,
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: '🧠',
    doctors: 4
  },
  {
    id: 3,
    name: 'Orthopedics',
    description: 'Bone and joint specialists',
    icon: '🦴',
    doctors: 6
  },
  {
    id: 4,
    name: 'Pediatrics',
    description: 'Child health specialists',
    icon: '👶',
    doctors: 3
  },
  {
    id: 5,
    name: 'Dermatology',
    description: 'Skin specialists',
    icon: '🧬',
    doctors: 4
  },
  {
    id: 6,
    name: 'Ophthalmology',
    description: 'Eye specialists',
    icon: '👁️',
    doctors: 3
  }
];

const DashboardMain = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome, {userEmail}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleChatClick}
                className="flex items-center space-x-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Chat with AI Doctor</h3>
                  <p className="text-sm text-white/80">Get instant medical advice</p>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Our Departments</h2>
          <p className="mt-2 text-gray-600">Select a department to view available doctors</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((department) => (
            <div
              key={department.id}
              onClick={() => navigate(`/department/${department.id}`)}
              className="bg-white overflow-hidden shadow-lg rounded-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{department.icon}</div>
                  <div className="text-sm text-gray-500">
                    {department.doctors} doctors available
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {department.name}
                </h3>
                <p className="mt-2 text-gray-600">
                  {department.description}
                </p>
                <div className="mt-4">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Doctors
                    <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="text-sm font-medium text-indigo-600">Total Departments</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{departments.length}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-600">Available Doctors</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {departments.reduce((acc, dept) => acc + dept.doctors, 0)}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-600">Active Consultations</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain; 