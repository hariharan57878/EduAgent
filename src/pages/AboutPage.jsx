import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Layout,
  Cpu,
  Activity,
  RefreshCcw,
  ShieldCheck,
  Code2,
  Database,
  Globe,
  Award
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

        {/* --- PART 1: HERO SECTION --- */}
        <section className="hero-section">
          <motion.div {...fadeInUp} className="hero-badge">EduAgent V2</motion.div>
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
            EduAgent is a structured learning workspace that converts vague career goals into
            executable roadmaps and protects momentum through AI-assisted execution management.
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

        {/* --- PART 2: THE PROBLEM --- */}
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
              "Too much content, no structure.",
              "Static roadmaps don't adapt.",
              "AI chats explain, but don't manage.",
              "Motivation collapses after a few days."
            ].map((text, i) => (
              <motion.div key={i} variants={fadeInUp} className="premium-card problem-card">
                <XCircle size={20} className="problem-icon" />
                <span className="problem-text">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- PART 3: THE APPROACH --- */}
        <section className="approach-section">
          <div className="section-header">
            <h2 className="section-title">How EduAgent Solves It</h2>
            <p className="section-subtitle">Our 4 core pillars for execution</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="approach-grid"
          >
            {[
              { title: "Roadmap Engine", icon: <Layout />, desc: "Generates non-linear, adaptive learning paths based on current skills and goal gaps." },
              { title: "Execution Workspace", icon: <Zap />, desc: "A focused environment for daily progress, shifting focus from content to completion." },
              { title: "Proactive Steward AI", icon: <Cpu />, desc: "An autonomous agent that monitors blockers and provides just-in-time intervention." },
              { title: "Habit System", icon: <Activity />, desc: "Momentum tracking and recovery modes designed to keep your streak alive." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="premium-card approach-card">
                <div className="text-accent" style={{ marginBottom: '12px' }}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* --- PART 4: ARCHITECTURE --- */}
        <section className="architecture-section">
          <div className="section-header">
            <h2 className="section-title">Architecture Overview</h2>
          </div>
          <div className="architecture-diagram">
            {['User', 'React UI', 'Express API', 'Service Layer', 'AI Providers', 'MongoDB', 'Steward Engine', 'Analytics', 'Retention'].map((node, i, arr) => (
              <React.Fragment key={node}>
                <div className={`diag-node ${['User', 'React UI', 'Steward Engine'].includes(node) ? 'active' : ''}`}>
                  {node}
                </div>
                {i < arr.length - 1 && <ArrowRight size={14} className="diag-arrow" />}
              </React.Fragment>
            ))}
          </div>
          <div className="architecture-bullets">
            {[
              { title: "Clean Separation", desc: "Strict boundary between UI, logic, and external AI providers." },
              { title: "AI Provider Isolation", desc: "Hot-swappable layer for Gemini, Groq, and OpenAI models." },
              { title: "Atomic Onboarding", desc: "Goal extraction occurs before a single line of code is written." },
              { title: "Deterministic Logic", desc: "Momentum scoring follows a rigid mathematical framework." },
              { title: "Demo Mode Isolation", desc: "Mock storage layer prevents demo data from hitting production." }
            ].map((item, i) => (
              <div key={i} className="arch-item">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- PART 5: FEATURE STACK --- */}
        <section className="feature-section">
          <div className="section-header">
            <h2 className="section-title">Feature Stack</h2>
          </div>
          <div className="feature-grid">
            {[
              { title: "Guided Wizard", desc: "Multi-step intent extraction to define your north star." },
              { title: "Today's Focus", desc: "Daily dashboard prioritizing the next executable action." },
              { title: "Momentum Analytics", desc: "Visual feedback on consistency and learning velocity." },
              { title: "Recovery Mode", desc: "AI-intervention when burnout or stalling is detected." },
              { title: "Weekly Review", desc: "Automated synthesis of accomplishments and blockers." },
              { title: "Demo Mode", desc: "Instant accessibility without friction or signup." }
            ].map((item, i) => (
              <div key={i} className="premium-card feature-item">
                <div className="text-accent" style={{ marginBottom: '4px' }}><CheckCircle2 size={16} /></div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- PART 6: TECH STACK --- */}
        <section className="tech-section">
          <div className="section-header">
            <h2 className="section-title">Tech Stack</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-group">
              <h3>Frontend</h3>
              <ul className="tech-list">
                <li>React 19 & Vite</li>
                <li>Context API (State)</li>
                <li>Framer Motion</li>
                <li>Lucide Icons</li>
              </ul>
            </div>
            <div className="tech-group">
              <h3>Backend</h3>
              <ul className="tech-list">
                <li>Node.js & Express</li>
                <li>MongoDB (Atlas)</li>
                <li>Clean Architecture</li>
                <li>JWT Security</li>
              </ul>
            </div>
            <div className="tech-group">
              <h3>Intelligence</h3>
              <ul className="tech-list">
                <li>Gemini / Groq LLMs</li>
                <li>AI Provider Isolation</li>
                <li>Semantic Analysis</li>
              </ul>
            </div>
            <div className="tech-group">
              <h3>Infrastructure</h3>
              <ul className="tech-list">
                <li>DTO Validation</li>
                <li>Middleware Isolation</li>
                <li>Demo Simulation Layer</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- PART 7: DIFFERENTIATION --- */}
        <section className="diff-section">
          <div className="section-header">
            <h2 className="section-title">What Makes EduAgent Different</h2>
          </div>
          <div className="diff-content">
            <table className="diff-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Learning</th>
                  <th>EduAgent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="diff-label">Focus</td>
                  <td className="diff-val">Content Consumption</td>
                  <td className="diff-val highlight">Execution & Completion</td>
                </tr>
                <tr>
                  <td className="diff-label">Roadmaps</td>
                  <td className="diff-val">Static / Templated</td>
                  <td className="diff-val highlight">Dynamic / AI-Powered</td>
                </tr>
                <tr>
                  <td className="diff-label">Support</td>
                  <td className="diff-val">Reactive (FAQ)</td>
                  <td className="diff-val highlight">Proactive (Steward AI)</td>
                </tr>
                <tr>
                  <td className="diff-label">Analytic</td>
                  <td className="diff-val">Generic progress bars</td>
                  <td className="diff-val highlight">Momentum & Velocity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --- PART 8: CLOSING --- */}
        <section className="closing-section">
          <div className="closing-text">
            EduAgent is not a content platform. <br />
            It is a system for finishing what you start.
          </div>
          <button className="btn-primary btn-large" onClick={handleDemo}>
            Try Live Demo
          </button>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
