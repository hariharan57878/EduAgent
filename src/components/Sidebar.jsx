import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Waypoints, Mic, Users, Settings, LayoutGrid, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Waypoints, label: 'My Paths', path: '/create-module' },
    { icon: Mic, label: 'Voice Space', path: '/voice-space' },
    { icon: Users, label: 'Community', path: '/community' },
  ];

  return (
    <nav className="sidebar">
      <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">
          <LayoutGrid size={24} color="white" />
        </div>
      </div>

      <div className="nav-links">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={index}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="tooltip">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="nav-footer">
        <button className="nav-item" title="Settings" onClick={() => navigate('/settings')}>
          <Settings size={22} />
        </button>

        <div className="profile-wrapper" ref={menuRef}>
          <div className="user-avatar" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt="User" />
          </div>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-header">
                <span className="menu-name">{user.name}</span>
                <span className="menu-email">ID: {user.email}</span>
              </div>
              <div className="menu-divider"></div>
              <button className="menu-item logout">
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
