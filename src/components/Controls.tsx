import React from 'react';
import { useTime } from '../context/TimeContext';
import { Globe, Settings2, Clock, HelpCircle } from 'lucide-react';

export const Controls: React.FC = () => {
  const { is24Hour, toggle24Hour, language, toggleLanguage, isTestMode, toggleTestMode, resetToNow } = useTime();

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'nowrap', width: '100%', overflowX: 'auto' }}>
        <button onClick={resetToNow} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--accent-yellow)', color: '#fff', flex: '1', justifyContent: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem' }}>
          <Clock size={16} />
          {language === 'ru' ? 'Сейчас' : 'Now'}
        </button>
        <button onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: '1', justifyContent: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem' }}>
          <Globe size={16} />
          {language === 'ru' ? 'Рус' : 'Eng'}
        </button>
        <button onClick={toggle24Hour} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: '1', justifyContent: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem' }}>
          <Settings2 size={16} />
          {is24Hour ? '24h' : '12h'}
        </button>
        <button onClick={toggleTestMode} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: '1', justifyContent: 'center', padding: '0.5rem 0.25rem', fontSize: '0.9rem', backgroundColor: isTestMode ? 'var(--primary-color)' : 'var(--glass-bg)', color: isTestMode ? '#fff' : 'inherit' }}>
          <HelpCircle size={16} />
          {language === 'ru' ? 'Тест' : 'Test'}
        </button>
      </div>
    </div>
  );
};
