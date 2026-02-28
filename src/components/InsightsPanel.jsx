import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Calendar, Clock, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './InsightsPanel.css';

const ManualLineChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map(d => d.count), 5);
  const width = 300;
  const height = 150;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - (d.count / max) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid Lines */}
      {[0, 1, 2, 3, 4].map(i => {
        const y = padding + (i * (height - 2 * padding)) / 4;
        return <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border-color)" strokeWidth="0.5" />;
      })}

      {/* Path */}
      <motion.polyline
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Points */}
      {data.map((d, i) => {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const y = height - padding - (d.count / max) * (height - 2 * padding);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="var(--accent-primary)"
            stroke="var(--bg-primary)"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
};

const InsightsPanel = () => {
  const { insightsOpen, toggleInsights, trajectory } = useApp();

  if (!insightsOpen) return null;

  const data = trajectory?.history || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Calculating...';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'TBD';
    }
  };

  return (
    <AnimatePresence>
      {insightsOpen && (
        <>
          <motion.div
            className="insights-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleInsights}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
          <motion.div
            className="insights-overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="insights-header">
              <h2>Execution Insights</h2>
              <button className="close-btn" onClick={toggleInsights}>
                <X size={24} />
              </button>
            </div>

            <div className="insights-content">
              <div className="insight-section">
                <h3>Velocity Trend (Weekly)</h3>
                <div className="chart-container">
                  <ManualLineChart data={data} />
                </div>
                <div className={`trend-badge ${trajectory?.velocityTrend?.toLowerCase() || 'stable'}`}>
                  {trajectory?.velocityTrend === 'IMPROVING' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {trajectory?.velocityTrend || 'STABLE'} VELOCITY
                </div>
              </div>

              <div className="insight-section">
                <h3>Time Investment</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="label">Estimated</span>
                    <div className="value">{Math.round((trajectory?.stats?.estimatedEffort || 0) / 60)}h</div>
                  </div>
                  <div className="stat-box">
                    <span className="label">Actual Spent</span>
                    <div className="value">{Math.round((trajectory?.stats?.actualTime || 0) / 60)}h</div>
                  </div>
                </div>
                <div className="time-investment" style={{ marginTop: '16px' }}>
                  <div className="investment-row">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Efficiency Ratio</span>
                    <span style={{ fontWeight: 600 }}>
                      {trajectory?.stats?.estimatedEffort ?
                        Math.round((trajectory.stats.estimatedEffort / (trajectory.stats.actualTime || 1)) * 100) : 100}%
                    </span>
                  </div>
                  <div className="bar-comp">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.min(100, (trajectory?.stats?.estimatedEffort / (trajectory?.stats?.actualTime || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="insight-section">
                <h3>Momentum State</h3>
                <div className="stat-box" style={{ borderColor: trajectory?.momentumState === 'AT_RISK' ? '#ef4444' : 'var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Target size={24} color={trajectory?.momentumState === 'AT_RISK' ? '#ef4444' : 'var(--accent-primary)'} />
                    <div>
                      <span className="label" style={{ marginBottom: 0 }}>Current State</span>
                      <div className="value">{trajectory?.momentumState || 'STABLE'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="projected-finish">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> Projected Finish
                </div>
                <span className="date">{formatDate(trajectory?.projectedFinishDate)}</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Based on your average completion rate of {trajectory?.weeklyCompletionRate || 0} modules per week.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InsightsPanel;
