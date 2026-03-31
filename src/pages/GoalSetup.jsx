import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './GoalSetup.css';

const GoalSetup = ({ data, setData }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // fallback logic if rendered without props
  const currentData = data || { goal: '', skillLevel: 'Beginner', timeCommitment: '1 hour/day' };
  const updateData = setData || (() => {});

  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState('intro');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState('');

  const handleStartAssessment = () => {
    setAssessmentStep('chat');
    setChatMessages([
      { sender: 'ai', text: `Hi! To accurately determine your skill level for "${currentData.goal || 'this topic'}", tell me a bit about your past experience or projects in this area.` }
    ]);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newUserMsg = { sender: 'user', text: chatInput };
    const newHistory = [...chatMessages, newUserMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      // Faux AI state machine for conversation
      if (newHistory.length === 2) {
        setChatMessages([...newHistory, { sender: 'ai', text: "Got it! Are there any specific advanced tools, frameworks, or complex problems you've worked with recently?" }]);
      } else if (newHistory.length >= 4) {
        setAssessmentStep('analyzing');
        setTimeout(() => {
          const totalLen = newHistory.filter(m => m.sender === 'user').map(m => m.text).join('').length;
          let level = 'Beginner';
          if (totalLen > 50) level = 'Intermediate';
          if (totalLen > 150) level = 'Advanced';
          setAssessmentResult(level);
          setAssessmentStep('result');
        }, 1500);
      }
    }, 1200);
  };

  const handleApplyResult = () => {
    updateData({ ...currentData, skillLevel: assessmentResult });
    setAssessmentModalOpen(false);
    setAssessmentStep('intro');
    setChatMessages([]);
  };

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const timeCommitments = ['1 hour/day', '2–3 hours/day', '4+ hours/day'];

  const handleGenerate = () => {
    if (!currentData.goal.trim()) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/create/method');
    }, 600);
  };

  return (
    <div className="goal-setup-container">
      {assessmentModalOpen && (
        <div className="ai-assessment-overlay">
          <motion.div className="ai-assessment-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <button className="close-modal-btn" onClick={() => setAssessmentModalOpen(false)}><X size={20}/></button>
            <div className="modal-content-inner">
              <Bot size={32} color="#8b5cf6" />
              {assessmentStep === 'intro' && (
                <>
                  <h3 style={{color: 'var(--text-primary)', margin: 0}}>Quick Skill Assessment</h3>
                  <p style={{color: 'var(--text-secondary)'}}>Answer a few questions to accurately determine your starting level.</p>
                  <button className="btn-primary" style={{marginTop: '1rem', width: '100%', padding: '12px', justifyContent: 'center'}} onClick={handleStartAssessment}>Start Assessment</button>
                </>
              )}
              {assessmentStep === 'chat' && (
                <div className="assessment-chat" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', height: '320px' }}>
                  <div className="chat-history" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px', scrollbarWidth: 'thin' }}>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} style={{ 
                        alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                        background: msg.sender === 'ai' ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                        color: msg.sender === 'ai' ? 'var(--text-primary)' : 'white',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        maxWidth: '85%',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.text}
                      </div>
                    ))}
                    {isAiTyping && (
                      <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '12px', fontSize: '14px' }}>
                        <Loader2 size={16} className="spin-icon" color="var(--text-secondary)" />
                      </div>
                    )}
                  </div>
                  <div className="chat-input-area" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Reply to AI..."
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      autoFocus
                    />
                    <button 
                      className="btn-primary" 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isAiTyping}
                      style={{ padding: '0 16px', borderRadius: '8px' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
              {assessmentStep === 'analyzing' && (
                <div className="analyzing-state">
                  <Loader2 size={32} className="spin-icon" color="#8b5cf6" />
                  <p style={{color: 'var(--text-secondary)'}}>Analyzing your responses...</p>
                </div>
              )}
              {assessmentStep === 'result' && (
                <>
                  <h3 style={{color: 'var(--text-primary)', margin: 0}}>Analysis Complete</h3>
                  <div className="result-badge" style={{padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '100px', fontWeight: 'bold'}}>{assessmentResult.toUpperCase()}</div>
                  <p style={{color: 'var(--text-secondary)'}}>Based on your answers, we recommend starting at this block.</p>
                  <button className="btn-primary" style={{marginTop: '1rem', width: '100%', padding: '12px', justifyContent: 'center'}} onClick={handleApplyResult}>Apply & Continue</button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <div className="goal-setup-card">
        <h1 className="goal-setup-title">Define your learning goal</h1>
        <p className="goal-setup-subtitle">
          Tell us what you want to achieve. We’ll structure it into a clear roadmap.
        </p>

        <div className="goal-setup-form">
          {/* Goal Input */}
          <div className="form-section">
            <textarea
              className="goal-input"
              placeholder="e.g., Become a full stack developer, Learn Data Science, Crack placements"
              value={currentData.goal}
              onChange={(e) => updateData({ ...currentData, goal: e.target.value })}
              autoFocus
            />
          </div>

          {/* Skill Level */}
          <div className="form-section">
            <label>Current Skill Level</label>
            <div className="chips-group">
              {skillLevels.map(level => (
                <div
                  key={level}
                  className={`setup-chip ${currentData.skillLevel === level ? 'active' : ''}`}
                  onClick={() => updateData({ ...currentData, skillLevel: level })}
                >
                  {level}
                </div>
              ))}
            </div>
            <button 
                className="ai-assess-btn"
                onClick={() => { setAssessmentModalOpen(true); setAssessmentStep('intro'); }}
              >
              <Bot size={16} /> Assess my level with AI
            </button>
          </div>

          {/* Time Commitment */}
          <div className="form-section">
            <label>Time Commitment</label>
            <div className="chips-group">
              {timeCommitments.map(time => (
                <div
                  key={time}
                  className={`setup-chip ${currentData.timeCommitment === time ? 'active' : ''}`}
                  onClick={() => updateData({ ...currentData, timeCommitment: time })}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="setup-action-area">
            <button 
              className="btn-generate" 
              onClick={handleGenerate}
              disabled={isGenerating || !currentData.goal.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing your goal and building your roadmap...
                </>
              ) : (
                'Generate Roadmap'
              )}
            </button>
            <span className="helper-text">You can edit your roadmap later</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetup;
