import React from 'react';
import { Target, Clock, Zap, CheckCircle2 } from 'lucide-react';
import './TodayFocus.css';

const TodayFocus = ({ focus, onStart }) => {
  if (!focus) return null;

  if (focus.type === 'RECOVERY') {
    return (
      <div className="today-focus-card recovery">
        <div className="focus-badge recovery">RECOVERY MODE</div>
        <div className="focus-main">
          <div className="focus-icon-blue"><Zap size={24} /></div>
          <div className="focus-details">
            <h4>Welcome Back!</h4>
            <p>{focus.message}</p>
            <div className="recovery-target">
              <strong>Next Small Win:</strong> {focus.title} ({focus.estimatedTime}m)
            </div>
          </div>
          <button className="start-now-btn recovery" onClick={() => onStart(focus.phaseIdx, focus.moduleIdx)}>
            Restart Momentum
          </button>
        </div>
      </div>
    );
  }

  if (focus.type === 'COMPLETED') {
    return (
      <div className="today-focus-card celebration">
        <div className="focus-icon-gold"><CheckCircle2 size={24} /></div>
        <div className="focus-details">
          <h4>Execution Goal Reached!</h4>
          <p>{focus.reason}</p>
        </div>
      </div>
    );
  }

  const isLowConfidence = focus.confidenceScore < 0.7;

  return (
    <div className="today-focus-card">
      <div className="focus-badge">TODAY'S FOCUS</div>

      <div className="focus-main">
        <div className="focus-icon">
          <Target size={24} />
        </div>

        <div className="focus-details">
          <div className="focus-header-row">
            <h4>{focus.title}</h4>
            <div className="focus-meta">
              <Clock size={14} />
              <span>{focus.estimatedTime}m</span>
            </div>
          </div>
          <p className="focus-reason">
            <Zap size={12} className="icon-burn" />
            {isLowConfidence ? "Maintain your momentum with current phases." : focus.reason}
          </p>
        </div>

        <button className="start-now-btn" onClick={() => onStart(focus.phaseIdx, focus.moduleIdx)}>
          Start Now <Zap size={14} />
        </button>
      </div>
    </div>
  );
};

export default TodayFocus;
