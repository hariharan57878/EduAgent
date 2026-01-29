import React, { useState, useEffect, useRef } from 'react';
import VoiceOrb from '../components/VoiceOrb';
import './VoiceInput.css';
import client from '../api/client';

const VoiceInput = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, SPEAKING
  const [mode, setMode] = useState('manual'); // manual (hold space), auto (continuous)

  // Browser Speech APIs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('LISTENING');
      };

      recognition.onend = () => {
        if (status !== 'PROCESSING' && status !== 'SPEAKING') {
          setStatus('IDLE');
        }
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        // Show interim
        setMessages(prev => {
          // Logic to update interim "user" message? 
          // Simplified: just update a "caption" state or look at last message
          return prev;
        });

        // Final result
        if (event.results[0].isFinal) {
          handleUserMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported");
    }
  }, []); // Run once

  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setStatus('PROCESSING');

    try {
      // Send to Backend Agent
      const res = await client.post('/agent/chat', { message: text });
      const aiReply = res.data.reply;

      // Add AI Message
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);

      // Speak
      speak(aiReply);

    } catch (err) {
      console.error("Agent Error", err);
      setStatus('IDLE');
    }
  };

  const speak = (text) => {
    if (!synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setStatus('SPEAKING');
    utterance.onend = () => {
      setStatus('IDLE');
      if (mode === 'auto') {
        // Small delay then listen again
        setTimeout(() => startListening(), 500);
      }
    };

    synthesisRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && status === 'IDLE') {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && mode === 'manual' && status === 'IDLE') {
        startListening();
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space' && mode === 'manual') {
        stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode, status]);

  // Handle Auto Mode triggers
  useEffect(() => {
    if (mode === 'auto' && status === 'IDLE') {
      startListening();
    }
  }, [mode, status]);


  // Determine display text (latest active interaction)
  const lastUserMsg = messages.filter(m => m.sender === 'user').pop();
  const lastAiMsg = messages.filter(m => m.sender === 'ai').pop();

  let displayCaption = "Ready";
  if (status === 'LISTENING') {
    displayCaption = "Listening...";
  } else if (status === 'PROCESSING') {
    displayCaption = "Thinking...";
  } else if (status === 'SPEAKING') {
    displayCaption = lastAiMsg ? lastAiMsg.text : "Speaking...";
  } else {
    displayCaption = lastUserMsg ? lastUserMsg.text : "Press Space to talk";
  }

  return (
    <div className="voice-space-container">
      <header className="voice-space-header">
        <span className="header-title">EDUCORE // VOICE AGENT</span>
        <div className="voice-status">{status}</div>
      </header>

      <div className="voice-main-display">
        <VoiceOrb status={status} />

        <div className="voice-caption-area">
          <p className="current-transcript">
            {displayCaption}
          </p>
        </div>
      </div>

      <footer className="voice-space-footer">
        <button
          className={`voice-btn ${mode === 'auto' ? 'active' : ''}`}
          onClick={() => {
            setMode('auto');
            synthesisRef.current.cancel();
          }}
        >
          AUTO MODE
        </button>
        <button
          className={`voice-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => {
            setMode('manual');
            stopListening();
            synthesisRef.current.cancel();
            setStatus('IDLE');
          }}
        >
          HOLD SPACE
        </button>
      </footer>
    </div>
  );
};

export default VoiceInput;
