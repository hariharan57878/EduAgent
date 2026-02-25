import React from 'react';
import { Flame, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './TopBar.css';

const TopBar = () => {
  const { user } = useAuth();
  const { paths } = useApp();

  const currentPath = paths[0] || { title: 'No active roadmap' };
  const progress = currentPath.progress || 0;

  const streak = user?.stats?.streak || 0;
  const level = user?.stats?.level || 1;
  const xp = user?.stats?.xp || 0;

  return (
    <header className="topbar">
      <div className="roadmap-context">
        <div className="current-title">
          <Award size={18} className="icon-gold" />
          <span>{currentPath.title}</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar-bg">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>

      <div className="motivation-layer">
        <span className="tagline-subtle">"Stop starting. Start finishing."</span>
      </div>

      <div className="stats-group">
        <div className="stat-pill xp">
          <Star size={16} />
          <span>Lvl {level}</span>
          <div className="xp-badge">{xp} XP</div>
        </div>

        <div className="stat-pill streak">
          <Flame size={16} className="icon-orange" />
          <span>{streak} days</span>
        </div>

        <div className="user-profile-summary">
          <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
