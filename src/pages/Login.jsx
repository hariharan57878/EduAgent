import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const { startDemoMode } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    interests: []
  });

  const [error, setError] = useState('');

  const availableInterests = ['Web Development', 'AI/ML', 'Data Science', 'Mobile App', 'Game Dev', 'Cybersecurity'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let res;
    if (isLogin) {
      res = await login(formData.email, formData.password);
    } else {
      res = await register(formData.username, formData.email, formData.password, { interests: formData.interests });
    }

    if (res && res.success) {
      if (isLogin) {
        navigate('/');
      } else {
        // TODO: Ensure Goal Setup Page is implemented properly later
        navigate('/goal-setup');
      }
    } else {
      setError(res?.message || 'Authentication failed');
    }
  };

  const handleDemo = async () => {
    await startDemoMode();
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-logo">EduAgent</h1>
        <p className="login-subtitle">
          {isLogin
            ? 'Access your learning workspace and continue your progress.'
            : 'Create your account to start building your learning system.'}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="How should we call you?"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group interests-section">
              <label>Areas of Interest (Optional)</label>
              <div className="interests-grid">
                {availableInterests.map(tag => (
                  <div
                    key={tag}
                    className={`interest-tag ${formData.interests.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleInterest(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="login-btn">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="demo-separator">
          <span>OR</span>
        </div>

        <button className="demo-btn" onClick={handleDemo}>
          Try Live Demo
        </button>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>

        <div className="about-link" onClick={() => navigate('/about')} style={{
          marginTop: '1.5rem',
          fontSize: 'var(--fs-small)',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          textAlign: 'center',
          textDecoration: 'underline'
        }}>
          About EduAgent
        </div>
      </div>
    </div>
  );
};

export default Login;
