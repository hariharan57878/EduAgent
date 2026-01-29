import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check, ArrowRight, Sparkles, Mic, Type } from 'lucide-react';
import './UploadModule.css';

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
  // Mock simulation of inputs detected from previous steps
  // In a real app, these would come from props context
  const inputs = [
    { id: 1, icon: Mic, label: 'Voice Input', status: 'Recorded (0:45)', active: true },
    { id: 2, icon: Type, label: 'Text Context', status: 'Intermediate Level', active: true },
    { id: 3, icon: Upload, label: 'Materials', status: '2 Files Uploaded', active: true },
  ];

  return (
    <div className="generate-module-container">
      <div className="generate-header">
        <h2>Ready to Build Your Roadmap?</h2>
        <p>We've gathered your inputs. AI will now combine them to structure your personalized learning path.</p>
      </div>

      <div className="summary-cards">
        {inputs.map(input => (
          <div key={input.id} className={`summary-card ${input.active ? 'active' : ''}`}>
            <input.icon size={24} className="summary-icon" />
            <span className="summary-label">{input.label}</span>
            <span className="summary-status">{input.status}</span>
          </div>
        ))}
      </div>

      <button className="create-roadmap-btn" onClick={onGenerate}>
        <Sparkles size={20} />
        Generate Module
      </button>
    </div>
  );
};
