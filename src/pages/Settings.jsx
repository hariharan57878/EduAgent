import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Smartphone, Globe, Moon, Monitor } from 'lucide-react';
import './Settings.css';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const { user, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  // Local state for form handling
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = () => {
    updateUser(formData);
    // Ideally show a toast here
    alert("Profile updated!");
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and app settings.</p>
      </div>

      <div className="settings-grid">
        {/* Navigation Sidebar */}
        <div className="settings-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section glass-card">
              <div className="section-title">Profile Information</div>

              <div className="profile-preview">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="profile-avatar-large"
                />
                <div className="profile-actions">
                  <button className="btn-secondary">Change Photo</button>
                  <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>Remove</button>
                </div>
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section glass-card">
              <div className="section-title">Notification Preferences</div>

              <div className="setting-row">
                <div className="form-group">
                  <label>Daily Reminders</label>
                  <div className="description">Receive a nudge to keep your streak alive.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="form-group">
                  <label>Friend Activity</label>
                  <div className="description">When friends join a new path or achieve a milestone.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="form-group">
                  <label>Community Updates</label>
                  <div className="description">Weekly summary of top community channels.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section glass-card">
              <div className="section-title">Appearance</div>

              <div className="form-group">
                <label>Theme</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <div
                    onClick={() => updateUser({ theme: 'system' })}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${user.theme === 'system' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                      background: user.theme === 'system' ? 'var(--accent-soft)' : 'var(--bg-card)',
                      transition: 'all 0.2s',
                      flex: 1
                    }}
                  >
                    <Monitor size={24} className={user.theme === 'system' ? 'text-accent' : ''} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Light / System</span>
                  </div>
                  <div
                    onClick={() => updateUser({ theme: 'dark' })}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${user.theme === 'dark' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                      background: user.theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                      transition: 'all 0.2s',
                      flex: 1
                    }}
                  >
                    <Moon size={24} className={user.theme === 'dark' ? 'text-accent' : ''} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Dark Mode</span>
                  </div>
                </div>
              </div>

              <div className="setting-row">
                <div className="form-group">
                  <label>Reduced Motion</label>
                  <div className="description">Minimize UI animations for accessibility.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section glass-card">
              <div className="section-title">Security</div>

              <div className="form-group">
                <label>Password</label>
                <button className="btn-secondary" style={{ width: 'fit-content' }}>Change Password</button>
              </div>

              <div className="setting-row">
                <div className="form-group">
                  <label>Two-Factor Authentication</label>
                  <div className="description">Add an extra layer of security to your account.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #fee2e2' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h4>
                <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
