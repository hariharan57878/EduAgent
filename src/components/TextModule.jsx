import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import client from '../api/client';
import './TextModule.css';

const TextModule = () => {
  const { addPath } = useApp();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm your learning architect. What topic do you want to master today? (e.g., Python, History, Astrophysics)" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0); // 0: Topic, 1: Level Check, 2: Done
  const [topic, setTopic] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleStartLearning = async (roadmapData) => {
    try {
      // Ensure roadmapData matches Schema
      const savedRoadmap = await client.post('/roadmaps', roadmapData);
      // Note: modify addPath to maybe accept the ID or just refetch in Dashboard
      addPath(savedRoadmap.data); // Update local context
      navigate('/');
    } catch (err) {
      console.error("Failed to save roadmap", err);
    }
  };

  // State to hold user inputs for AI context
  const [preferences, setPreferences] = useState({ topic: '', level: '', goal: '' });

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Context Accumulation
    let updatedPreferences = { ...preferences };
    let prompt = "";

    if (step === 0) {
      updatedPreferences.topic = userMsg.text;
      setPreferences(updatedPreferences);
      setTopic(userMsg.text);
      prompt = `That's an excellent choice! To help me tailor the "**${userMsg.text}**" roadmap for you, could you tell me your current experience level? (e.g., Absolute Beginner, Intermediate, or looking to specialize?)`;

      simulateResponse(prompt, 1);

    } else if (step === 1) {
      updatedPreferences.level = userMsg.text;
      setPreferences(updatedPreferences);
      prompt = "Got it. Do you have any specific focus areas or goals for this journey? (e.g., 'Focus on practical projects', 'Prepare for an interview', or 'Just casual learning')";

      simulateResponse(prompt, 2);

    } else if (step === 2) {
      updatedPreferences.goal = userMsg.text;
      setPreferences(updatedPreferences);

      // Trigger AI Generation
      try {
        // Notify user we are working
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Perfect. I'm analyzing your requirements and structuring the optimal learning path now... This might take a moment." }]);

        const response = await client.post('/agent/generate-roadmap', {
          role: updatedPreferences.topic,
          interests: [updatedPreferences.level, updatedPreferences.goal]
        });

        const roadmapData = response.data;

        // Save to DB immediately or let user save?
        // For now, we display it. The backend 'save' happens if we want to persist it.
        // Actually, let's auto-save it to user's profile API if needed, 
        // but our current API endpoint /generate-roadmap just returns JSON.
        // Let's call /roadmaps POST to save it IF the user accepts.

        const roadmapMsg = {
          id: Date.now() + 10,
          sender: 'ai',
          text: "Here is the custom roadmap I've architected for you. Does this look good to start?",
          hasRoadmap: true,
          roadmapData: roadmapData // Backend returns full roadmap structure
        };

        setMessages(prev => [...prev, roadmapMsg]);
        setIsTyping(false);
        setStep(3);

      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "I encountered an error generating your roadmap. Please try again." }]);
        setIsTyping(false);
      }
    } else {
      // Chat mode (future enhancement: connect to /agent/chat)
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "You can start learning now! I've saved your preferences." }]);
      setIsTyping(false);
    }
  };

  const simulateResponse = (text, nextStep) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text }]);
      setStep(nextStep);
      setIsTyping(false);
    }, 1000);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="text-module-container">
      <div className="chat-header">
        <div className="ai-avatar">
          <Bot size={20} />
        </div>
        <h3>AI Learning Assistant</h3>
        <span>Online</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
            {msg.hasRoadmap && (
              <div className="roadmap-preview">
                <h4><Sparkles size={16} /> Roadmap Generated</h4>
                <ul className="roadmap-steps">
                  {msg.roadmapData.phases.map((phase, idx) => (
                    <li key={idx}>
                      <CheckCircle size={14} color="#10b981" /> Phase {idx + 1}: {typeof phase === 'object' ? phase.title : phase}
                    </li>
                  ))}
                </ul>
                <div className="generated-actions">
                  <button
                    className="action-btn primary-action"
                    onClick={() => handleStartLearning(msg.roadmapData)}
                  >
                    Start Learning
                  </button>
                  <button className="action-btn secondary-action">Edit Path</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your answer..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default TextModule;
