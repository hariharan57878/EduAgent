import React from 'react';
import './ContextPanel.css';
import { Lightbulb, ExternalLink } from 'lucide-react';

const ContextPanel = () => {
  return (
    <div className="context-panel">
      <div className="context-section">
        <h4><Lightbulb size={16} /> Why this feed?</h4>
        <p>Based on your progress in <strong>Logic Programming</strong> and <strong>Deep Learning</strong>.</p>
      </div>

      <div className="context-section">
        <h4>Suggested Follow-up</h4>
        <ul className="suggestion-list">
          <li>
            <a href="#">
              <span>Attention Is All You Need Paper</span>
              <ExternalLink size={12} />
            </a>
          </li>
          <li>
            <a href="#">
              <span>Graph Theory Basics</span>
              <ExternalLink size={12} />
            </a>
          </li>
        </ul>
      </div>

      <div className="context-message">
        "Learning is not a race. It's a daily habit."
      </div>
    </div>
  );
};

export default ContextPanel;
