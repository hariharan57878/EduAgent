import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import './WeeklyReviewModal.css';

const WeeklyReviewModal = ({ review, onDismiss }) => {
  if (!review) return null;

  return (
    <div className="weekly-modal-backdrop">
      <motion.div
        className="weekly-modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="weekly-header">
          <div className="title-area">
            <Calendar className="icon-main" size={24} />
            <h2>Weekly Achievement Review</h2>
          </div>
          <button className="close-btn" onClick={onDismiss}>
            <X size={20} />
          </button>
        </div>

        <div className="weekly-body">
          <p className="intro">You've had a productive week. Here's a summary of your execution trajectory.</p>

          <div className="review-stats-grid">
            <div className="review-stat-card">
              <div className="stat-icon"><CheckCircle2 size={20} /></div>
              <div className="stat-data">
                <span className="label">Modules Finished</span>
                <span className="value">{review.modulesCompleted}</span>
              </div>
            </div>
            <div className="review-stat-card">
              <div className="stat-icon"><Clock size={20} /></div>
              <div className="stat-data">
                <span className="label">Time Invested</span>
                <span className="value">{Math.round(review.timeInvested / 60)}h {review.timeInvested % 60}m</span>
              </div>
            </div>
            <div className="review-stat-card">
              <div className="stat-icon"><TrendingUp size={20} /></div>
              <div className="stat-data">
                <span className="label">Velocity Trend</span>
                <span className="value">{review.velocityTrend}</span>
              </div>
            </div>
          </div>

          <div className="review-projection">
            <span className="label">Projected Mastery</span>
            <span className="value">{review.projection}</span>
          </div>

          <button className="btn-finish-review" onClick={onDismiss}>
            Continue Execution
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WeeklyReviewModal;
