import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveTranscript.css';

const LiveTranscript = ({ isListening, transcript, setTranscript }) => {
  // Mock typing effect when listening
  useEffect(() => {
    let interval;
    if (isListening) {
      const phrases = [
        " I'm thinking about... ",
        "neural networks and how they mimic... ",
        "the human brain structure. ",
        "Specifically backpropagation... ",
        "and gradient descent optimization. "
      ];
      let phraseIndex = 0;

      interval = setInterval(() => {
        if (phraseIndex < phrases.length) {
          setTranscript(prev => prev + phrases[phraseIndex]);
          phraseIndex++;
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isListening, setTranscript]);

  return (
    <div className="transcript-container">
      <AnimatePresence>
        {(isListening || transcript) && (
          <motion.div
            className="transcript-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak and your thoughts will appear here..."
              className="transcript-editor"
              disabled={!transcript && !isListening}
            />
            {isListening && <div className="cursor-blink">|</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveTranscript;
