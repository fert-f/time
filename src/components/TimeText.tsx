import React from 'react';
import { useTime } from '../context/TimeContext';
import { getTimeText } from '../utils/formatters';
import { motion } from 'framer-motion';

export const TimeText: React.FC = () => {
  const { hours, minutes, language, isTestMode, testModeStep } = useTime();
  
  const text = getTimeText(hours, minutes, language);
  const isHidden = isTestMode && testModeStep === 'hidden';

  return (
    <div style={{ textAlign: 'center', minHeight: '4.5rem', width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', margin: '1rem 0' }}>
      {!isHidden && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--secondary-color)', textTransform: 'capitalize', lineHeight: '1.2' }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};
