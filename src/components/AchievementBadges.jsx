import React from 'react';
import { Award, Zap, Compass, Book } from 'lucide-react';
import './AchievementBadges.css';

const badges = [
  { id: 1, icon: Zap, name: 'Consistency', level: 'Level 3', color: '#f59e0b' },
  { id: 2, icon: Book, name: 'Mastery', level: 'Logic 101', color: '#3b82f6' },
  { id: 3, icon: Compass, name: 'Explorer', level: 'Deep Dive', color: '#10b981' },
  { id: 4, icon: Award, name: 'Scholar', level: 'Top 10%', color: '#8b5cf6' },
];

const BadgesPanel = ({ userBadges = [] }) => {
  // If no badges, show placeholders or nothing
  const displayBadges = badges; // For now, showing all. 
  // Real Logic: const displayBadges = badges.filter(b => userBadges.includes(b.name));

  return (
    <div className="badges-container">
      <h3>Your Journey</h3>
      <div className="badges-grid">
        {displayBadges.map((badge) => (
          <div key={badge.id} className="badge-item glass-card" title={`${badge.name}: ${badge.level}`} style={{ border: 'none' }}>
            <div className="badge-icon" style={{ backgroundColor: `${badge.color}15`, color: badge.color }}>
              <badge.icon size={20} />
            </div>
            <div className="badge-info">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-level">{badge.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesPanel;
