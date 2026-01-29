import React, { useState, useEffect } from 'react';
import ChannelSidebar from '../components/Community/ChannelSidebar';
import FeedCard from '../components/Community/FeedCard';
import ContextPanel from '../components/Community/ContextPanel';
import client from '../api/client';
import { Send } from 'lucide-react';
import './Community.css';

const Community = () => {
  const [activeChannel, setActiveChannel] = useState('daily-learning');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await client.get(`/posts?channel=${activeChannel}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeChannel]);

  // Create Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const res = await client.post('/posts', {
        channel: activeChannel,
        content: newPostContent
      });
      // Add new post to top of list
      setPosts([res.data, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error("Failed to post", err);
    }
  };

  const channels = [
    { id: 'daily-learning', name: 'daily-learning', type: 'text' },
    { id: 'wins', name: 'wins', type: 'voice' },
    { id: 'resources', name: 'resources', type: 'text' },
    { id: 'general', name: 'general', type: 'text' }
  ];

  return (
    <div className="community-page-container">
      <ChannelSidebar
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        channels={channels}
      />

      <div className="daily-feed">
        <div className="feed-view-header glass-card" style={{ borderRadius: '0' }}>
          <h2>#{activeChannel}</h2>
          <p>Global community feed.</p>
        </div>

        {/* Post Input */}
        <div className="post-input-container">
          <form onSubmit={handlePostSubmit} className="post-form">
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button type="submit" disabled={!newPostContent.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>

        <div className="feed-content">
          {loading ? (
            <div className="loading-feed">Loading updates...</div>
          ) : (
            posts.map(item => (
              <FeedCard key={item._id} item={item} />
            ))
          )}

          {!loading && posts.length === 0 && (
            <div className="empty-feed">
              <p>No updates yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>

      <ContextPanel />
    </div>
  );
};

export default Community;
