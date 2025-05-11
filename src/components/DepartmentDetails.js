import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        // In a real app, this would be an API call
        const departments = {
          1: {
            id: 1,
            name: 'Cardiology',
            description: 'Heart and cardiovascular system specialists',
            icon: '❤️',
            doctors: [
              {
                id: 1,
                name: 'Dr. Sarah Johnson',
                specialization: 'Cardiologist',
                experience: '15 years',
                availability: 'Mon-Fri, 9AM-5PM'
              },
              {
                id: 2,
                name: 'Dr. Michael Chen',
                specialization: 'Cardiac Surgeon',
                experience: '12 years',
                availability: 'Mon-Thu, 10AM-6PM'
              }
            ]
          },
          2: {
            id: 2,
            name: 'Neurology',
            description: 'Brain and nervous system specialists',
            icon: '🧠',
            doctors: [
              {
                id: 3,
                name: 'Dr. Emily Brown',
                specialization: 'Neurologist',
                experience: '10 years',
                availability: 'Mon-Fri, 9AM-5PM'
              }
            ]
          }
        };

        setDepartment(departments[id]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching department details:', error);
        setError('Failed to load department details');
        setLoading(false);
      }
    };

    fetchDepartmentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Department not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {department.icon} {department.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">{department.description}</p>
            </div>
            <button
              onClick={() => navigate('/dashboardMain')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Doctors List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Available Doctors</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a doctor to book an appointment
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {department.doctors.map((doctor) => (
                <li key={doctor.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-2xl">👨‍⚕️</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <p>Experience: {doctor.experience}</p>
                          <p>Available: {doctor.availability}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/appointment/${doctor.id}`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails; 