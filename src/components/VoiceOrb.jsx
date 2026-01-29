import React from 'react';
import './VoiceOrb.css';

const VoiceOrb = ({ status }) => {
  // Normalize status to lowercase for class mapping
  const normalizedStatus = status ? status.toLowerCase() : 'idle';

  // Decide active class based on state
  let orbClass = 'idle';
  if (normalizedStatus.includes('listen') || normalizedStatus.includes('record')) {
    orbClass = 'listening';
  } else if (normalizedStatus.includes('speak') || normalizedStatus.includes('talk')) {
    orbClass = 'speaking';
  } else if (normalizedStatus.includes('process') || normalizedStatus.includes('think')) {
    orbClass = 'processing';
  }

  return (
    <div className={`voice-orb-container ${orbClass}`}>
      <div className="orb-ring"></div>
      <div className="orb-ring"></div>
      <div className="orb-ring"></div>
      <div className={`voice-orb ${orbClass}`}></div>
    </div>
  );
};

export default VoiceOrb;
