import React from 'react';
import { useTime } from '../context/TimeContext';
import { getCurrentRoutineEvent } from '../utils/routine';
import { motion, AnimatePresence } from 'framer-motion';

export const CurrentEvent: React.FC = () => {
  const { hours, minutes, isPM, language } = useTime();

  // Calculate 24-hour exact format for the routine check
  let h24 = hours;
  if (isPM && hours !== 12) h24 += 12;
  if (!isPM && hours === 12) h24 = 0;

  const currentEvent = getCurrentRoutineEvent(h24, minutes);

  return (
    <div className="glass-panel" style={{ padding: 'var(--panel-pad-event)', width: '100%', minHeight: 'var(--height-event)', display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: `${currentEvent.color}15`, border: `2px solid ${currentEvent.color}50`, marginBottom: '0', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 'var(--icon-event)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', minWidth: '40px', textAlign: 'center' }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentEvent.id}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {currentEvent.emoji}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <span style={{ fontSize: 'var(--font-event-title)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0', lineHeight: 1.1 }}>
          {language === 'ru' ? 'СЕЙЧАС ПО РАСПИСАНИЮ' : 'CURRENTLY SCHEDULED'}
        </span>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ fontSize: 'var(--font-event-name)', fontWeight: 800, color: currentEvent.color, lineHeight: 1.2, marginTop: '0.1rem' }}
          >
            {language === 'ru' ? currentEvent.labelRu : currentEvent.labelEn}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
