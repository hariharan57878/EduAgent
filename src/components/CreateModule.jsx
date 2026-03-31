import React, { useState } from 'react';
import { Bot, Settings2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CreateModule.css';

const CreateModule = ({ data }) => {
  const [selectedMode, setSelectedMode] = useState('ai');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedMode === 'ai') {
      console.log('Proceeding to AI generation with data:', data);
      
      const userGoal = data?.goal || "Full Stack Developer";
      const words = userGoal.split(' ').filter(w => w.length > 3);
      const coreTopic = words.length > 0 ? words[words.length - 1] : userGoal;
      const capTopic = coreTopic.charAt(0).toUpperCase() + coreTopic.slice(1);

      const mockRoadmap = {
        title: userGoal,
        modules: [
          { id: "1", title: `Introduction to ${capTopic}`, description: `Foundational concepts and architecture of ${capTopic}`, status: "Not Started" },
          { id: "2", title: `Core Logic & Syntax`, description: `Understanding logic flows and standard practices in ${userGoal}`, status: "Not Started" },
          { id: "3", title: `Advanced Tooling`, description: `Explore frameworks and professional tools for ${capTopic}`, status: "Not Started" },
          { id: "4", title: `Project Architecture`, description: `Designing scalable solutions`, status: "Not Started" },
          { id: "5", title: `Capstone Implementation`, description: `Apply knowledge with real-world builds`, status: "Not Started" }
        ]
      };
      localStorage.setItem("roadmap", JSON.stringify(mockRoadmap));
      navigate('/roadmap', { state: { roadmap: mockRoadmap } });
    } else {
      console.log('Proceeding to manual setup with data:', data);
      navigate('/roadmap', { state: { roadmap: [] } });
    }
  };

  const creationOptions = [
    {
      id: 'ai',
      icon: Bot,
      title: 'AI Guided Roadmap',
      description: 'Let AI create a structured roadmap based on your goal and level.',
      color: '#10b981', // Emerald
      accent: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.2) 100%)'
    },
    {
      id: 'manual',
      icon: Settings2,
      title: 'Manual Setup',
      description: 'Create and customize your own roadmap step by step.',
      color: 'var(--text-secondary)',
      accent: 'var(--bg-secondary)'
    }
  ];

  return (
    <div className="create-module-container">
      <motion.div
        className="create-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Choose how to build your roadmap</h1>
        <p>We’ll use your goal to create a structured learning path.</p>
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

      <motion.div 
        className="create-action-area"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button className="btn-primary btn-continue" onClick={handleContinue}>
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default CreateModule;
