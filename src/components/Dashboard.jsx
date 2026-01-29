import React from 'react';
import StreakCalendar from './StreakCalendar';
import SearchBar from './SearchBar';
import RecentLearning from './ResumeLearning';
import BadgesPanel from './AchievementBadges';
import FriendsStreak from './FriendsPanel';
import WeeklyChallenge from './WeeklyChallenge';
import { BrainCircuit } from 'lucide-react';
import './Dashboard.css';

import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { user, paths } = useApp();

  // Safe stats check
  const streak = user?.stats?.streak || 0;
  const learningTime = user?.stats?.learningHours || 0;

  return (
    <div className="dashboard-container">
      <header className="main-header">
        <div className="app-logo">
          <div className="logo-icon-bg">
            <BrainCircuit size={28} color="white" />
          </div>
          <span className="app-name">EduAgent</span>
        </div>
        <SearchBar />
      </header>

      <div className="dashboard-content-grid">
        <div className="left-column">
          <StreakCalendar currentStreak={streak} />
          <WeeklyChallenge />
        </div>

        <div className="middle-column">
          <div className="dashboard-hero glass-card">
            <div className="hero-content">
              <h1>Welcome back, <span className="text-gradient">{user?.username || 'Learner'}</span>!</h1>
              <p>You're on a <strong>{streak}-day streak</strong>. Keep up the momentum in <strong>{paths[0]?.title || 'your learning'}</strong>.</p>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-value">85%</span>
                  <span className="stat-label">Weekly Goal</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{learningTime} hrs</span>
                  <span className="stat-label">Learning Time</span>
                </div>
              </div>
            </div>
          </div>
          <RecentLearning />
        </div>

        <div className="right-column">
          <FriendsStreak />
          <BadgesPanel userBadges={user?.stats?.badges || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
