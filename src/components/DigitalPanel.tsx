import React from 'react';
import { useTime } from '../context/TimeContext';
import { formatTimeDigital } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

export const DigitalPanel: React.FC = () => {
  const { hours, minutes, isPM, is24Hour, isTestMode, testModeStep, handleTestModeAction } = useTime();

  const isHidden = isTestMode && testModeStep === 'hidden';

  const handlePanelClick = () => {
    if (isTestMode) {
      handleTestModeAction();
    }
  };

  return (
    <div
      className="glass-panel"
      onClick={handlePanelClick}
      style={{
        padding: '0.5rem 1.5rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80px',
        overflow: 'hidden',
        marginBottom: '0',
        cursor: isTestMode ? 'pointer' : 'default',
        boxSizing: 'border-box'
      }}>
      <AnimatePresence mode="popLayout">
        {isHidden ? (
          <motion.div
            key="hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-light)', userSelect: 'none' }}
          >
            ??:??
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
          >
            {formatTimeDigital(hours, minutes, isPM, is24Hour)}
            {!is24Hour && (
              <span style={{ fontSize: '1.2rem', marginLeft: '0.3rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {isPM ? 'PM' : 'AM'}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
