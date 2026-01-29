import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle, Map, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import './ModuleDetail.css';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { paths } = useApp();
  const [module, setModule] = useState(null);

  useEffect(() => {
    // Find module by ID
    const foundModule = paths.find(p => p.id.toString() === id);
    if (foundModule) {
      setModule(foundModule);
    } else {
      // Fallback or loading if not found immediately (could redirect)
      navigate('/my-paths');
    }
  }, [id, paths, navigate]);

  if (!module) return <div>Loading...</div>;

  // Mock resources if not present
  const resources = module.resources || [
    { id: 1, title: 'Introduction to Core Concepts', type: 'Video', duration: '15 mins', tag: 'Beginner' },
    { id: 2, title: 'Advanced Theory & Practice', type: 'Article', duration: '10 mins read', tag: 'Intermediate' },
    { id: 3, title: 'Interactive Lab: First Steps', type: 'Lab', duration: '45 mins', tag: 'Practical' },
  ];

  return (
    <div className="module-detail-container">
      <motion.div
        className="module-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <img src={module.image} alt={module.title} className="module-cover-image" />

        <div className="module-header-content">
          <div className="module-title-section">
            <h1>{module.title}</h1>
            <p>{module.description}</p>
          </div>

          <div className="module-meta">
            <div className="meta-item">
              <BookOpen size={18} />
              <span>{module.modules || 0} Modules</span>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <span>{module.duration || '4 Weeks'}</span>
            </div>
            <div className="meta-item">
              <CheckCircle size={18} />
              <span>{module.progress}% Complete</span>
            </div>
          </div>

          <div className="module-actions">
            <button className="primary-btn">
              <PlayCircle size={20} />
              Continue Learning
            </button>
          </div>
        </div>
      </motion.div>

      <div className="roadmap-content">
        <motion.div
          className="roadmap-timeline"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2><Map size={24} /> Learning Roadmap</h2>
          <div className="timeline-list">
            {(module.phases || []).map((phase, index) => (
              <div key={index} className="timeline-item">
                <div className={`timeline-marker ${index === 0 ? 'completed' : ''}`}>
                  {index < 1 && <CheckCircle size={12} color="white" />}
                </div>
                <div className="timeline-content">
                  <h3>Phase {index + 1}</h3>
                  <p>{typeof phase === 'object' ? phase.title : phase}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="recommended-resources"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Recommended Courses & Resources</h2>
          {resources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon">
                {resource.type === 'Video' ? <PlayCircle size={20} /> : <BookOpen size={20} />}
              </div>
              <div className="resource-details">
                <h4>{resource.title}</h4>
                <p>{resource.duration}</p>
                <span className="course-tag">{resource.tag}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <ExternalLink size={16} color="var(--text-secondary)" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ModuleDetail;
