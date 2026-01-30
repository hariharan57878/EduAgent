import React, { useState, useEffect } from "react";
import { Flame, Star, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./StreakCalendar.css";

const StreakCalendar = ({ currentStreak = 0 }) => {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days = [];

    // Add padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ type: 'padding', id: `pad-${i}` });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push({
        day: i,
        // Set all levels to 0 to clear history as requested specific activity data isn't connected yet
        level: isToday ? 1 : 0,
        isToday: isToday,
        id: `day-${i}`
      });
    }
    setCalendarDays(days);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return "Today";
      case 2: return "45 mins";
      case 3: return "1.5 hrs";
      default: return "No activity";
    }
  };

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="streak-info">
          <h3 className="month-title">{getMonthName(currentDate)}</h3>
          <div className="streak-badge">
            <Flame size={14} className="flame-anim" fill="currentColor" />
            <span>{currentStreak} Day Streak</span>
          </div>
        </div>
        <div className="streak-actions">
          <button className="icon-btn-small" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <button className="icon-btn-small" onClick={nextMonth}><ChevronRight size={16} /></button>
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
              transition={{ delay: index * 0.005 }} // Faster stagger
            >
              <span className="day-number">{d.day}</span>
              {hoveredDay?.id === d.id && (
                <motion.div
                  className="day-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="tooltip-day">{d.day}</span>
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
