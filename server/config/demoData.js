export const MOCK_DEMO_USER = {
  _id: 'demo_user_123',
  name: 'Demo Explorer',
  email: 'demo@eduagent.ai',
  onboarded: true,
  preferences: {
    experienceLevel: 'beginner',
    weeklyAvailability: 5,
    primaryGoals: ['Backend Development', 'System Architecture'],
  },
  stats: {
    currentStreak: 7,
    longestStreak: 14,
    level: 12,
    xp: 4500,
    dailyCompletionCount: 1,
    lastCompletionDate: new Date().toISOString(),
    weeklyStats: {
      modulesCompleted: 3,
      timeInvested: 12,
      lastReviewDate: new Date().toISOString()
    }
  }
};

export const MOCK_DEMO_ROADMAP = {
  _id: 'demo_roadmap_123',
  userId: 'demo_user_123',
  title: 'Fullstack Web Architect',
  description: 'Master the art of building scalable web applications from frontend to backend.',
  phases: [
    {
      _id: 'phase_1',
      title: 'Phase 1: Foundation & Frontend',
      description: 'Core concepts of web development and UI/UX.',
      order: 1,
      modules: [
        {
          _id: 'mod_1',
          title: 'Advanced HTML & Semantic Web',
          objective: 'Learn accessibility and proper document structure.',
          status: 'completed',
          estimatedEffort: 2,
          timeSpent: 2
        },
        {
          _id: 'mod_2',
          title: 'CSS Architecture & Layouts',
          objective: 'Master Flexbox, Grid, and CSS Variables.',
          status: 'completed',
          estimatedEffort: 4,
          timeSpent: 5
        }
      ]
    },
    {
      _id: 'phase_2',
      title: 'Phase 2: Backend Mastery',
      description: 'Building robust server-side applications.',
      order: 2,
      modules: [
        {
          _id: 'mod_3',
          title: 'Node.js & Express Fundamentals',
          objective: 'Understand event loops and building REST APIs.',
          status: 'in_progress',
          estimatedEffort: 6,
          timeSpent: 2
        },
        {
          _id: 'mod_4',
          title: 'Database Design & Modeling',
          objective: 'Learn SQL and NoSQL design patterns.',
          status: 'todo',
          estimatedEffort: 8,
          timeSpent: 0
        }
      ]
    },
    {
      _id: 'phase_3',
      title: 'Phase 3: Architecture & Scale',
      description: 'Advanced patterns and cloud deployment.',
      order: 3,
      modules: [
        {
          _id: 'mod_5',
          title: 'Microservices & Distributed Systems',
          objective: 'Learn how to split monolithic apps.',
          status: 'todo',
          estimatedEffort: 10,
          timeSpent: 0
        }
      ]
    }
  ]
};

export const MOCK_DEMO_TRAJECTORY = {
  weeklyCompletionRate: 3,
  remainingModules: 24,
  estimatedWeeksToFinish: 6,
  momentumState: 'STABLE'
};

export const MOCK_DEMO_FOCUS = {
  type: 'EXECUTION',
  module: {
    _id: 'mod_3',
    title: 'Node.js & Express Fundamentals',
    objective: 'Understand event loops and building REST APIs.',
    estimatedEffort: 6
  },
  rationale: 'This is the core pillar of your backend journey. Completing this will unlock database integration.',
  milestoneSignal: null
};

export const MOCK_DEMO_STEWARD_DATA = {
  summary: 'You are on a 7-day streak! Completion velocity is recovering after a slow start.',
  suggestions: [
    {
      id: 's1',
      type: 'motivation',
      priority: 'high',
      message: 'You have completed 40% of Phase 1. One more module for a new level!',
      actionHint: 'Complete Node.js Fundamentals'
    },
    {
      id: 's2',
      type: 'insight',
      priority: 'medium',
      message: 'You spend 20% more time on CSS than estimated. Consider focusing on styling patterns.',
      actionHint: 'View Time Analytics'
    }
  ],
  score: 85
};

export const MOCK_WEEKLY_REVIEW = {
  modulesCompleted: 3,
  timeInvested: 12,
  velocityTrend: 'IMPROVING',
  projection: 'On track for October 2026 finish',
  highlights: [
    'Maintained a perfect 7-day streak',
    'Finished Phase 1 Foundations',
    'Invested 4 hours more than last week'
  ]
};
