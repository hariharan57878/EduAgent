import React from 'react';
import { Bookmark, MessageCircle } from 'lucide-react';
import './FeedCard.css';

const FeedCard = ({ item }) => {
  return (
    <div className="feed-card">
      <div className="feed-header">
        <span className="feed-source-tag">@{item.username}</span>
        <span className="feed-time">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="feed-summary" style={{ marginTop: '0.5rem', marginLeft: '0' }}>{item.content}</p>

      <div className="feed-footer">
        <div className="feed-topic-tag">
          Relates to: <span>{item.relatedTopic}</span>
        </div>

        <div className="feed-actions">
          {/* Mock actions */}
          <button className="icon-btn" title="Discuss">
            <MessageCircle size={18} />
          </button>
          <button className="icon-btn" title="Save for later">
            <Bookmark size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
