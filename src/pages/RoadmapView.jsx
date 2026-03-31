import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle2, Circle, Trophy } from 'lucide-react';
import './RoadmapView.css';

const RoadmapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [learningInfo, setLearningInfo] = useState([]);
  const moduleRefs = useRef({});

  useEffect(() => {
    let rm = location.state?.roadmap;
    if (!rm) {
       const saved = localStorage.getItem('roadmap');
       if (saved) {
         try {
           rm = JSON.parse(saved);
         } catch (e) {
           console.error("Failed to parse roadmap from local storage", e);
         }
       }
    } else {
       localStorage.setItem('roadmap', JSON.stringify(rm));
    }
    setRoadmap(rm);

    // Load Adaptive learning data
    const savedLearn = localStorage.getItem('learningData');
    if (savedLearn) {
      setLearningInfo(JSON.parse(savedLearn));
    }
  }, [location.state]);

  useEffect(() => {
    if (roadmap && roadmap.modules) {
      const currentModuleIndex = roadmap.modules.findIndex(m => m.status !== 'Completed' && m.status !== 'completed');
      if (currentModuleIndex !== -1) {
        const currentRef = moduleRefs.current[currentModuleIndex];
        if (currentRef) {
          setTimeout(() => {
            currentRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500); // Wait for animations
        }
      }
    }
  }, [roadmap]);

  if (!roadmap || !roadmap.modules || roadmap.modules.length === 0) {
    return (
      <div className="roadmap-fallback">
        <div className="empty-state-card">
          <h2>No roadmap found.</h2>
          <p>Please create one to track your learning journey.</p>
          <button className="btn-primary" onClick={() => navigate('/create/goal')}>
            Go to Goal Setup
          </button>
        </div>
      </div>
    );
  }

  const rawModules = roadmap.modules || [];
  
  // Merge learning data & Apply Adaptive Logic
  const modules = [];
  const FAST_TIME = 10; 
  const HIGH_TIME = 30;
  const HIGH_NOTES = 5;

  rawModules.forEach((m, idx) => {
    const info = learningInfo.find(l => l.moduleTitle === m.title) || {};
    const merged = { ...m, ...info };
    
    // SECTION 8: ANALYSIS LOGIC
    let badge = null;
    if (merged.status === 'Completed') {
      if (merged.timeSpent < FAST_TIME && merged.notesCount < 2) {
        badge = { text: "⚡ Fast Progress", type: "fast" };
      } else if (merged.timeSpent > HIGH_TIME || merged.notesCount > HIGH_NOTES) {
        badge = { text: "📌 Needs Reinforcement", type: "heavy" };
      } else {
        badge = { text: "Normal Progress", type: "normal" };
      }
    }
    merged.learningBadge = badge;
    modules.push(merged);

    // SECTION 10: ADAPT NEXT MODULE (Helper Insertion)
    if (badge?.type === "heavy" && rawModules[idx+1]?.title !== "Practice & Revision") {
       modules.push({
         id: `extra-${m.id || idx}`,
         title: "Practice & Revision",
         description: "Reinforce concepts from the previous module before moving ahead.",
         status: "Not Started",
         isAdaptive: true
       });
    }
  });

  const completedCount = modules.filter(m => m.status === 'Completed').length;
  const progress = modules.length > 0 ? Object.is(Math.round((completedCount / modules.length) * 100), NaN) ? 0 : Math.round((completedCount / modules.length) * 100) : 0;

  const handleStartLearning = (module) => {
    navigate(`/workspace/${encodeURIComponent(module.title)}`, { 
      state: { 
        module: module,
        roadmapTitle: roadmap.title,
        roadmapObj: roadmap
      } 
    });
  };

  return (
    <div className="roadmap-view-container">
      <header className="roadmap-header">
        <div className="roadmap-header-top">
          <div className="roadmap-titles">
            <h1>{roadmap.title || "Your Learning Roadmap"}</h1>
            <p>Here is your structured path based on your goal.</p>
          </div>
          <button className="btn-secondary btn-edit" onClick={() => navigate('/create/method')}>
            Edit Roadmap
          </button>
        </div>

        <div className="roadmap-progress-widget">
          <div className="progress-labels">
            <span className="progress-text">Overall Progress</span>
            <span className="progress-percentage">{progress}% completed</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </header>

      <div className="roadmap-timeline">
        <div className="timeline-line"></div>
        <div className="timeline-line-progress" style={{ height: `${progress}%` }}></div>
        {modules.map((module, index) => {
          const status = module.status || 'Not Started';
          const isCompleted = status === 'Completed' || status === 'completed';
          const isInProgress = status === 'In Progress' || status === 'in-progress';
          // Determine if it's the "current" module (first not-completed)
          let finalProgressState = isInProgress;
          if (!isInProgress && !isCompleted && index === modules.findIndex(m => m.status !== 'Completed' && m.status !== 'completed')) {
             finalProgressState = true; 
          }
          
          const isLeft = index % 2 === 0;

          return (
            <motion.div 
              key={module.id || index}
              ref={el => moduleRefs.current[index] = el}
              className={`timeline-item ${isLeft ? 'left' : 'right'} ${isCompleted ? 'completed' : ''} ${finalProgressState ? 'current' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="timeline-content">
                <div className="tc-header">
                  <h3>{module.title}</h3>
                  <div className="rm-status-badge">
                    {finalProgressState ? 'In Progress' : (module.isAdaptive ? 'Adaptive Helper' : status)}
                  </div>
                </div>
                {module.learningBadge && (
                  <div className={`rm-learning-streak ${module.learningBadge.type}`}>
                    {module.learningBadge.text}
                  </div>
                )}
                <p className="rm-description" title={module.description}>
                  {module.description}
                </p>

                <div className="rm-module-actions">
                  <button 
                    className={`btn-start-learning ${isCompleted ? 'btn-done' : ''}`}
                    onClick={() => handleStartLearning(module)}
                  >
                    <PlayCircle size={16} /> 
                    {isCompleted ? 'Review' : 'Start Learning'}
                  </button>
                </div>
              </div>

              <div className="timeline-node">
                {isCompleted ? (
                  <CheckCircle2 size={24} className="node-icon done" />
                ) : finalProgressState ? (
                  <Circle size={24} className="node-icon current" />
                ) : (
                  <Circle size={24} className="node-icon todo" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapView;
