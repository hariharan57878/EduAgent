import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Clock, BookOpen, Target, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Analytics.css';

const Analytics = () => {
  const { paths, trajectory } = useApp();

  // Aggregate stats from all paths
  const stats = useMemo(() => {
    let totalModules = 0;
    let completedModules = 0;
    
    paths.forEach(p => {
      totalModules += p.modulesCount || 0;
      completedModules += p.completedCount || 0;
    });

    const completionRate = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    return {
      totalModules,
      completedModules,
      completionRate,
      activePaths: paths.length,
      estimatedHours: Math.round(completedModules * 0.75), // Mock calculation
    };
  }, [paths]);

  const cards = [
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Target, color: '#10b981' },
    { label: 'Modules Ready', value: stats.completedModules, icon: BookOpen, color: '#6366f1' },
    { label: 'Hours Invested', value: stats.estimatedHours, icon: Clock, color: '#f59e0b' },
    { label: 'Active Goals', value: stats.activePaths, icon: TrendingUp, color: '#ec4899' },
  ];

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <div className="header-info">
          <h1>Learning Analytics</h1>
          <p>Real-time insights into your progress and retention trajectory.</p>
        </div>
      </header>

      <div className="stats-grid">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={20} />
            </div>
            <div className="card-data">
              <span className="card-label">{card.label}</span>
              <h3 className="card-value">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="analytics-main-grid">
        {/* Retention Chart Area */}
        <div className="chart-section glass-card">
          <div className="section-header">
            <h3>Retention Trajectory</h3>
            <span className="badge-ai">AI Predicted</span>
          </div>
          <div className="visual-chart">
             {/* Simulated Trajectory Line */}
             <div className="trajectory-viz">
                <svg width="100%" height="150" viewBox="0 0 400 150">
                  <path 
                    d="M0,130 Q100,120 200,60 T400,20" 
                    fill="none" 
                    stroke="var(--accent-primary)" 
                    strokeWidth="3"
                    className="path-animate"
                  />
                  <circle cx="200" cy="60" r="4" fill="var(--accent-primary)" />
                  <text x="210" y="65" fill="var(--text-secondary)" fontSize="10">Current Momentum</text>
                </svg>
             </div>
             <div className="chart-legend">
                <div className="legend-item"><span className="dot todo" /> Projected</div>
                <div className="legend-item"><span className="dot active" /> Mastery</div>
             </div>
          </div>
        </div>

        {/* Activity Breakdown */}
        <div className="activity-section glass-card">
           <div className="section-header">
              <h3>Weekly Commitment</h3>
              <Calendar size={18} color="var(--text-secondary)" />
           </div>
           <div className="bar-viz">
              {[65, 40, 85, 30, 90, 55, 70].map((h, i) => (
                <div key={i} className="bar-wrapper">
                  <motion.div 
                    className="bar-fill" 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                  <span className="bar-label">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Detailed Table */}
      <div className="roadmap-performance glass-card">
         <div className="section-header">
            <h3>Roadmap Performance</h3>
         </div>
         <table className="analytics-table">
            <thead>
               <tr>
                  <th>Goal Title</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Avg. Score</th>
               </tr>
            </thead>
            <tbody>
               {paths.map((p, i) => (
                 <tr key={i}>
                    <td className="item-title">{p.title}</td>
                    <td><span className={`status-pill ${p.progress > 0 ? 'active' : 'todo'}`}>{p.progress === 100 ? 'Completed' : 'Accelerating'}</span></td>
                    <td>
                       <div className="mini-progress-bg">
                          <div className="mini-fill" style={{ width: `${p.progress}%` }} />
                       </div>
                    </td>
                    <td className="score-text">{(75 + (i * 4))}%</td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Analytics;
