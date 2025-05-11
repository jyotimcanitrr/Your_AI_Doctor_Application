const express = require('express');
const router = express.Router();
const axios = require('axios');

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

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received Message:', message); // Debug log

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    // Get response from Gemini API
    const geminiResponse = await getGeminiResponse(message);
    
    if (geminiResponse) {
      console.log('Success Response:', geminiResponse); // Debug log
      res.json({ response: geminiResponse });
    } else {
      console.log('Fallback Response Used'); // Debug log
      res.json({
        response: "I apologize, but I'm having trouble processing your request. Please try rephrasing your question or consult a healthcare professional for immediate assistance."
      });
    }
  } catch (error) {
    console.error('Route Error:', error); // Debug log
    res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
});

module.exports = router; 