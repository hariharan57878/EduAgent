import React, { createContext, useState, useContext, useEffect } from 'react';
import client, { enableDemoMode } from '../api/client';

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

  // Analytics & Retention State
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [trajectory, setTrajectory] = useState(null);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [weeklyReview, setWeeklyReview] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

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
            completedModules += p.modules.filter(m => m.status === 'completed' || m.completed).length;
          }
        });
        const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return {
          id: r._id,
          title: r.title,
          description: r.description,
          role: r.role,
          progress,
          modulesCount: totalModules,
          completedCount: completedModules,
          lastAccessed: new Date(r.updatedAt).toLocaleDateString(),
          phases: r.phases,
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format&fit=crop'
        };
      });
      setPaths(mappedPaths);
    } catch (err) {
      console.error("Failed to fetch paths", err);
    }
  };

  const fetchTrajectory = async () => {
    try {
      const res = await client.get('/steward/trajectory');
      setTrajectory(res.data);
    } catch (err) {
      console.error("Failed to fetch trajectory", err);
    }
  };

  const fetchWeeklyReview = async () => {
    try {
      const res = await client.get('/steward/weekly-review');
      if (res.data) setWeeklyReview(res.data);
    } catch (err) {
      console.error("Failed to fetch weekly review", err);
    }
  };

  useEffect(() => {
    fetchPaths();
    fetchTrajectory();
    fetchWeeklyReview();
  }, []);

  const startDemoMode = async () => {
    enableDemoMode();
    setIsDemoMode(true);

    // Immediately fetch mock user data
    try {
      const res = await client.get('/auth/me');
      setUser(res.data);

      // Re-fetch all other components with demo headers
      await Promise.all([
        fetchPaths(),
        fetchTrajectory(),
        fetchWeeklyReview()
      ]);
    } catch (err) {
      console.error("Demo Mode Initialization Failed", err);
    }
  };

  // Apply Theme Effect
  useEffect(() => {
    if (user.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user.theme]);

  const toggleInsights = () => setInsightsOpen(!insightsOpen);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addPath = (newPath) => {
    const finalId = newPath._id || Date.now();
    setPaths(prev => [
      {
        progress: 0,
        completedCount: 0,
        lastAccessed: 'Just now',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300&auto=format&fit=crop',
        ...newPath,
        id: finalId,
      },
      ...prev
    ]);
  };

  const deletePath = async (id) => {
    try {
      await client.delete(`/roadmaps/${id}`);
      setPaths(prev => prev.filter(path => path.id !== id));
    } catch (err) {
      console.error("Failed to delete path", err);
    }
  };

  const completeModule = async (pathId, phaseIdx, moduleIdx) => {
    try {
      // Optimistic Update
      setPaths(prev => {
        const newPaths = [...prev];
        const pathIndex = newPaths.findIndex(p => p.id === pathId);
        if (pathIndex !== -1) {
          const path = { ...newPaths[pathIndex] };
          const newPhases = [...path.phases];
          const phase = { ...newPhases[phaseIdx] };
          const newModules = [...phase.modules];
          const module = { ...newModules[moduleIdx] };

          module.status = 'completed';
          module.completedAt = new Date();

          newModules[moduleIdx] = module;
          phase.modules = newModules;
          newPhases[phaseIdx] = phase;
          path.phases = newPhases;

          // Re-calculate progress
          let total = 0;
          let completed = 0;
          path.phases.forEach(p => {
            total += p.modules.length;
            if (p.modules) {
              completed += p.modules.filter(m => m.status === 'completed' || m.completed).length;
            }
          });
          path.progress = Math.round((completed / total) * 100);
          path.completedCount = completed;

          newPaths[pathIndex] = path;
        }
        return newPaths;
      });

      // Server Sync
      const res = await client.patch(`/roadmaps/${pathId}/modules`, {
        phaseIdx,
        moduleIdx,
        status: 'completed'
      });

      // Handle Retention Signals
      if (res.data.milestones && res.data.milestones.length > 0) {
        setCurrentMilestone(res.data.milestones[0]);
      }

      // Recalculate trajectory on completion
      fetchTrajectory();
    } catch (err) {
      console.error("Failed to complete module", err);
    }
  };

  return (
    <AppContext.Provider value={{
      user, updateUser,
      paths, addPath, deletePath, completeModule,
      insightsOpen, toggleInsights, trajectory, fetchTrajectory,
      currentMilestone, setCurrentMilestone,
      weeklyReview, setWeeklyReview,
      isDemoMode, startDemoMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
