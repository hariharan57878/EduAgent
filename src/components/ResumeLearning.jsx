import React from 'react';
import { PlayCircle, Clock, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ResumeLearning.css';
import { useApp } from '../context/AppContext';

const RecentLearning = () => {
  const navigate = useNavigate();
  const { paths } = useApp();

  const handleCardClick = (id) => {
    navigate(`/module/${id}`);
  };

  const handleAddModule = () => {
    navigate('/create-module');
  };

  // Combine or use paths. For now, let's use the paths from context.
  // If context is empty, maybe fallback? But context has initial data.
  const displayPaths = paths.slice(0, 3); // Show top 3

  return (
    <div className="resume-section">
      <div className="section-header">
        <h2>Pick up where you left off</h2>
        <button className="view-all-btn" onClick={() => navigate('/my-paths')}>
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="cards-container">
        {displayPaths.map((item, index) => (
          <motion.div
            key={item.id}
            className="learning-card glass-card"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCardClick(item.id)}
          >
            <div className="card-image-wrapper">
              <img src={item.image} alt={item.title} className="card-image" />
              <div className="play-overlay">
                <PlayCircle size={48} className="play-icon" />
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
              </div>
            </div>

            <div className="card-content">
              <span className="card-type">Module</span>
              <h3>{item.title}</h3>
              <p>{item.description || item.subtitle}</p>

              <div className="card-footer">
                <Clock size={14} />
                <span>{item.lastAccessed || 'Recently'}</span>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="learning-card add-new-card glass-card"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleAddModule}
        >
          <div className="add-new-content">
            <span className="plus-icon-wrapper"><Plus size={32} /></span>
            <p>Start new topic</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecentLearning;
