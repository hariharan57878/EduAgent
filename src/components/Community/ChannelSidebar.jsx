import React from 'react';
import { Hash } from 'lucide-react';
import './ChannelSidebar.css';

const ChannelSidebar = ({ activeChannel, setActiveChannel, channels }) => {
  return (
    <div className="channel-sidebar">
      <div className="channel-header">
        <h3>Learning Commons</h3>
      </div>
      <div className="channel-list">
        {channels.map((channel) => (
          <button
            key={channel.id}
            className={`channel-item ${activeChannel === channel.id ? 'active' : ''}`}
            onClick={() => setActiveChannel(channel.id)}
          >
            <Hash size={18} className="channel-hash" />
            <span>{channel.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelSidebar;
