# EduAgent 🎓

EduAgent is an intelligent, AI-powered educational platform designed to personalize learning experiences. It leverages advanced AI to generate custom learning roadmaps, facilitates interactive voice-based learning, and fosters a collaborative community.

## 🚀 Features

- **Personalized AI Roadmaps**: Generates detailed learning paths based on your role and interests using Gemini AI.
- **Voice Space**: An immersive voice-activated interface for hands-free interaction and learning.
- **Dashboard**: A comprehensive overlook of your learning progress, current paths, and achievements.
- **Community Hub**: Connect with other learners, share progress, and discuss topics.
- **Module Management**: Create, view, and track detailed learning modules.
- **Secure Authentication**: User accounts with secure login and signup functionality.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- React Router Dom
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens) for Authentication
- Google Generative AI (Gemini) SDK
- Groq SDK (Integration ready)

## 📋 Prerequisites

Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduAgent
   ```

2. **Frontend Setup**
   ```bash
   # Install frontend dependencies
   npm install
   ```

3. **Backend Setup**
   ```bash
   # Navigate to the server directory
   cd server
   
   # Install backend dependencies
   npm install
   ```

4. **Environment Configuration**
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   > Note: You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

## 🏃‍♂️ Running the Application

To run the full application, you need to start both the backend server and the frontend client.

**1. Start the Backend Server**
Open a terminal, navigate to the `server` folder, and run:
```bash
cd server
npm run dev
```
*The server will start on http://localhost:5000*

**2. Start the Frontend Client**
Open a new terminal window in the root `EduAgent` directory and run:
```bash
npm run dev
```
*The client will start on http://localhost:5173 (or similar)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
