import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Steward Engine Logic
 */

export const analyzeWorkspace = async (userId) => {
  const roadmaps = await Roadmap.find({ userId, status: 'active' });
  const suggestions = [];

  for (const roadmap of roadmaps) {
    const roadmapSuggestions = await processRoadmapRules(roadmap);
    suggestions.push(...roadmapSuggestions);
  }

  return suggestions;
};

const processRoadmapRules = async (roadmap) => {
  const suggestions = [];
  const now = new Date();

  // Rule 1: Inactivity Detection
  const lastUpdate = new Date(roadmap.updatedAt);
  const daysInactive = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

  if (daysInactive >= 3) {
    suggestions.push({
      type: 'INACTIVITY',
      priority: 'high',
      message: `You haven't made progress on "${roadmap.title}" for ${daysInactive} days.`,
      action: 'Suggest a 15-minute micro-task to regain momentum.'
    });
  }

  // Flatten modules for analysis
  const allModules = roadmap.phases.flatMap(p => p.modules);
  const inProgressModules = allModules.filter(m => m.status === 'in-progress');
  const completedModules = allModules.filter(m => m.status === 'completed');

  // Rule 2: Overload Detection
  if (inProgressModules.length > 3) {
    suggestions.push({
      type: 'OVERLOAD',
      priority: 'medium',
      message: `You have ${inProgressModules.length} modules in progress. Finishing one will clear your roadmap.`,
      action: 'Focus on completing "' + inProgressModules[0].title + '" first.'
    });
  }

  // Rule 3: Completion Acceleration
  const totalModules = allModules.length;
  if (totalModules > 0 && completedModules.length / totalModules >= 0.8 && completedModules.length < totalModules) {
    suggestions.push({
      type: 'COMPLETION_ACCELERATION',
      priority: 'high',
      message: `You are 80% through "${roadmap.title}"! Finish strong.`,
      action: 'Complete the final modules to master this skill.'
    });
  }

  return suggestions;
};

/**
 * NEW: Today's Focus Logic
 * Deterministic priority to reduce decision fatigue.
 */
export const generateTodayFocus = async (userId) => {
  const roadmap = await Roadmap.findOne({ userId, status: 'active' }).sort({ updatedAt: -1 });
  if (!roadmap) return null;

  const now = new Date();
  const lastUpdate = new Date(roadmap.updatedAt);
  const daysInactive = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

  // 0. Recovery Override (Inactivity >= 5 days)
  if (daysInactive >= 5) {
    return await generateRecoveryFocus(userId, roadmap);
  }

  let focusModule = null;
  let reason = "";
  let confidence = 0.5;

  // Flatten with indices for frontend navigation
  const allModules = roadmap.phases.flatMap((p, pIdx) =>
    p.modules.map((m, mIdx) => ({
      ...m.toObject(),
      phaseIdx: pIdx,
      moduleIdx: mIdx
    }))
  );

  const inProgress = allModules.filter(m => m.status === 'in-progress');
  const incomplete = allModules.filter(m => m.status !== 'completed');

  if (incomplete.length === 0) {
    return { type: 'COMPLETED', title: "Roadmap Mastered!", reason: "You've finished everything. Ready for a new challenge?" };
  }

  // 1. Overload/In-Progress Priority
  if (inProgress.length > 0) {
    focusModule = inProgress[0];
    reason = "Finish what you started to maintain cognitive flow.";
    confidence = 0.95;
  }

  // 2. Inactivity Recovery (Smallest win)
  if (!focusModule && daysInactive >= 3) {
    focusModule = incomplete.sort((a, b) => (a.estimatedEffort || 30) - (b.estimatedEffort || 30))[0];
    reason = "Restart your momentum with this quick low-effort module.";
    confidence = 0.9;
  }

  // 3. Phase Completion (Nearing 80%+)
  if (!focusModule) {
    for (let i = 0; i < roadmap.phases.length; i++) {
      const phase = roadmap.phases[i];
      const mTotal = phase.modules.length;
      const mDone = phase.modules.filter(m => m.status === 'completed').length;
      if (mTotal > 0 && mDone / mTotal >= 0.8 && mDone < mTotal) {
        const nextInPhase = phase.modules.find(m => m.status !== 'completed');
        focusModule = {
          ...nextInPhase.toObject(),
          phaseIdx: i,
          moduleIdx: phase.modules.indexOf(nextInPhase)
        };
        reason = `Complete this to finish the "${phase.title}" phase!`;
        confidence = 0.85;
        break;
      }
    }
  }

  // 4. Default Sequential Next
  if (!focusModule) {
    focusModule = incomplete[0];
    reason = "The logical next step to advance your career path.";
    confidence = 0.8;
  }

  return {
    type: "FOCUS",
    moduleId: focusModule._id,
    phaseIdx: focusModule.phaseIdx,
    moduleIdx: focusModule.moduleIdx,
    title: focusModule.title,
    estimatedTime: focusModule.estimatedEffort || focusModule.estimatedTime || 30,
    reason,
    confidenceScore: confidence
  };
};

/**
 * RECOVERY Mode Logic
 */
export const generateRecoveryFocus = async (userId, roadmap) => {
  if (!roadmap) {
    roadmap = await Roadmap.findOne({ userId, status: 'active' }).sort({ updatedAt: -1 });
  }
  if (!roadmap) return null;

  const allModules = roadmap.phases.flatMap((p, pIdx) =>
    p.modules.map((m, mIdx) => ({
      ...m.toObject(),
      phaseIdx: pIdx,
      moduleIdx: mIdx
    }))
  );

  const incomplete = allModules.filter(m => m.status !== 'completed');
  if (incomplete.length === 0) return null;

  // Smallest win: sort by effort
  const smallestModule = incomplete.sort((a, b) => (a.estimatedEffort || 30) - (b.estimatedEffort || 30))[0];

  return {
    type: "RECOVERY",
    moduleId: smallestModule._id,
    phaseIdx: smallestModule.phaseIdx,
    moduleIdx: smallestModule.moduleIdx,
    title: smallestModule.title,
    estimatedTime: smallestModule.estimatedEffort || 10,
    message: "Welcome Back! Let's restart your momentum with a small win."
  };
};

/**
 * NEW: Trajectory & Momentum Analytics
 */
export const generateTrajectorySummary = async (userId) => {
  const roadmaps = await Roadmap.find({ userId, status: 'active' });
  const user = await User.findById(userId);

  if (!roadmaps.length) {
    return {
      weeklyCompletionRate: 0,
      remainingModules: 0,
      estimatedWeeksToFinish: 0,
      momentumState: 'STABLE',
      history: [],
      stats: { estimatedEffort: 0, actualTime: 0 }
    };
  }

  const allModules = roadmaps.flatMap(r => r.phases.flatMap(p => p.modules));
  const completedModules = allModules.filter(m => m.status === 'completed');
  const remainingModules = allModules.filter(m => m.status !== 'completed');

  // Calculate weekly rate
  const now = new Date();
  const last7DaysComp = completedModules.filter(m => {
    const compDate = new Date(m.completedAt || now);
    return (now - compDate) <= (7 * 1000 * 60 * 60 * 24);
  }).length;

  const prev7DaysComp = completedModules.filter(m => {
    const compDate = new Date(m.completedAt || now);
    const diff = (now - compDate) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 14;
  }).length;

  const weeklyCompletionRate = last7DaysComp || 1;
  const estimatedWeeksToFinish = Math.ceil(remainingModules.length / weeklyCompletionRate);

  // Momentum State Upgrade (ACTIVE, AT_RISK, BROKEN)
  let momentumState = "STABLE";
  const lastCompDate = user?.stats?.lastCompletionDate ? new Date(user.stats.lastCompletionDate) : null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastCompDay = lastCompDate ? new Date(lastCompDate.getFullYear(), lastCompDate.getMonth(), lastCompDate.getDate()) : null;

  const diffDays = lastCompDay ? Math.floor((today - lastCompDay) / (1000 * 60 * 60 * 24)) : 999;

  if (user?.stats?.dailyCompletionCount >= 1 && diffDays === 0) {
    momentumState = "ACTIVE";
  } else if (diffDays <= 1) {
    momentumState = "AT_RISK";
  } else {
    momentumState = "BROKEN";
  }

  // History for chart
  const history = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const count = completedModules.filter(m => {
      const d = new Date(m.completedAt);
      return d >= start && d < end;
    }).length;
    history.push({ week: `Week ${4 - i}`, count });
  }

  const estimatedEffortTotal = completedModules.reduce((acc, m) => acc + (m.estimatedEffort || 30), 0);
  const actualTimeTotal = completedModules.reduce((acc, m) => acc + (m.timeSpent || 0), 0);
  const velocityTrend = last7DaysComp >= prev7DaysComp ? 'IMPROVING' : 'DECLINING';

  return {
    weeklyCompletionRate: last7DaysComp,
    remainingModules: remainingModules.length,
    estimatedWeeksToFinish,
    momentumState,
    history,
    velocityTrend,
    projectedFinishDate: new Date(now.getTime() + estimatedWeeksToFinish * 7 * 24 * 60 * 60 * 1000),
    stats: {
      estimatedEffort: estimatedEffortTotal,
      actualTime: actualTimeTotal
    }
  };
};

/**
 * Weekly Review Ritual
 */
export const generateWeeklyReview = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const stats = user.stats.weeklyStats || {};
  const now = new Date();

  const lastReview = stats.lastReviewDate ? new Date(stats.lastReviewDate) : null;
  const isNewWeek = !lastReview || (now - lastReview) > (6 * 1000 * 60 * 60 * 24); // ~6 days to be safe

  if (!isNewWeek) return null;

  const trajectory = await generateTrajectorySummary(userId);

  const review = {
    modulesCompleted: stats.modulesCompleted || 0,
    timeInvested: stats.timeInvested || 0,
    velocityTrend: trajectory.velocityTrend,
    projection: `${trajectory.estimatedWeeksToFinish} weeks remaining`
  };

  // Reset weekly stats
  user.stats.weeklyStats.modulesCompleted = 0;
  user.stats.weeklyStats.timeInvested = 0;
  user.stats.weeklyStats.lastReviewDate = now;
  await user.save();

  return review;
};
