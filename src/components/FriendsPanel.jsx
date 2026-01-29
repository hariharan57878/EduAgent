import React from 'react';
import { Users, UserPlus, Zap } from 'lucide-react';
import './FriendsPanel.css';

const friends = [
  { id: 1, name: 'Alice', streak: 45, status: 'online' },
  { id: 2, name: 'Bob', streak: 12, status: 'offline' },
  { id: 3, name: 'Charlie', streak: 8, status: 'learning' },
];

const FriendsStreak = () => {
  return (
    <div className="friends-panel glass-card">
      <div className="panel-header">
        <h3>Learning Partners</h3>
      </div>

      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <div className={`avatar ${friend.status}`}>
              {friend.name.charAt(0)}
            </div>
            <div className="friend-info">
              <span className="friend-name">{friend.name}</span>
              <span className="friend-streak">
                <Zap size={12} fill="currentColor" /> {friend.streak} days
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="add-friend-action-btn">
        <UserPlus size={16} />
        <span>Add Friend</span>
      </button>
    </div>
  );
};

export default FriendsStreak;
