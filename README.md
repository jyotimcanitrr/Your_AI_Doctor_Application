# Your AI Doctor Application

A healthcare application that provides AI-powered medical assistance and appointment booking system.

## Features

- AI-powered medical chat assistance
- Doctor appointment booking
- User authentication
- Email notifications
- Medical history tracking

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- AI: Google Gemini API
- Email: Nodemailer

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   cd Backend
   npm install
   cd ../Frontend
   npm install
   ```
3. Set up environment variables in Backend/.env
4. Start the servers:
   ```bash
   # Terminal 1 (Backend)
   cd Backend
   npm run dev

   # Terminal 2 (Frontend)
   cd Frontend
   npm start
   ```

## Environment Variables

Create a `.env` file in the Backend directory with:

```
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
