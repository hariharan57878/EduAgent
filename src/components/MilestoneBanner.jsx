import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, Target, Star } from 'lucide-react';
import './MilestoneBanner.css';

const MilestoneBanner = ({ milestone, onDismiss }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const config = {
      '7_DAY_STREAK': {
        icon: <Zap className="milestone-icon streak" />,
        title: '7 Day Streak!',
        message: "You're building a powerful learning habit. Keep the momentum!",
      },
      '30_DAY_STREAK': {
        icon: <Zap className="milestone-icon streak-gold" />,
        title: '30 Day Legend!',
        message: 'Mastery is the result of consistency. Incredible work.',
      },
      '25_PERCENT': {
        icon: <Target className="milestone-icon progress" />,
        title: '25% Completed',
        message: "You're one-quarter of the way to your goal. Stay focused!",
      },
      '50_PERCENT': {
        icon: <Target className="milestone-icon progress-half" />,
        title: 'Halfway There!',
        message: "You've crossed the 50% mark. The hardest part is behind you.",
      },
      '100_PERCENT': {
        icon: <Award className="milestone-icon mastery" />,
        title: 'Roadmap Mastered!',
        message: "Congratulations! You've achieved your goal. Ready for the next one?",
      }
    };

    if (milestone && config[milestone]) {
      setData(config[milestone]);
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [milestone, onDismiss]);

  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="milestone-banner-overlay"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 20, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
      >
        <div className="milestone-banner-content">
          <div className="icon-wrapper">
            {data.icon}
          </div>
          <div className="banner-text">
            <h4>{data.title}</h4>
            <p>{data.message}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MilestoneBanner;
