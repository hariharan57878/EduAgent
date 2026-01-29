import React, { createContext, useState, useContext, useEffect } from 'react';
import client from '../api/client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User State
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    bio: 'AI enthusiast and lifelong learner.',
    notifications: {
      daily: true,
      friends: true,
      updates: false,
    },
    theme: 'system'
  });

  // Learning Paths State
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await client.get('/roadmaps');
        const mappedPaths = res.data.map(r => {
          // Calculate stats
          let totalModules = 0;
          let completedModules = 0;
          r.phases.forEach(p => {
            if (p.modules) {
              totalModules += p.modules.length;
              completedModules += p.modules.filter(m => m.completed).length;
            }
          });
          const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

          return {
            id: r._id,
            title: r.title,
            description: r.description,
            role: r.role,
            progress,
            modules: totalModules,
            completed: completedModules,
            lastAccessed: new Date(r.updatedAt).toLocaleDateString(),
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format&fit=crop' // Placeholder or stored
          };
        });
        setPaths(mappedPaths);
      } catch (err) {
        console.error("Failed to fetch paths", err);
      }
    };

    fetchPaths();
  }, []);

  // Apply Theme Effect
  useEffect(() => {
    if (user.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user.theme]);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addPath = (newPath) => {
    setPaths(prev => [
      {
        id: Date.now(),
        progress: 0,
        completed: 0,
        lastAccessed: 'Just now',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format&fit=crop', // Default image
        ...newPath
      },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider value={{ user, updateUser, paths, addPath }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
