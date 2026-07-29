# EduAgent 🎓
> **"Stop starting over. Start finishing."**

**EduAgent** is an AI-powered structured learning workspace designed to help users build, manage, and complete personalized career roadmaps. Unlike traditional learning platforms or chat-based tutors, EduAgent acts as your **Learning Operations Manager**, providing the structure and momentum tracking necessary to achieve mastery.

Whether you're looking to bridge a professional skills gap or master a complex craft, EduAgent transforms overwhelming information into an executable, managed journey.

---

## 🚀 Key Features

### 🛠️ **Structured Learning Workspace**
- **Execution-Ready Roadmaps**: Generate multi-phase learning paths focused on tactical execution and mastery.
- **Phase-Based Timeline**: Organize your journey into clear milestones with expandable checklist modules.
- **Resource Management**: Curate and manage external videos, articles, and documentation directly within your workspace modules.
- **Immersive Study Workspace**: Dedicated environment with real-time module execution, study timer, and AI assistant integration.

### 🤖 **Proactive AI Steward & Voice Intelligence**
- **Learning Operations Manager**: An AI that monitors your pace, detects inactivity, and suggests roadmap optimizations to keep you moving.
- **Voice-Enabled Assistant**: Interactive voice input for natural, hands-free queries and immediate strategic guidance.
- **High-Quality Curation**: AI focuses on finding the best external resources rather than teaching concepts through a chat box.
- **Executive Guidance**: Get strategic advice on your next steps and decision-making helpers to bypass learning blocks.

### 📊 **Momentum & Progress Tracking**
- **Interactive Analytics Dashboard**: Track learning velocity, completion rate trends, weekly study distribution, and skill breakdown.
- **Completion-Centric Metrics**: Monitor total time spent, milestone completion rates, and overall roadmap momentum.
- **Granular Module States**: Manage tasks through "Not Started," "In Progress," and "Completed" states.
- **Consistency Gamification**: Maintain learning streaks and earn badges that celebrate your finishing power, not just your starting intent.

### 👥 **Strategic Community**
- **Roadmap Forking**: Browse and adopt successful execution paths designed by the community.
- **Managed Discussions**: Connect with other learners focused on the same execution goals.

### 🔒 **Secure Execution Board**
- **Professional Persistence**: Your progress and roadmap configurations are securely stored and synced across your sessions.

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
- **Google Generative AI (Gemini)**: Core engine for generating content, roadmaps, and steward recommendations.
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

### **Option 1: Quick Launch (Windows)**
Run the included batch script to launch both backend and frontend servers automatically in separate windows:
```cmd
.\run_project.bat
```

### **Option 2: Manual Launch**

To run the full application manually, start both the **Backend Server** and the **Frontend Client**:

#### **Step 1: Start the Backend**
Open a terminal, navigate to the `server` folder, and run:
```bash
cd server
npm run dev
```
*Output: `Server running on port 5000` & `MongoDB Connected`*

#### **Step 2: Start the Frontend**
Open a **new** terminal window in the root `EduAgent` directory and run:
```bash
npm run dev
```
*Output: `Local: http://localhost:5173/`*

#### **Step 3: Access the App**
Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

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
│   ├── components/         # Reusable UI components (TopBar, Sidebar, StewardPanel)
│   ├── pages/              # Main view screens (Dashboard, Analytics, VoiceInput, StudyWorkspace, etc.)
│   ├── context/            # Global state (AuthContext)
│   ├── assets/             # Media and styling
│   └── App.jsx             # Root layout & Routing
├── run_project.bat         # One-click startup script (Windows)
└── README.md
```

---

## 🔮 Future Enhancements

- [ ] **Mobile App**: Developing a React Native version for on-the-go learning.
- [x] **Advanced Analytics**: Deeper insights into learning patterns and optimization suggestions.
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

