import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertCircle, TrendingUp, Target, X, Info } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './StewardPanel.css';

const StewardPanel = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { paths } = useApp();
  const hasRoadmap = paths && paths.length > 0;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await client.get('/steward/suggestions');
        setSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch steward suggestions", err);
      }
    };
    if (user) fetchSuggestions();
  }, [user]);

  const removeSuggestion = (index) => {
    setSuggestions(suggestions.filter((_, i) => i !== index));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'INACTIVITY': return <AlertCircle size={18} />;
      case 'OVERLOAD': return <Zap size={18} />;
      case 'COMPLETION_ACCELERATION': return <TrendingUp size={18} />;
      default: return <Target size={18} />;
    }
  };

  if (!hasRoadmap) return null;

  if (collapsed) {
    return (
      <div className="steward-panel-collapsed" onClick={() => setCollapsed(false)}>
        <BrainCircuit size={24} />
      </div>
    );
  }

  return (
    <aside className="steward-panel">
      <div className="steward-header">
        <h3><Zap size={18} className="icon-burn" /> Steward Intelligence</h3>
        <p className="steward-subtitle">Guided execution management</p>
      </div>

      <div className="steward-body">
        <AnimatePresence>
          {suggestions.length === 0 ? (
            <div className="empty-steward">
              <Info size={32} />
              <p>Everything is on track. Keep up the momentum.</p>
            </div>
          ) : (
            suggestions.map((item, index) => (
              <motion.div
                key={index}
                className={`steward-card priority-${item.priority.toLowerCase()}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card-header">
                  <div className="type-icon">{getIcon(item.type)}</div>
                  <span className="priority-tag">{item.priority}</span>
                  <button className="dismiss-btn" onClick={() => removeSuggestion(index)}>
                    <X size={14} />
                  </button>
                </div>
                <div className="card-content">
                  <p className="suggestion-msg">{item.message}</p>
                  <div className="action-hint">
                    <strong>Next Action:</strong> {item.action}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="steward-footer">
        <div className="execution-score">
          <div className="score-label">Execution Velocity</div>
          <div className="score-value">8.4 / 10</div>
        </div>
      </div>
    </aside>
  );
};

// Import correctly in App.jsx (already done)
const BrainCircuit = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.96.46 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5z" />
    <path d="M12 8c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    <path d="M16 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
    <path d="M8 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
  </svg>
);

export default StewardPanel;
