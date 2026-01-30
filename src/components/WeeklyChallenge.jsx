import React, { useState } from 'react';
import './FriendsPanel.css'; // Reusing styles

const WeeklyChallenge = () => {
  const [joined, setJoined] = useState(false);

  const challenges = [
    "Complete 3 Python Modules",
    "Maintain a 7-day streak",
    "Post 2 community updates",
    "Complete 1 Voice Session"
  ];

  // Deterministic challenge based on week of year (mock)
  const currentChallenge = challenges[new Date().getDate() % challenges.length];

  return (
    <div className="challenge-card glass-card" style={{ marginTop: '0', marginBottom: '2rem' }}>
      <h4>Weekly Challenge</h4>
      <p>{currentChallenge} to unlock the 'Consistency' badge.</p>
      <button
        className={`join-btn ${joined ? 'active' : ''}`}
        onClick={() => setJoined(!joined)}
        style={{
          backgroundColor: joined ? 'var(--success)' : 'var(--text-primary)',
          color: joined ? 'white' : 'var(--bg-primary)'
        }}
      >
        {joined ? 'Joined ✓' : 'Join Challenge'}
      </button>
    </div>
  );
};

export default WeeklyChallenge;
