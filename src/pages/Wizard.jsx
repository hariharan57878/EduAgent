import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle, Target, Clock, Brain, Bot, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { authService, aiService, roadmapService, onboardingService } from '../services/api';
import './Wizard.css';

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addPath } = useApp();

  const [formData, setFormData] = useState({
    targetRole: '',
    experienceLevel: 'beginner',
    weeklyAvailability: 5,
    targetOutcome: 'skill',
    deadline: '',
    learningStyle: user?.preferences?.learningStyle || 'visual'
  });

  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState('intro');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState('');

  const handleStartAssessment = () => {
    setAssessmentStep('chat');
    setChatMessages([
      { sender: 'ai', text: `Hi! To accurately determine your skill level for "${formData.targetRole || 'your goal'}", tell me a bit about your past experience or projects in this area.` }
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
      // Faux AI state machine
      if (newHistory.length === 2) {
        setChatMessages([...newHistory, { sender: 'ai', text: "Got it! Are there any specific advanced tools, frameworks, or complex problems you've worked with recently?" }]);
      } else if (newHistory.length >= 4) {
        setAssessmentStep('analyzing');
        setTimeout(() => {
          const totalLen = newHistory.filter(m => m.sender === 'user').map(m => m.text).join('').length;
          let level = 'beginner';
          if (totalLen > 50) level = 'intermediate';
          if (totalLen > 150) level = 'advanced';
          setAssessmentResult(level);
          setAssessmentStep('result');
        }, 1500);
      }
    }, 1200);
  };

  const handleApplyResult = () => {
    setFormData({ ...formData, experienceLevel: assessmentResult });
    setAssessmentModalOpen(false);
    setAssessmentStep('intro');
    setChatMessages([]);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    if (!formData.targetRole.trim()) return;

    setLoading(true);
    try {
      // Single Atomic Server Call: Update Profile + Generate Roadmap + Save Roadmap
      const res = await onboardingService.complete(formData);

      if (res.data.success) {
        // Update local context
        addPath(res.data.roadmap);

        // Refresh and redirect occurs automatically because on page load 
        // App.jsx will get onboardingCompleted: true from /auth/me
        window.location.reload();
      }
    } catch (err) {
      console.error("Wizard Completion Failed", err);
      // Detailed error for user
      const msg = err.response?.data?.message || "Generation timed out. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="wizard-step">
              <div className="icon-badge"><Target size={32} /></div>
              <h2>What's your target role?</h2>
              <p>Be specific. e.g., "Senior React Developer", "Technical Product Manager", "Prompt Engineer".</p>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                autoFocus
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="wizard-step">
              <div className="icon-badge"><Brain size={32} /></div>
              <h2>Current Experience Level</h2>
              <div className="options-list">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    className={`nav-btn-option ${formData.experienceLevel === level ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, experienceLevel: level })}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <button 
                className="ai-assess-btn"
                onClick={() => { setAssessmentModalOpen(true); setAssessmentStep('intro'); }}
              >
                <Bot size={16} /> Assess my level with AI
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="wizard-step">
              <div className="icon-badge"><Clock size={32} /></div>
              <h2>Weekly Availability</h2>
              <p>How many hours per week can you realistically commit?</p>
              <div className="shelf-control">
                <input
                  type="range" min="1" max="40"
                  value={formData.weeklyAvailability}
                  onChange={(e) => setFormData({ ...formData, weeklyAvailability: parseInt(e.target.value) })}
                />
                <span className="value-display">{formData.weeklyAvailability} hrs/week</span>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="wizard-step">
              <div className="icon-badge"><CheckCircle size={32} /></div>
              <h2>Target Outcome</h2>
              <div className="options-list">
                {['job', 'skill', 'certification', 'hobby'].map(o => (
                  <button
                    key={o}
                    className={`nav-btn-option ${formData.targetOutcome === o ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, targetOutcome: o })}
                  >
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="wizard-step">
              <div className="icon-badge"><Sparkles size={32} /></div>
              <h2>Ready to Architect?</h2>
              <p>Review your goal: Mastering <strong>{formData.targetRole}</strong> at <strong>{formData.experienceLevel}</strong> level.</p>
              <div className="review-card glass-card">
                <ul>
                  <li><strong>Target:</strong> {formData.targetRole}</li>
                  <li><strong>Pace:</strong> {formData.weeklyAvailability} hours/week</li>
                  <li><strong>Focus:</strong> {formData.targetOutcome}</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="wizard-overlay">
      {assessmentModalOpen && (
        <div className="ai-assessment-overlay">
          <motion.div className="ai-assessment-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <button className="close-modal-btn" onClick={() => setAssessmentModalOpen(false)}><X size={20}/></button>
            <div className="modal-content-inner">
              <Bot size={32} color="#8b5cf6" />
              {assessmentStep === 'intro' && (
                <>
                  <h3>Quick Skill Assessment</h3>
                  <p>Answer a few questions to accurately determine your starting level.</p>
                  <button className="btn-primary" onClick={handleStartAssessment}>Start Assessment</button>
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
                  <p>Analyzing your responses...</p>
                </div>
              )}
              {assessmentStep === 'result' && (
                <>
                  <h3>Analysis Complete</h3>
                  <div className="result-badge">{assessmentResult.toUpperCase()}</div>
                  <p>Based on your answers, we recommend starting at this block.</p>
                  <button className="btn-primary" onClick={handleApplyResult}>Apply & Continue</button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <div className="wizard-card glass-card">
        <div className="wizard-progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <div className="wizard-footer">
          {step > 1 && (
            <button className="back-btn" onClick={prevStep} disabled={loading}>
              <ArrowLeft size={18} /> Back
            </button>
          )}

          {step < 5 ? (
            <button
              className="next-btn"
              onClick={nextStep}
              disabled={step === 1 && !formData.targetRole.trim()}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button className="finish-btn" onClick={handleFinish} disabled={loading}>
              {loading ? 'Architecting...' : 'Build My Workspace'} <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
