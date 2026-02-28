import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  Layout,
  ListOrdered,
  MoreHorizontal,
  ExternalLink,
  Plus,
  TrendingUp
} from 'lucide-react';
import TodayFocus from './TodayFocus';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import './Dashboard.css';

const Dashboard = () => {
  const { paths, completeModule, trajectory } = useApp();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('timeline');
  const [expandedPhases, setExpandedPhases] = useState({});
  const [todayFocus, setTodayFocus] = useState(null);

  const currentPath = paths[0];

  useEffect(() => {
    const fetchFocus = async () => {
      try {
        const res = await client.get('/steward/today-focus');
        setTodayFocus(res.data);
      } catch (err) {
        console.error("Failed to fetch today's focus", err);
      }
    };
    if (user) fetchFocus();
  }, [user, paths]); // Re-fetch on path updates (like completion)

  const handleStartFocus = (pIdx, mIdx) => {
    setExpandedPhases(prev => ({ ...prev, [pIdx]: true }));
    // Small delay to allow expansion animation to start/complete
    setTimeout(() => {
      const moduleEl = document.getElementById(`module-${pIdx}-${mIdx}`);
      if (moduleEl) {
        moduleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        moduleEl.classList.add('focused-pulse');
        setTimeout(() => moduleEl.classList.remove('focused-pulse'), 2000);
      }
    }, 300);
  };

  const handleComplete = (pIdx, mIdx) => {
    if (currentPath.id) {
      completeModule(currentPath.id, pIdx, mIdx);
    }
  };

  if (!currentPath) {
    return (
      <div className="empty-dashboard">
        <div className="empty-content">
          <div className="empty-icon-wrapper">
            <Layout size={48} />
          </div>
          <h2>Ready to architect your success?</h2>
          <p>You don't have an active roadmap yet. Let's build your execution plan.</p>
          <button className="btn-primary" onClick={() => window.location.href = '/create-module'}>
            <Plus size={18} /> Create Execution Plan
          </button>
        </div>
      </div>
    );
  }

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const renderTimeline = () => (
    <div className="timeline-view">
      {currentPath.phases.map((phase, pIdx) => {
        const isOpen = expandedPhases[pIdx] || pIdx === 0;
        const phaseProgress = 45; // Placeholder

        return (
          <div key={pIdx} className={`phase-card ${isOpen ? 'open' : ''}`}>
            <div className="phase-header" onClick={() => togglePhase(pIdx)}>
              <div className="phase-main">
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <div className="phase-info">
                  <h3>{phase.title}</h3>
                  <p>{phase.description}</p>
                </div>
              </div>

              <div className="phase-meta">
                <div className="phase-progress-mini">
                  <div className="mini-bar-bg">
                    <div className="mini-bar-fill" style={{ width: `${phaseProgress}%` }} />
                  </div>
                  <span>{phaseProgress}%</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="phase-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="module-list">
                    {phase.modules.map((module, mIdx) => (
                      <div key={mIdx} id={`module-${pIdx}-${mIdx}`} className="module-item">
                        <div
                          className="module-status"
                          onClick={() => handleComplete(pIdx, mIdx)}
                          style={{ cursor: 'pointer' }}
                        >
                          {module.status === 'completed' ? (
                            <CheckCircle2 size={20} className="status-done" />
                          ) : (
                            <Circle size={20} className="status-todo" />
                          )}
                        </div>

                        <div className="module-details">
                          <div className="module-header-row">
                            <h4>{module.title}</h4>
                            <div className="module-actions">
                              <span className="effort-badge"><Clock size={12} /> {module.estimatedTime || '30m'}</span>
                              <button className="action-btn"><ExternalLink size={14} /></button>
                              <button className="action-btn"><MoreHorizontal size={14} /></button>
                            </div>
                          </div>
                          <p className="module-objective">{module.textContent || 'Master the core principles and execute the basic requirements.'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  const renderKanban = () => (
    <div className="kanban-view">
      <div className="kanban-column">
        <div className="column-header">To Learn <span className="count">12</span></div>
        <div className="kanban-cards">
          {/* Example Kanban Card */}
          <div className="kanban-card">
            <h4>Advanced React Patterns</h4>
            <div className="card-footer">
              <span className="effort-badge">45m</span>
            </div>
          </div>
        </div>
      </div>
      <div className="kanban-column highlight">
        <div className="column-header">In Progress <span className="count">2</span></div>
        <div className="kanban-cards">
          <div className="kanban-card">
            <h4>Node.js Event Loop</h4>
            <div className="card-footer">
              <span className="effort-badge">60m</span>
            </div>
          </div>
        </div>
      </div>
      <div className="kanban-column">
        <div className="column-header">Completed <span className="count">45</span></div>
        <div className="kanban-cards">
          {/* Completed Cards */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-v2">
      <header className="content-header">
        <div className="header-text">
          <h1>Learning Command Center</h1>
          <p>Execute your roadmap to mastery.</p>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            <ListOrdered size={16} /> Timeline
          </button>
          <button
            className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <Layout size={16} /> Kanban
          </button>
        </div>
      </header>

      {trajectory && (
        <div className="trajectory-summary-bar">
          <div className="indicator">
            <TrendingUp size={14} className="icon-blue" />
            <span className="label">Weekly Rate:</span>
            <span className="value">{trajectory.weeklyCompletionRate} modules</span>
          </div>
          <div className="indicator">
            <ListOrdered size={14} className="icon-purple" />
            <span className="label">Remaining:</span>
            <span className="value">{trajectory.remainingModules} modules</span>
          </div>
          <div className="indicator">
            <Clock size={14} className="icon-orange" />
            <span className="label">ETA:</span>
            <span className="value">{trajectory.estimatedWeeksToFinish} weeks</span>
          </div>
          <div className={`indicator momentum ${trajectory.momentumState?.toLowerCase()}`}>
            <div className="momentum-dot" />
            <span className="label">Momentum:</span>
            <span className="value">{trajectory.momentumState}</span>
          </div>
        </div>
      )}

      <div className="command-workspace">
        {viewMode === 'timeline' && <TodayFocus focus={todayFocus} onStart={handleStartFocus} />}
        {viewMode === 'timeline' ? renderTimeline() : renderKanban()}
      </div>
    </div>
  );
};

export default Dashboard;
