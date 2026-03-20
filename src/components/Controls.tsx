import React from 'react';
import { useTime } from '../context/TimeContext';
import { Globe, Settings2, Clock } from 'lucide-react';

export const Controls: React.FC = () => {
  const { is24Hour, toggle24Hour, language, toggleLanguage, isTestMode, toggleTestMode, handleTestModeAction, testModeStep, resetToNow } = useTime();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={resetToNow} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent-yellow)', color: '#fff' }}>
          <Clock size={18} />
          {language === 'ru' ? 'Сейчас' : 'Now'}
        </button>
        <button onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} />
          {language === 'ru' ? 'Русский' : 'English'}
        </button>
        <button onClick={toggle24Hour} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings2 size={18} />
          {is24Hour ? '24h format' : '12h format'}
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', backgroundColor: isTestMode ? 'var(--primary-color)' : 'var(--glass-bg)', color: isTestMode ? '#fff' : 'inherit', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isTestMode ? '1rem' : '0' }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>
            {language === 'ru' ? 'Режим тестирования' : 'Testing Mode'}
          </h3>
          <button onClick={toggleTestMode} style={{ backgroundColor: isTestMode ? '#fff' : 'var(--glass-bg)', color: isTestMode ? 'var(--primary-color)' : 'inherit', border: 'none' }}>
            {isTestMode ? (language === 'ru' ? 'Выключить' : 'Turn Off') : (language === 'ru' ? 'Включить' : 'Turn On')}
          </button>
        </div>

        {isTestMode && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleTestModeAction}
              style={{ padding: '0.8rem 2rem', fontSize: '1.2rem', backgroundColor: '#fff', color: 'var(--primary-color)', border: 'none', width: '100%', fontWeight: 800 }}
            >
              {testModeStep === 'hidden' 
                ? (language === 'ru' ? 'Показать время' : 'Show Time')
                : (language === 'ru' ? 'Следующее время' : 'Next Time')
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
