import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IntentHint.css';

const IntentHint = ({ isListening }) => {
  const hints = [
    "Explain this topic like I’m new...",
    "I want to understand logically...",
    "I’m confused about...",
    "What is the connection between...",
    "Just thinking aloud..."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isListening) return; // Stop rotation when listening
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % hints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isListening]);

  if (isListening) return <div className="hint-spacer"></div>;

  return (
    <div className="intent-hint-container">
      <AnimatePresence mode='wait'>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="hint-text"
        >
          {hints[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default IntentHint;
