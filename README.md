# EduAgent 🎓

**EduAgent** is an intelligent, AI-powered educational platform designed to revolutionize personalized learning. By leveraging advanced AI models like **Google Gemini**, EduAgent generates custom learning roadmaps, facilitates interactive voice-based learning sessions, and fosters a collaborative community for learners.

Whether you're looking to master a new skill, track your progress through gamified achievements, or engage in hands-free learning with our Voice Space, EduAgent is your personal AI tutor.

---

## 🚀 Key Features

### 🧠 **AI-Powered Learning Roadmaps**
- **Custom Paths**: Generate detailed, step-by-step learning paths based on your specific role, interests, and goals.
- **Dynamic Content**: Utilizes **Google Gemini and Groq AI** to curate up-to-date and relevant study materials.
- **Progress Tracking**: Visual progress bars and milestone tracking to keep you motivated.

### 🎙️ **Immersive Voice Space**
- **Hands-Free Learning**: Interact with the AI tutor using natural voice commands.
- **VoiceOrb Interface**: A visually engaging, reactive voice interface that mimics natural conversation flow.
- **Real-time Feedback**: Instant responses and explanations for your queries.

### 🏆 **Gamification & Dashboard**
- **Achievement Badges**: Earn badges for completing modules, maintaining streaks, and mastering topics.
- **Comprehensive Dashboard**: A centralized hub to view your active paths, weekly challenges, and learning statistics.
- **Leaderboards**: Compete with friends and the community (coming soon).

### 👥 **Community & Collaboration**
- **Community Hub**: Connect with other learners, share your generated roadmaps, and discuss complex topics.
- **Resource Sharing**: Upload and share notes, links, and helpful resources.

### 🔒 **Secure & Robust Patterns**
- **User Authentication**: Secure signup and login functionality using JWT (JSON Web Tokens).
- **Data Privacy**: Your learning data and preferences are securely stored.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern glassmorphism effects, [Lucide React](https://lucide.dev/) for icons.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth UI transitions.
- **State Management**: React Context API.
- **HTTP Client**: Axios.

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM.
- **Authentication**: BCrypt for hashing and JWT for session management.

### **AI & APIs**
- **Google Generative AI (Gemini)**: Core engine for generating content and roadmaps.
- **Groq SDK**: Integrated for high-speed inference tasks.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v18+ recommended)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (Running locally or use MongoDB Atlas)
- **[Git](https://git-scm.com/)**

---

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduAgent
```

### 2. Frontend Setup
Navigate to the root directory (where `vite.config.js` is located) and install dependencies:
```bash
npm install
```

### 3. Backend Setup
Navigate to the `server` directory and install backend dependencies:
```bash
cd server
npm install
```

### 4. Environment Configuration
You need to set up environment variables for the backend to function correctly.

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduagent  # Or your MongoDB Atlas connection string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key  # Optional if using Groq
```
> **Note**: Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🏃‍♂️ Running the Application

To run the full application, you need to start both the **Backend Server** and the **Frontend Client**.

### **Step 1: Start the Backend**
Open a terminal, navigate to the `server` folder, and run:
```bash
cd server
npm run dev
```
*Output: `Server running on port 5000` & `MongoDB Connected`*

### **Step 2: Start the Frontend**
Open a **new** terminal window in the root `EduAgent` directory and run:
```bash
npm run dev
```
*Output: `Local: http://localhost:5173/`*

### **Step 3: Access the App**
Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

---

## 🏛️ Clean Architecture

The project follows a professional **Clean Architecture** to ensure scalability, maintainability, and clear separation of concerns.

### **Backend (Controller-Service-Model)**
- **Routes**: Handle URL mapping and call the appropriate controller.
- **Controllers**: Manage HTTP requests/responses, status codes, and input validation.
- **Services**: Contain the core **business logic**, AI prompting, and database orchestration.
- **Models**: Define the MongoDB/Mongoose schemas.

### **Frontend (Service Abstraction)**
- **Centralized API**: All backend interactions are abstracted into `src/services/api.js`.
- **Interceptors**: Global error handling and JWT token injection are handled at the service level.
- **Context API**: Manages global state (Auth) using the abstracted services.

---

## 📂 Project Structure

```bash
EduAgent/
├── server/                 # Backend (Node.js/Express)
│   ├── config/             # Configuration (Database, etc.)
│   ├── controllers/        # Request/Response handling logic
│   ├── services/           # Business logic & AI orchestration
│   ├── models/             # Mongoose schemas (User, Roadmap, Post)
│   ├── routes/             # API entry points
│   ├── middleware/         # Security & Auth (JWT)
│   └── index.js            # Server entry point
├── src/                    # Frontend (React 19)
│   ├── services/           # Centralized API service layer
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main view screens
│   ├── context/            # Global state (AuthContext)
│   ├── assets/             # Media and styling
│   └── App.jsx             # Root layout & Routing
└── README.md
```

---

## 🔮 Future Enhancements

- [ ] **Mobile App**: Developing a React Native version for on-the-go learning.
- [ ] **Advanced Analytics**: Deeper insights into learning patterns and optimization suggestions.
- [ ] **Social Features**: Real-time chat and study groups.
- [ ] **More AI Integrations**: Support for OpenAI and Claude models.

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
