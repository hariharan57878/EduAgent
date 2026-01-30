import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check, ArrowRight, Sparkles, Mic, Type } from 'lucide-react';
import './UploadModule.css';
import client from '../api/client';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const UploadModule = ({ onFilesChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    // Convert FileList to Array and add to state
    const fileArray = Array.from(newFiles).map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type
    }));
    const updatedFiles = [...files, ...fileArray];
    setFiles(updatedFiles);
    // Notify parent if needed
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  return (
    <div className="upload-module-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <div className="upload-content">
          <div className="upload-icon-circle">
            <Upload size={32} />
          </div>
          <div className="upload-text">
            <h3>Click to upload or drag and drop</h3>
            <p>PDF, DOCX, TXT  (Max 10MB)</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="uploaded-files-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <FileText className="file-icon" size={20} />
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{file.size}</span>
              </div>
              <button className="remove-file-btn" onClick={() => removeFile(index)}>
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const GenerateModule = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const { addPath } = useApp(); // Access context directly
  const navigate = useNavigate();

  const handleQuickGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      // Call AI Agent
      const response = await client.post('/agent/generate-roadmap', {
        role: topic,
        interests: [goals]
      });

      const roadmapData = response.data;

      // Save to Backend to persist
      const savedRoadmap = await client.post('/roadmaps', roadmapData);

      // Update Context
      addPath(savedRoadmap.data);

      setLoading(false);
      // Navigate to home or new module
      navigate('/');
    } catch (err) {
      console.error("Generation failed", err);
      setLoading(false);
      alert("Failed to generate roadmap. Please try again.");
    }
  };

  return (
    <div className="generate-module-container">
      <div className="generate-header">
        <h2>Quick Roadmap Generator</h2>
        <p>Tell us what you want to learn, and our AI will architect the perfect path.</p>
      </div>

      <div className="input-group">
        <label>Topic / Role</label>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="e.g. Full Stack Developer, Quantum Physics, Spanish"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      </div>

      <div className="input-group">
        <label>Specific Goals (Optional)</label>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="e.g. Prepare for interview, Learn basics only"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
        </div>
      </div>

      <button
        className="create-roadmap-btn"
        onClick={handleQuickGenerate}
        disabled={loading || !topic.trim()}
      >
        {loading ? (
          <>
            <Sparkles size={20} className="spin" />
            Architecting...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate Roadmap
          </>
        )}
      </button>

      <style>{`
        .input-group {
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 500px;
        }
        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .input-wrapper input {
          width: 100%;
          padding: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.2s;
        }
        .input-wrapper input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
        .spin {
            animation: spin 2s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
