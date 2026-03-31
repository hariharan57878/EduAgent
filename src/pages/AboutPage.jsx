import React from 'react';
import { motion } from 'framer-motion';
import {
  XCircle,
  Layout,
  Edit,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const { startDemoMode } = useApp();

  const handleDemo = async () => {
    await startDemoMode();
    navigate('/');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">

        {/* --- HERO SECTION --- */}
        <section className="hero-section">
          <motion.div {...fadeInUp} className="hero-badge">EduAgent</motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-headline"
          >
            Stop starting. Start finishing.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtext"
          >
            A structured learning workspace that converts vague goals into actionable roadmaps and helps you stay consistent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-ctas"
          >
            <button className="btn-primary btn-large" onClick={handleDemo}>
              Try Live Demo
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/login')}>
              Create Account
            </button>
          </motion.div>
        </section>

        {/* --- THE PROBLEM --- */}
        <section className="problem-section">
          <div className="section-header">
            <h2 className="section-title">The Problem with Self-Learning</h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="problem-grid"
          >
            {[
              "Too much content, no structure",
              "Static roadmaps",
              "AI explains but doesn't manage",
              "Motivation drops"
            ].map((text, i) => (
              <motion.div key={i} variants={fadeInUp} className="premium-card problem-card">
                <XCircle size={20} className="problem-icon" />
                <span className="problem-text">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- THE SOLUTION --- */}
        <section className="solution-section">
          <div className="section-header">
            <h2 className="section-title">The Solution</h2>
            <p className="section-subtitle">
              EduAgent helps you turn goals into structured learning paths and stay consistent.
            </p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="solution-grid"
          >
            {[
              { title: "AI-generated roadmap", icon: <Layout />, desc: "Translates your goals into a day-by-day sequence of actionable learning chunks." },
              { title: "Editable learning path", icon: <Edit />, desc: "Adjust the roadmap dynamically as your understanding deepens." },
              { title: "Personal study workspace", icon: <Monitor />, desc: "A focused environment built specifically for learning and tracking real progress." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="premium-card solution-card">
                <div className="text-accent" style={{ marginBottom: '12px' }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- CLOSING SECTION --- */}
        <section className="closing-section">
          <div className="closing-text">
            EduAgent is not a content platform. <br />
            It is a system for finishing what you start.
          </div>
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <button className="btn-primary btn-large" onClick={handleDemo}>
              Try Live Demo
            </button>
            <button className="btn-secondary btn-large" onClick={() => navigate('/login')}>
              Create Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
