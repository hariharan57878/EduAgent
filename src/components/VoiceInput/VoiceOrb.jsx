import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceOrb.css';

const VoiceOrb = ({ isListening, onClick }) => {
  return (
    <div className="voice-orb-container">
      <motion.div
        className={`voice-orb ${isListening ? 'listening' : 'idle'}`}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 20px rgba(99, 102, 241, 0.3)",
            "0 0 60px rgba(99, 102, 241, 0.6)",
            "0 0 20px rgba(99, 102, 241, 0.3)"
          ]
        } : {
          scale: 1,
          boxShadow: "0 0 30px rgba(99, 102, 241, 0.2)"
        }}
        transition={isListening ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : { duration: 0.5 }}
      >
        <div className="orb-core"></div>
        {isListening && <div className="orb-ripple"></div>}
      </motion.div>
    </div>
  );
};

export default VoiceOrb;
