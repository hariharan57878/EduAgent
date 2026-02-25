import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle, Target, Clock, Brain } from 'lucide-react';
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
