import React, { useState } from 'react';
import { Mic, Type, Upload, ArrowRight, Sparkles, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VoiceModule from './VoiceModule';
import TextModule from './TextModule';
import { UploadModule, GenerateModule } from './UploadModule';
import './CreateModule.css';
import { useApp } from '../context/AppContext';

const CreateModule = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();
  const { addPath } = useApp();

  const handleGenerate = () => {
    // Simulating AI Generation Process
    const newPath = {
      title: 'Quantum Computing Basics',
      description: 'Generated roadmap based on your voice command and uploaded papers.',
      modules: 8,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=300&auto=format&fit=crop'
    };

    addPath(newPath);
    navigate('/');
  };

  const creationOptions = [
    {
      id: 'voice',
      icon: Mic,
      title: 'Train Voice Model',
      description: 'Clone a voice or upload samples to personalize your AI tutor.',
      color: '#6366f1', // Indigo
      accent: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
    },
    {
      id: 'text',
      icon: Bot, // Changed icon to Bot for AI chat relevance
      title: 'Personal AI Architect',
      description: 'Discuss your goals with our AI to build a perfectly tailored roadmap.',
      color: '#10b981', // Emerald
      accent: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload Material',
      description: 'Drag & drop PDFs, images, or notes.',
      color: '#f59e0b', // Amber
      accent: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
    },
    {
      id: 'generate',
      icon: Sparkles,
      title: 'Generate Module',
      description: 'Combine inputs and create your roadmap.',
      color: '#8b5cf6', // Violet
      accent: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
    }
  ];

  return (
    <div className="create-module-container">
      <motion.div
        className="create-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Start a New Learning Journey</h1>
        <p>Choose how you want to define your learning path.</p>
      </motion.div>

      <div className="options-grid">
        {creationOptions.map((option, index) => (
          <motion.div
            key={option.id}
            className={`option-card ${selectedMode === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedMode(option.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="option-icon-wrapper" style={{ background: option.accent, color: option.color }}>
              <option.icon size={32} />
            </div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>

            <div className="select-indicator">
              {selectedMode === option.id ? 'Selected' : 'Select'} <ArrowRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Content Area based on Selection */}

      {/* Voice Input Interface */}
      {selectedMode === 'voice' && (
        <VoiceModule />
      )}

      {/* Text Input Interface */}
      {selectedMode === 'text' && (
        <TextModule />
      )}

      {/* Upload Interface */}
      {selectedMode === 'upload' && (
        <UploadModule />
      )}

      {/* Generate Interface */}
      {selectedMode === 'generate' && (
        <GenerateModule onGenerate={handleGenerate} />
      )}
    </div>
  );
};

export default CreateModule;
