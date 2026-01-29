import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, StickyNote } from 'lucide-react';
import './NextActionBar.css';

const NextActionBar = ({ visible, onAction }) => {
  if (!visible) return null;

  return (
    <motion.div
      className="next-action-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <button className="action-button primary" onClick={() => onAction('roadmap')}>
        <span>Convert to Roadmap</span>
        <ArrowRight size={18} />
      </button>

      <button className="action-button secondary" onClick={() => onAction('chat')}>
        <MessageSquare size={18} />
        <span>Continue as Chat</span>
      </button>

      <button className="action-button secondary" onClick={() => onAction('note')}>
        <StickyNote size={18} />
        <span>Save as Note</span>
      </button>
    </motion.div>
  );
};

export default NextActionBar;
