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

    // Dynamic AI Interaction
    try {
      // Step 0: User provides Topic -> AI asks for Level
      if (step === 0) {
        updatedPreferences.topic = userMsg.text;
        setPreferences(updatedPreferences);
        setTopic(userMsg.text);

        // Ask AI to generate the next question
        const response = await client.post('/agent/chat', {
          message: `User selected topic: ${userMsg.text}. Ask them about their experience level (Beginner/Intermediate/Advanced) in a friendly way.`,
          context: { role: "Architect", task: "Intake" }
        });

        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response.data.reply }]);
        setStep(1);
      }

      // Step 1: User provides Level -> AI asks for Goal
      else if (step === 1) {
        updatedPreferences.level = userMsg.text;
        setPreferences(updatedPreferences);

        const response = await client.post('/agent/chat', {
          message: `User is ${userMsg.text} in ${updatedPreferences.topic}. Ask them about their specific goal or project idea.`,
          context: { role: "Architect", task: "Intake", topic: updatedPreferences.topic }
        });

        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response.data.reply }]);
        setStep(2);
      }

      // Step 2: User provides Goal -> AI confirms and Generates Roadmap
      else if (step === 2) {
        updatedPreferences.goal = userMsg.text;
        setPreferences(updatedPreferences);

        // Notify user
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Understood. I'm designing your custom curriculum now..." }]);

        // Call Generate Roadmap
        const response = await client.post('/agent/generate-roadmap', {
          role: updatedPreferences.topic,
          interests: [updatedPreferences.level, updatedPreferences.goal]
        });

        const roadmapData = response.data;

        const roadmapMsg = {
          id: Date.now() + 10,
          sender: 'ai',
          text: `Here is the ${roadmapData.title}. Ready to begin?`,
          hasRoadmap: true,
          roadmapData: roadmapData
        };

        setMessages(prev => [...prev, roadmapMsg]);
        setStep(3);
      }
      // General Chat after roadmap
      else {
        const response = await client.post('/agent/chat', {
          message: userMsg.text,
          context: { role: "Architect", currentRoadmap: topic }
        });
        setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response.data.reply }]);
      }

      setIsTyping(false);

    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "I'm having trouble connecting to my brain. Please try again." }]);
      setIsTyping(false);
    }
  };

  // Removed static simulateResponse function


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
