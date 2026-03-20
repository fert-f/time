import React from 'react';
import { useTime } from '../context/TimeContext';
import { dailyRoutine } from '../utils/routine';

const DAY_WIDTH = 800; // Total width for 24 hours in pixels

export const CalendarStrip: React.FC = () => {
  const { totalMinutes, dayOffset, language } = useTime();

  // Calculate strict cumulative minutes absolute from the initial "day 0" midnight.
  // totalMinutes is 0-1439 representing current time.
  // Use absolute minutes to compute shift and current day
  const absoluteTotalMinutes = dayOffset * 1440 + totalMinutes;
  const currentDayIndex = Math.floor(absoluteTotalMinutes / 1440);

  // Create a static, daylight-savings-proof, midnight-proof base Date object for "day 0"
  const baseDate = React.useMemo(() => {
    const d = new Date();
    // Noon avoids crossing 00:00 or 02:00 (DST shift) when adding/subtracting days!
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  // We render a window of days surrounding the currently viewed day (e.g., -2 to +2 days from the center)
  const renderedDays = [
    currentDayIndex - 2,
    currentDayIndex - 1,
    currentDayIndex,
    currentDayIndex + 1,
    currentDayIndex + 2,
  ];

  const getDayName = (date: Date) => {
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getPeriodLabel = (period: 'night' | 'morning' | 'day' | 'evening') => {
    if (language === 'ru') {
      return { night: 'Ночь', morning: 'Утро', day: 'День', evening: 'Вечер' }[period];
    }
    return { night: 'Night', morning: 'Morning', day: 'Day', evening: 'Evening' }[period];
  };

  const shiftX = absoluteTotalMinutes * (DAY_WIDTH / 1440);

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', padding: '1rem 0', marginBottom: '2rem' }}>

      {/* Center Indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '4px',
        height: '100%',
        backgroundColor: 'var(--secondary-color)',
        zIndex: 20,
        transform: 'translateX(-50%)',
        boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)'
      }}>
        {/* Triangle pointer top */}
        <div style={{ position: 'absolute', top: '-10px', left: '-6px', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid var(--secondary-color)' }} />
        {/* Triangle pointer bottom */}
        <div style={{ position: 'absolute', bottom: '-4px', left: '-6px', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid var(--secondary-color)' }} />
      </div>

      <div style={{
        position: 'relative',
        height: '100px',
        width: '100%',
      }}>
        {/* The sliding track */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          height: '100%',
          transform: `translateX(${-shiftX}px)`,
          // Use CSS transition ONLY if jumping far, else let it be fast. Wait, use no transition because drag provides constant updates.
        }}>
          {renderedDays.map((targetDayIndex) => {
            // Safely reconstruct the actual Date object based on our frozen noon-based "day 0"
            const d = new Date(baseDate.getTime());
            d.setDate(baseDate.getDate() + targetDayIndex);

            return (
              <div
                key={targetDayIndex}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${targetDayIndex * DAY_WIDTH}px`,
                  width: `${DAY_WIDTH}px`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  // Bold Day Separator on the left
                  borderLeft: '4px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '-4px 0 10px rgba(0,0,0,0.1)'
                }}
              >
                {/* Date Header */}
                <div style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--text-dark)', padding: '0.3rem 1rem', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)', zIndex: 2 }}>
                  {getDayName(d)}
                </div>

                {/* 24-hour continuous gradient block */}
                <div style={{
                  display: 'flex',
                  flex: 1,
                  // 0:00 (Night), 6:00 (Morning), 12:00 (Day), 18:00 (Evening), 24:00 (Night)
                  background: 'linear-gradient(to right, #0f172a 0%, #38bdf8 25%, #fde047 50%, #c084fc 75%, #0f172a 100%)',
                  position: 'relative'
                }}>
                  {/* Night: 00-06 */}
                  <div style={{ width: '25%', color: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {getPeriodLabel('night')}
                  </div>
                  {/* Morning: 06-12 */}
                  <div style={{ width: '25%', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                    {getPeriodLabel('morning')}
                  </div>
                  {/* Day: 12-18 */}
                  <div style={{ width: '25%', color: '#451a03', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
                    {getPeriodLabel('day')}
                  </div>
                  {/* Evening: 18-24 */}
                  <div style={{ width: '25%', color: '#fdf4ff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {getPeriodLabel('evening')}
                  </div>

                  {/* Inner subtle tick marks dividing the 4 segments */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '25%', borderLeft: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: '1px dashed rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '75%', borderLeft: '1px dashed rgba(255,255,255,0.3)', pointerEvents: 'none' }} />

                  {/* Routine Event Markers */}
                  {dailyRoutine.map((event) => {
                    const eventMinutes = event.hour * 60 + event.minute;
                    const positionPercent = (eventMinutes / 1440) * 100;

                    return (
                      <div key={event.id} style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${positionPercent}%`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}>
                        {/* Connecting line */}
                        <div style={{ width: '2px', height: '100px', backgroundColor: 'rgba(255,255,255,0.2)', position: 'absolute', zIndex: -1 }} />

                        {/* Floating Icon Base */}
                        <div style={{
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          border: `2px solid ${event.color}`,
                          fontSize: '1.2rem',
                          paddingBottom: '2px' // optical alignment for emoji
                        }} title={`${event.hour.toString().padStart(2, '0')}:${event.minute.toString().padStart(2, '0')} - ${language === 'ru' ? event.labelRu : event.labelEn}`}>
                          {event.emoji}
                        </div>

                        {/* Time Text below icon */}
                        <div style={{
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '8px',
                          marginTop: '4px',
                          textShadow: 'none'
                        }}>
                          {event.hour.toString().padStart(2, '0')}:{event.minute.toString().padStart(2, '0')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
