const express = require('express');
const router = express.Router();
const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');
const jwt = require('jsonwebtoken');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Function to get response from Gemini API
async function getGeminiResponse(message) {
  try {
    console.log('API Key:', GEMINI_API_KEY); // Debug log
    console.log('API URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`); // Debug log

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are a helpful medical assistant. Provide clear, concise, and accurate medical information. 
          Follow these guidelines:
          1. Be professional and empathetic
          2. Provide detailed but easy to understand explanations
          3. Include relevant medical advice and precautions
          4. Always recommend consulting a doctor for serious conditions
          5. Format your response in a clear, structured way
          6. If the question is not medical related, politely inform that you can only help with medical queries
          
          User's question: ${message}`
        }]
      }]
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // Debug log

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', JSON.stringify(response.data, null, 2)); // Debug log
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Full Error:', error); // Debug log
    console.error('Error Response:', error.response?.data); // Debug log
    console.error('Error Status:', error.response?.status); // Debug log
    return null;
  }
}

function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = getUserIdFromToken(req);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Save user message
    await ChatMessage.create({
      userId,
      sender: 'user',
      message
    });

    // Get AI response
    const geminiResponse = await getGeminiResponse(message);

    // Save AI reply
    await ChatMessage.create({
      userId,
      sender: 'ai',
      message: geminiResponse || "I apologize, but I'm having trouble processing your request."
    });

    res.json({ response: geminiResponse });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

router.get('/history', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const history = await ChatMessage.find({ userId }).sort({ timestamp: 1 });
  res.json({ history });
});

module.exports = router; 