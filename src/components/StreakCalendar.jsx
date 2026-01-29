import React, { useState } from "react";
import { Flame, Star, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./StreakCalendar.css";

const StreakCalendar = ({ currentStreak = 0 }) => {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Mock data generation for a month
  const [calendarDays] = useState(() => {
    const days = [];
    // Start padding
    for (let i = 0; i < 2; i++) days.push({ type: 'padding', id: `pad-${i}` });

    // 30 Days
    for (let i = 1; i <= 30; i++) {
      let level = 0;
      if (i < 20) { // Past days simulated
        level = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
      } else if (i === 20) { // Today
        level = 2;
      }

      days.push({
        day: i,
        level, // 0: none, 1: low, 2: med, 3: high
        isToday: i === 20,
        id: `day-${i}`
      });
    }
    return days;
  });
  const [hoveredDay, setHoveredDay] = useState(null);

  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return "15 mins";
      case 2: return "45 mins";
      case 3: return "1.5 hrs";
      default: return "No activity";
    }
  };

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="streak-info">
          <h3 className="month-title">January 2026</h3>
          <div className="streak-badge">
            <Flame size={14} className="flame-anim" fill="currentColor" />
            <span>{currentStreak} Day Streak</span>
          </div>
        </div>
        <div className="streak-actions">
          <button className="icon-btn-small"><ChevronLeft size={16} /></button>
          <button className="icon-btn-small"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="calendar-week-header">
        {daysOfWeek.map((d, index) => <span key={index}>{d}</span>)}
      </div>

      <div className="calendar-grid-month">
        {calendarDays.map((d, index) => (
          d.type === 'padding' ? (
            <div key={d.id} className="calendar-day padding" />
          ) : (
            <motion.div
              key={d.id}
              className={`calendar-day level-${d.level} ${d.isToday ? 'today' : ''}`}
              whileHover={{ scale: 1.15, zIndex: 10 }}
              onMouseEnter={() => setHoveredDay(d)}
              onMouseLeave={() => setHoveredDay(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              <span className="day-number">{d.day}</span>
              {hoveredDay?.id === d.id && (
                <motion.div
                  className="day-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="tooltip-day">Jan {d.day}</span>
                  <span className="tooltip-stat">{getLevelLabel(d.level)}</span>
                </motion.div>
              )}
            </motion.div>
          )
        ))}
      </div>

      <div className="streak-legend">
        <span>Less</span>
        <div className="legend-scale">
          <div className="legend-item level-0"></div>
          <div className="legend-item level-1"></div>
          <div className="legend-item level-2"></div>
          <div className="legend-item level-3"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
