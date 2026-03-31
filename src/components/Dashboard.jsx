import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout, PlayCircle, CheckCircle2, Plus, Trash2, Sparkles } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [learningStats, setLearningStats] = useState({ totalTime: 0, style: 'Steady Learner' });

  useEffect(() => {
    // Retrieve collection
    let rms = [];
    try {
      rms = JSON.parse(localStorage.getItem('roadmaps') || '[]');
    } catch(e) {}

    // Sync active roadmap to collection
    const activeSaved = localStorage.getItem('roadmap');
    if (activeSaved) {
      try {
        const activeRm = JSON.parse(activeSaved);
        if (activeRm && activeRm.title) {
          const idx = rms.findIndex(r => r.title === activeRm.title);
          if (idx > -1) {
            rms[idx] = activeRm; // Update progress
          } else {
            rms.push(activeRm); // Add new
          }
          localStorage.setItem('roadmaps', JSON.stringify(rms));
        }
      } catch(e) {}
    }
    
    setRoadmaps(rms);

    // Compute Learning stats
    const learningData = JSON.parse(localStorage.getItem('learningData') || '[]');
    if (learningData.length > 0) {
       const totalTime = learningData.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0);
       const avgTime = totalTime / learningData.length;
       let style = 'Steady Learner';
       if (avgTime < 10) style = 'Fast Learner';
       if (avgTime > 30) style = 'Deep Learner';
       setLearningStats({ totalTime, style });
    }
  }, []);

  const handleDelete = (title) => {
    if(!window.confirm(`Are you sure you want to delete the roadmap for "${title}"?`)) return;
    
    // Remove from array
    const updated = roadmaps.filter(r => r.title !== title);
    setRoadmaps(updated);
    localStorage.setItem('roadmaps', JSON.stringify(updated));

    // Remove if active
    const activeSaved = localStorage.getItem('roadmap');
    if (activeSaved) {
      try {
        const activeRm = JSON.parse(activeSaved);
        if (activeRm.title === title) {
          localStorage.removeItem('roadmap');
        }
      } catch(e) {}
    }
    // Delete associated workspace save
    localStorage.removeItem(`workspace_${title}`);
  };

  if (roadmaps.length === 0) {
    return (
      <div className="empty-dashboard-container">
        <div className="empty-state-card">
          <div className="empty-icon-highlight">
            <Layout size={42} />
          </div>
          <h2>Start your learning system</h2>
          <p>Turn your goal into a clear roadmap and begin your structured learning process.</p>
          <button className="btn-primary btn-large" onClick={() => navigate('/create/goal')}>
            Create Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Welcome back</h1>
          <p>Manage your learning roadmaps and maintain your momentum.</p>
          {learningStats.totalTime > 0 && (
            <div className="learning-style-badge">
               <Sparkles size={14} /> <strong>Your Style:</strong> {learningStats.style} • {learningStats.totalTime} mins spent
            </div>
          )}
        </div>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/create/goal')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> New Roadmap
        </button>
      </header>

      <div className="dashboard-summary-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        <AnimatePresence>
          {roadmaps.map((rm, idx) => {
            const modules = rm.modules || [];
            const completedCount = modules.filter(m => m.status === 'Completed' || m.status === 'completed').length;
            const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
            const nextModule = modules.find(m => m.status !== 'Completed' && m.status !== 'completed');

            const handleStartLearning = () => {
              localStorage.setItem('roadmap', JSON.stringify(rm)); // Set this specific roadmap as active
              if (nextModule) {
                navigate(`/workspace/${encodeURIComponent(nextModule.title)}`, { 
                  state: { module: nextModule, roadmapTitle: rm.title, roadmapObj: rm } 
                });
              } else {
                navigate('/roadmap');
              }
            };

            const handleViewFull = () => {
              localStorage.setItem('roadmap', JSON.stringify(rm)); // Set this specific roadmap as active
              navigate('/roadmap');
            };

            return (
              <motion.div 
                key={rm.title + idx}
                className="current-roadmap-card glass-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="cr-header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{color: '#8b5cf6', margin: 0, fontSize: '13px', textTransform: 'uppercase', fontWeight: 700}}>Learning Path</h3>
                    <h2 style={{marginTop: '4px', fontSize: '20px'}}>{rm.title}</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={handleViewFull} style={{ padding: '8px 12px', fontSize: '12px' }}>
                      View Full
                    </button>
                    <button className="btn-secondary" onClick={() => handleDelete(rm.title)} title="Delete Roadmap" style={{ padding: '8px', color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="roadmap-progress-widget" style={{ marginBottom: 'auto' }}>
                  <div className="progress-labels">
                    <span className="progress-text">Overall Progress</span>
                    <span className="progress-percentage">{progress}% completed</span>
                  </div>
                  <div className="progress-track" style={{ height: '8px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {nextModule ? (
                  <div className="next-module-section" style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>Up Next</h4>
                    <div className="next-module-plate" style={{ padding: '12px' }}>
                      <div className="next-info">
                        <h5 style={{ fontSize: '14px', margin: 0 }}>{nextModule.title}</h5>
                      </div>
                      <button className="btn-primary" onClick={handleStartLearning} style={{ padding: '8px 16px', fontSize: '13px' }}>
                        <PlayCircle size={16} /> Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="all-caught-up" style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                      <CheckCircle2 size={18} /> Course Completed!
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
