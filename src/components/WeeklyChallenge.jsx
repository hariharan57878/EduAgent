import React from 'react';
import './FriendsPanel.css'; // Reusing styles for consistent theme

const WeeklyChallenge = () => {
  return (
    <div className="challenge-card glass-card" style={{ marginTop: '0', marginBottom: '2rem' }}>
      <h4>Weekly Challenge</h4>
      <p>Complete 3 modules to unlock the 'Consistency' badge.</p>
      <button className="join-btn">Join Challenge</button>
    </div>
  );
};

export default WeeklyChallenge;
