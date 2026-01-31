import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Book, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { marked } from 'marked';
import VoiceOrb from '../components/VoiceOrb';
import './VoiceInput.css';
import client from '../api/client';

const VoiceInput = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, SPEAKING, THINKING
  const [mode, setMode] = useState('manual'); // manual (hold space), auto (continuous)

  const location = useLocation();
  const [showTranscript, setShowTranscript] = useState(false);

  // Browser Speech APIs
  const recognitionRef = useRef(null);
  // Replaced synthesisRef with audioRef for ElevenLabs
  const audioRef = useRef(null);
  const context = location.state?.context;
  const initRef = useRef(false); // Ref to track initialization
  const isSpeakingRef = useRef(false); // Ref to track active speaking state explicitly

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
        // Stop any playing audio when listening starts
        stopAudio();
      };

      recognition.onend = () => {
        if (status !== 'PROCESSING' && status !== 'SPEAKING' && status !== 'THINKING') {
          setStatus('IDLE');
        }
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        // Final result
        if (event.results[0].isFinal) {
          handleUserMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported");
    }

    // Cleanup on Unmount (Navigation)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      isSpeakingRef.current = false;
    };
  }, []); // Run once

  // Initial Greeting if Context is Present
  useEffect(() => {
    if (context && !initRef.current) {
      initRef.current = true; // Mark as initialized immediately

      const initSession = async () => {
        setStatus('THINKING');
        try {
          const prompt = `Start a teaching session. Topic: ${context.topic}.
Content Summary: ${context.content}.
Phase: ${context.phase}.
Greet the user and introduce the topic effectively. Keep it conversational.`;

          const res = await client.post('/agent/chat', {
            message: "Begin Session",
            context: {
              role: "Teacher",
              topic: context.topic,
              systemInstruction: prompt
            }
          });

          const aiReply = res.data.reply;
          setMessages([{ sender: 'ai', text: aiReply }]);
          speak(aiReply);

        } catch (err) {
          console.error("Init Session Failed", err);
          setStatus('IDLE');
        }
      };

      // Small delay to ensure component mounted
      setTimeout(initSession, 1000);
    }
  }, [context]);

  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    // If we are actively processing (fetching API), ignore.
    // BUT if we were 'SPEAKING' and user interrupted, we allow it.
    if (status === 'PROCESSING' || status === 'THINKING') {
      console.log("Ignored input while thinking/processing:", text);
      return;
    }

    // Add User Message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setStatus('PROCESSING');

    try {
      // Send to Backend Agent
      const res = await client.post('/agent/chat', {
        message: text,
        context: context ? {
          role: "Teacher",
          topic: context.topic,
          history: messages.slice(-5) // Send brief history context
        } : undefined
      });
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

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    isSpeakingRef.current = false; // Force unlock
    // If we were speaking, we are now IDLE (until listening starts)
    if (status === 'SPEAKING') {
      setStatus('IDLE');
    }
  };

  const speak = async (text) => {
    stopAudio(); // Stop any current audio
    isSpeakingRef.current = true; // Lock speaking

    if (!text) {
      setStatus('IDLE');
      isSpeakingRef.current = false;
      return;
    }

    setStatus('THINKING');

    try {
      const response = await client.post('/agent/generate-voice', { text }, { responseType: 'blob' });

      // If we stopped or changed state while fetching, abort playback
      if (!isSpeakingRef.current) return;

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        // Double check if we are still allowed to speak
        if (!isSpeakingRef.current) return;

        setStatus('SPEAKING');
        audio.play().catch(e => {
          console.error("Playback failed", e);
          setStatus('IDLE');
          isSpeakingRef.current = false;
        });
      };

      audio.onended = () => {
        setStatus('IDLE');
        isSpeakingRef.current = false; // Unlock
        URL.revokeObjectURL(audioUrl);
        if (mode === 'auto') {
          // Increased delay to prevent self-looping
          setTimeout(() => startListening(), 1500);
        }
      };

      audio.onerror = () => {
        console.error("Audio playback error");
        setStatus('IDLE');
        isSpeakingRef.current = false;
      }

    } catch (err) {
      console.error("Voice Generation failed", err);
      setStatus('IDLE');
      isSpeakingRef.current = false;
    }
  };

  const startListening = () => {
    // Allow starting if IDLE or we are Interrupting (SPEAKING)
    if (recognitionRef.current && (status === 'IDLE' || status === 'SPEAKING')) {
      stopAudio(); // Ensure audio stops if interrupting
      try {
        recognitionRef.current.start();
        setStatus('LISTENING');
      } catch (e) {
        // Already started
        console.warn("Mic already active");
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
      if (e.code === 'Space' && mode === 'manual') {
        if (status === 'SPEAKING') {
          stopAudio(); // INTENTIONAL INTERRUPTION
        }
        if (status === 'IDLE' || status === 'SPEAKING') {
          startListening();
        }
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
  } else if (status === 'THINKING') {
    displayCaption = "Generating Voice...";
  } else if (status === 'SPEAKING') {
    displayCaption = lastAiMsg ? lastAiMsg.text : "Speaking...";
  } else {
    displayCaption = lastUserMsg ? lastUserMsg.text : "Press Space to talk";
  }

  return (
    <div className={`voice-space-container ${showTranscript ? 'with-sidebar' : ''}`}>
      <header className="voice-space-header">
        <span className="header-title" style={{ color: 'white' }}>EDUAGENT // VOICE AGENT {context ? `// ${context.topic.toUpperCase()}` : ''}</span>
        <div className="header-controls">
          <div className="voice-status">{status}</div>
          <button
            className="icon-btn"
            onClick={() => setShowTranscript(!showTranscript)}
            title="Toggle Notes/Transcript"
          >
            {showTranscript ? <ChevronRight size={20} /> : <FileText size={20} />}
          </button>
        </div>
      </header>

      <div className="voice-content-wrapper">
        {/* Navigation Sidebar (Left) */}
        <div className="nav-sidebar">
          <h3>Module Map</h3>
          <ul className="nav-module-list">
            {context?.modulesList?.map((mod, idx) => (
              <li key={idx} className={`nav-module-item ${idx === context.currentIndex ? 'active' : ''} ${idx < context.currentIndex ? 'completed' : ''}`}>
                <div className="nav-status-dot"></div>
                <span>{mod.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="voice-main-display">
          <VoiceOrb status={status === 'THINKING' ? 'PROCESSING' : status} />

          <div className="voice-caption-area">
            {status === 'SPEAKING' || status === 'PROCESSING' || lastAiMsg ? (
              <div
                className="current-transcript markdown-content"
                dangerouslySetInnerHTML={{ __html: marked.parse(displayCaption) }}
              />
            ) : (
              <p className="current-transcript">{displayCaption}</p>
            )}
          </div>
        </div>

        {/* Transcript / Notes Sidebar */}
        <div className={`transcript-sidebar ${showTranscript ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3><Book size={18} /> Session Notes</h3>
          </div>
          <div className="sidebar-content">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-line ${msg.sender}`}>
                <strong>{msg.sender === 'ai' ? 'AI' : 'You'}:</strong>
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                />
              </div>
            ))}
            {messages.length === 0 && <p className="empty-notes">Conversation will appear here...</p>}
          </div>
        </div>
      </div>

      <footer className="voice-space-footer">
        <button
          className={`voice-btn ${mode === 'auto' ? 'active' : ''}`}
          onClick={() => {
            setMode('auto');
            stopAudio();
          }}
        >
          AUTO MODE
        </button>
        <button
          className={`voice-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => {
            setMode('manual');
            stopListening();
            stopAudio();
            setStatus('IDLE');
          }}
          onMouseDown={() => {
            if (mode === 'manual') {
              if (status === 'SPEAKING') stopAudio();
              if (status === 'IDLE' || status === 'SPEAKING') startListening();
            }
          }}
          onMouseUp={() => {
            if (mode === 'manual') stopListening();
          }}
          onMouseLeave={() => {
            if (mode === 'manual' && status === 'LISTENING') stopListening();
          }}
        >
          HOLD SPACE
        </button>
      </footer>
    </div>
  );
};

export default VoiceInput;
