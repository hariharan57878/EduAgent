import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreateFlow from './pages/CreateFlow';
import VoiceInput from './pages/VoiceInput';
import Community from './pages/Community';
import Settings from './pages/Settings';
import ModuleDetail from './pages/ModuleDetail';
import RoadmapView from './pages/RoadmapView';
import StudyWorkspace from './pages/StudyWorkspace';
import Login from './pages/Login';
import Wizard from './pages/Wizard';
import AboutPage from './pages/AboutPage';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import TopBar from './components/TopBar';
import StewardPanel from './components/StewardPanel';
import InsightsPanel from './components/InsightsPanel';
import MilestoneBanner from './components/MilestoneBanner';
import WeeklyReviewModal from './components/WeeklyReviewModal';

function AppLayout() {
  const { isAuthenticated, user } = useAuth();
  const {
    currentMilestone, setCurrentMilestone,
    weeklyReview, setWeeklyReview,
    isDemoMode
  } = useApp();

  if (!isAuthenticated && !isDemoMode) {
    return (
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Demo user defaults to onboarded true
  const onboardingCompleted = isDemoMode || user?.preferences?.onboardingCompleted;

  return (
    <div className="global-wrapper">
      <div className={`app-layout ${isDemoMode ? 'has-demo-banner' : ''}`}>
        {isDemoMode && (
          <div className="demo-banner">
            <div className="demo-banner-content">
              🚀 You are viewing EduAgent Demo Mode. Data is simulated.
              <button className="banner-link" onClick={() => window.location.reload()}>
                Create Real Account
              </button>
            </div>
          </div>
        )}

        {onboardingCompleted && <Sidebar />}
        {onboardingCompleted && <InsightsPanel />}

        <MilestoneBanner
          milestone={currentMilestone}
          onDismiss={() => setCurrentMilestone(null)}
        />

        {weeklyReview && (
          <WeeklyReviewModal
            review={weeklyReview}
            onDismiss={() => setWeeklyReview(null)}
          />
        )}

        <div className="main-container">
          {onboardingCompleted && <TopBar />}

          <main className="content-area">
            <div className="inner-content-max">
              <Routes>
                {!onboardingCompleted ? (
                  <>
                    <Route path="/wizard" element={<Wizard />} />
                    <Route path="/create/*" element={<CreateFlow />} />
                    <Route path="*" element={<Navigate to="/create/goal" />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create/*" element={<CreateFlow />} />
                    <Route path="/module/:id" element={<ModuleDetail />} />
                    <Route path="/workspace/:moduleId" element={<StudyWorkspace />} />
                    <Route path="/roadmap" element={<RoadmapView />} />
                    <Route path="/voice-space" element={<VoiceInput />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/wizard" element={<Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </>
                )}
              </Routes>
            </div>
          </main>
        </div>

        {onboardingCompleted && <StewardPanel />}
      </div>
    </div>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        Loading EduAgent...
      </div>
    );
  }

  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}

export default App;
