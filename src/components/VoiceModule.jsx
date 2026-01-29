import React, { useState } from 'react';
import { Mic, Upload, Play, Square, Cpu, CheckCircle, Volume2 } from 'lucide-react';
import './CreateModule.css'; // Re-use styles

const VoiceModule = () => {
  const [step, setStep] = useState('initial'); // initial, recording, uploading, training, complete
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Mock Recording
  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setAudioFile({ name: 'Recorded_Sample_001.wav', size: '2.4 MB' });
      setStep('ready_to_train');
    } else {
      setIsRecording(true);
      setStep('recording');
    }
  };

  // Mock File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setStep('ready_to_train');
    }
  };

  const startTraining = () => {
    setStep('training');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTrainingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStep('complete');
      }
    }, 150); // Simulate 3s training time
  };

  return (
    <div className="interaction-area">
      <div className="voice-cloning-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

        {/* Header Section */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px', background: 'var(--accent-soft)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto',
            color: 'var(--accent-color)'
          }}>
            <Volume2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Train AI Voice Model</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload a clean voice sample or record yourself to create a custom AI tutor voice.</p>
        </div>

        {/* Input Area */}
        {step !== 'training' && step !== 'complete' && (
          <div className="voice-input-methods" style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
            {/* Recording Option */}
            <div
              className={`method-card ${isRecording ? 'active' : ''}`}
              onClick={handleRecordToggle}
              style={{
                flex: 1, padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'all 0.3s', maxWidth: '250px',
                borderColor: isRecording ? '#ef4444' : 'var(--border-color)',
                background: isRecording ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
              }}
            >
              <div className={`mic-wrapper ${isRecording ? 'pulse-red' : ''}`} style={{
                width: '50px', height: '50px', borderRadius: '50%', background: isRecording ? '#ef4444' : 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: isRecording ? 'white' : 'var(--text-primary)'
              }}>
                {isRecording ? <Square size={20} fill="white" /> : <Mic size={24} />}
              </div>
              <span>{isRecording ? "Stop Recording" : "Record Voice"}</span>
              {isRecording && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Recording...</span>}
            </div>

            {/* Upload Option */}
            <label
              className="method-card"
              style={{
                flex: 1, padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'all 0.3s', maxWidth: '250px'
              }}
            >
              <input type="file" accept="audio/*" hidden onChange={handleFileUpload} />
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)'
              }}>
                <Upload size={24} />
              </div>
              <span>Upload Audio</span>
            </label>
          </div>
        )}

        {/* Selected File Preview */}
        {audioFile && step === 'ready_to_train' && (
          <div className="file-preview" style={{
            background: 'var(--bg-primary)', padding: '1rem 2rem', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)'
          }}>
            <div style={{ background: 'var(--accent-color)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
              <Play size={20} fill="white" />
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{audioFile.name}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ready to process</span>
            </div>
          </div>
        )}

        {/* Training Progress */}
        {step === 'training' && (
          <div className="training-status" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}><Cpu size={48} className="spin" color="var(--accent-color)" /></div>
            <h3 style={{ marginBottom: '1.5rem' }}>Training Voice Model...</h3>
            <div className="progress-bar-track" style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ width: `${trainingProgress}%`, height: '100%', background: 'var(--accent-color)', transition: 'width 0.2s' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{trainingProgress}% Analyzed</p>
          </div>
        )}

        {/* Success State */}
        {step === 'complete' && (
          <div className="success-state" style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
            <h3>Voice Model Ready!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You can now use this voice profile for your AI learning sessions.</p>
            <button className="confirm-btn">Use This Voice</button>
          </div>
        )}

        {/* Action Button */}
        {step === 'ready_to_train' && (
          <button className="confirm-btn" onClick={startTraining}>
            <Cpu size={20} /> Train Model
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceModule;
