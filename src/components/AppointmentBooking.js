import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    previousHistory: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError('Please login to book an appointment');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/appointments', {
        doctorId: id,
        patientEmail: userEmail,
        ...formData
      });

      setAppointmentDetails(response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to book appointment. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboardMain');
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Appointment Confirmed!</h3>
          <div className="mt-4 px-7 py-3">
            <p className="text-sm text-gray-500 mb-2">
              Your appointment has been successfully booked. Please check your email for confirmation.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <p className="text-sm font-medium text-gray-900">Appointment Details:</p>
              <p className="text-sm text-gray-500 mt-2">Date: {formData.date}</p>
              <p className="text-sm text-gray-500">Time: {formData.time}</p>
              <p className="text-sm text-gray-500">Doctor: {doctor.name}</p>
              <p className="text-sm text-gray-500">Specialization: {doctor.specialization}</p>
              {appointmentDetails?.appointmentId && (
                <p className="text-sm text-gray-500 mt-2">
                  Appointment ID: <span className="font-medium">{appointmentDetails.appointmentId}</span>
                </p>
              )}
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mock doctor data - in a real app, this would come from your backend
  const doctor = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    consultationFee: '$150'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showSuccessModal && <SuccessModal />}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Schedule a consultation with {doctor.name}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Doctor Info */}
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full border-2 border-white"
                src={doctor.image}
                alt={doctor.name}
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">{doctor.name}</h3>
                <p className="text-indigo-200">{doctor.specialization}</p>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white">
                  Consultation Fee: {doctor.consultationFee}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Preferred Time
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Visit
              </label>
              <input
                type="text"
                name="reason"
                id="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                placeholder="Brief description of your visit"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows="3"
                required
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe your symptoms in detail"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="previousHistory" className="block text-sm font-medium text-gray-700">
                Previous Medical History
              </label>
              <textarea
                id="previousHistory"
                name="previousHistory"
                rows="3"
                value={formData.previousHistory}
                onChange={handleChange}
                placeholder="Any relevant medical history (optional)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking; 