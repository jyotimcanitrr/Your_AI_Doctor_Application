require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const User = require('./models/User');

const app = express();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // Allow cross-origin requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientEmail: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  symptoms: { type: String, required: true },
  previousHistory: { type: String },
  status: { type: String, default: 'confirmed' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Register API
app.post('/register', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  // Check if the user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ fullname, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });

  res.status(200).json({ message: 'Login successful', token });
});

// Book Appointment API
app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, patientEmail, date, time, reason, symptoms, previousHistory } = req.body;

    // Create new appointment
    const appointment = new Appointment({
      doctorId,
      patientEmail,
      date,
      time,
      reason,
      symptoms,
      previousHistory
    });

    await appointment.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: 'Appointment Confirmation - AI HealthCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">AI HealthCare</h1>
            <p style="color: #666; margin-top: 5px;">Your Health, Our Priority</p>
          </div>

          <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; text-align: center;">Appointment Confirmed!</h2>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px;">Dear Patient,</p>
            <p style="color: #333; font-size: 16px;">Your appointment has been successfully booked. Here are your appointment details:</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #4F46E5; margin-top: 0;">Appointment Details</h3>
            
            <div style="margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #555;">Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong style="color: #555;">Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong style="color: #555;">Doctor:</strong> Dr. Sarah Johnson</p>
              <p style="margin: 5px 0;"><strong style="color: #555;">Specialization:</strong> Cardiologist</p>
              <p style="margin: 5px 0;"><strong style="color: #555;">Consultation Fee:</strong> $150</p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #555;">Reason for Visit:</strong></p>
              <p style="margin: 5px 0; color: #666;">${reason}</p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #555;">Symptoms:</strong></p>
              <p style="margin: 5px 0; color: #666;">${symptoms}</p>
            </div>

            ${previousHistory ? `
              <div style="margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong style="color: #555;">Medical History:</strong></p>
                <p style="margin: 5px 0; color: #666;">${previousHistory}</p>
              </div>
            ` : ''}

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="margin: 5px 0;"><strong style="color: #555;">Appointment ID:</strong> ${appointment._id}</p>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #4F46E5; margin-top: 0;">Important Instructions</h3>
            <ul style="color: #666; padding-left: 20px;">
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Bring any relevant medical reports or prescriptions</li>
              <li>Wear a mask and follow COVID-19 safety protocols</li>
              <li>Keep your appointment ID for reference</li>
            </ul>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>For any queries, please contact our support team.</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 12px;">© 2024 AI HealthCare. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'Appointment booked successfully',
      appointmentId: appointment._id
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ 
      message: 'Error booking appointment',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message 
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});