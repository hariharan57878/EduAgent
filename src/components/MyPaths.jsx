import React from 'react';
import { Plus, BookOpen, Clock, MoreVertical, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MyPaths.css';
import { useApp } from '../context/AppContext';

const MyPaths = () => {
  const navigate = useNavigate();
  const { paths, deletePath } = useApp();
  const [activeMenu, setActiveMenu] = React.useState(null);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this roadmap?")) {
      deletePath(id);
      setActiveMenu(null);
    }
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div className="my-paths-container">
      <div className="paths-header">
        <div>
          <h1>My Learning Paths</h1>
          <p>Manage and track your ongoing learning journeys.</p>
        </div>
        <button className="create-path-btn" onClick={() => navigate('/create-module')}>
          <Plus size={20} />
          <span>New Path</span>
        </button>
      </div>

      <div className="paths-grid">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            className="path-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/module/${path.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="path-image">
              <img src={path.image} alt={path.title} />
              <div className="path-overlay">
                <button className="resume-btn">
                  <PlayCircle size={48} fill="white" className="play-icon-fill" />
                </button>
              </div>
            </div>

            <div className="path-content">
              <div className="path-top">
                <span className="module-count">{path.completed}/{path.modules} Modules</span>
                <div className="menu-container" style={{ position: 'relative' }}>
                  <button
                    className="more-options"
                    onClick={(e) => toggleMenu(e, path.id)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {activeMenu === path.id && (
                    <div className="dropdown-menu">
                      <button className="menu-item delete" onClick={(e) => handleDelete(e, path.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Delete</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3>{path.title}</h3>
              <p>{path.description}</p>

              <div className="path-progress-section">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <div className="path-progress-bar">
                  <div className="path-progress-fill" style={{ width: `${path.progress}%` }}></div>
                </div>
              </div>

              <div className="path-footer">
                <Clock size={14} />
                <span>Last active {path.lastAccessed}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyPaths;
