import React, { useRef, useState } from 'react';
import { useTime } from '../context/TimeContext';

export const AnalogClock: React.FC = () => {
  const { totalMinutes, dayOffset, addMinutes, isTestMode, testModeStep } = useTime();
  const clockRef = useRef<HTMLDivElement>(null);

  const [draggingHand, setDraggingHand] = useState<'hour' | 'minute' | null>(null);
  const [lastAngle, setLastAngle] = useState<number | null>(null);

  // Use absolute continuous minutes including day offset so angles increase infinitely without snapping back
  const absoluteContinuousMinutes = dayOffset * 1440 + totalMinutes;
  const minuteAngle = absoluteContinuousMinutes * 6;
  const hourAngle = absoluteContinuousMinutes * 0.5; // (absoluteContinuousMinutes / 60) * 30

  const interactive = !isTestMode || testModeStep === 'revealed';

  const calculateAngleFromEvent = (clientX: number, clientY: number) => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = clientX - centerX;
    const y = clientY - centerY;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  };

  const handlePointerDown = (hand: 'hour' | 'minute') => (e: React.PointerEvent) => {
    if (!interactive) return;
    setDraggingHand(hand);
    setLastAngle(calculateAngleFromEvent(e.clientX, e.clientY));
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHand || !interactive || lastAngle === null) return;
    const newAngle = calculateAngleFromEvent(e.clientX, e.clientY);

    let deltaAngle = newAngle - lastAngle;

    // Handle wrap around across 12 o'clock (0/360 boundary)
    if (deltaAngle < -180) deltaAngle += 360;
    else if (deltaAngle > 180) deltaAngle -= 360;

    // Only update if there is significant movement to avoid jitter
    if (Math.abs(deltaAngle) > 0.1) {
      if (draggingHand === 'minute') {
        // 6 degrees roughly equals 1 minute
        addMinutes(deltaAngle / 6);
      } else if (draggingHand === 'hour') {
        // 30 degrees roughly equals 1 hour (60 minutes)
        // 1 degree = 2 minutes
        addMinutes(deltaAngle * 2);
      }
      setLastAngle(newAngle);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingHand(null);
    setLastAngle(null);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const interpolateColor = (color1: number[], color2: number[], factor: number) => {
    return [
      Math.round(color1[0] + factor * (color2[0] - color1[0])),
      Math.round(color1[1] + factor * (color2[1] - color1[1])),
      Math.round(color1[2] + factor * (color2[2] - color1[2]))
    ];
  };

  const currentMins = ((totalMinutes % 1440) + 1440) % 1440; // 0 to 1439

  // Night (00:00) -> Sunrise (06:00) -> Day (12:00) -> Sunset (18:00) -> Night (24:00)
  const skyStops = [
    { time: 0, topSt: [15, 23, 42], botSt: [30, 41, 59] },          // Deep Night
    { time: 360, topSt: [56, 189, 248], botSt: [251, 146, 60] },    // Sunrise
    { time: 720, topSt: [14, 165, 233], botSt: [186, 230, 253] },   // Noon
    { time: 1080, topSt: [15, 23, 42], botSt: [192, 132, 252] },    // Sunset
    { time: 1440, topSt: [15, 23, 42], botSt: [30, 41, 59] },       // Deep Night
  ];

  let s = skyStops[0];
  let e = skyStops[4];
  for (let i = 0; i < skyStops.length - 1; i++) {
    if (currentMins >= skyStops[i].time && currentMins <= skyStops[i+1].time) {
      s = skyStops[i];
      e = skyStops[i+1];
      break;
    }
  }

  const factor = (currentMins - s.time) / (e.time - s.time);
  const topColor = interpolateColor(s.topSt, e.topSt, factor);
  const botColor = interpolateColor(s.botSt, e.botSt, factor);

  // Gradient with 30% opacity requested by user
  const clockFaceGradient = `linear-gradient(to bottom, rgba(${topColor[0]}, ${topColor[1]}, ${topColor[2]}, 0.3), rgba(${botColor[0]}, ${botColor[1]}, ${botColor[2]}, 0.3))`;

  // Dynamically switch ticks/text color based on brightness
  // If it's pure day, we need dark text. If it's night, we need light text.
  const isNightPhase = currentMins < 300 || currentMins > 1140;
  const clockTicks = isNightPhase ? '#64748b' : 'var(--text-dark)';
  const clockNumbers = isNightPhase ? '#f8fafc' : 'var(--text-dark)';

  return (
    <div className="glass-panel" style={{ width: '280px', height: '280px', borderRadius: '50%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem auto', transition: 'box-shadow 0.3s' }}>
      <div
        ref={clockRef}
        style={{
          width: '260px', height: '260px', borderRadius: '50%',
          background: clockFaceGradient,
          border: '6px solid var(--clock-border)', position: 'relative',
          boxShadow: isNightPhase ? 'inset 0 10px 15px rgba(0,0,0,0.5)' : 'inset 0 4px 6px rgba(0,0,0,0.05), var(--shadow-md)',
          touchAction: 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'box-shadow 0.8s ease'
        }}
      >

        {/* Center Dot */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: clockTicks, transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none', transition: 'background-color 0.8s ease' }} />

        {/* Hour Marks */}
        {[...Array(12)].map((_, i) => (
          <div key={`h-${i}`} style={{
            position: 'absolute', top: 0, left: '50%', width: '4px', height: '100%', transform: `translateX(-50%) rotate(${i * 30}deg)`, pointerEvents: 'none'
          }}>
            <div style={{ width: '4px', height: '16px', backgroundColor: clockTicks, marginTop: '6px', borderRadius: '2px', transition: 'background-color 0.8s ease' }} />
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '50%',
              transform: `translateX(-50%) rotate(-${i * 30}deg)`,
              fontWeight: '800',
              fontSize: '1.2rem',
              color: clockNumbers,
              transition: 'color 0.8s ease'
            }}>
              {i === 0 ? 12 : i}
            </div>
          </div>
        ))}

        {/* Minute Marks */}
        {[...Array(60)].map((_, i) => (
          i % 5 !== 0 && (
            <div key={`m-${i}`} style={{
              position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', transform: `translateX(-50%) rotate(${i * 6}deg)`, pointerEvents: 'none'
            }}>
              <div style={{ width: '2px', height: '6px', backgroundColor: isNightPhase ? '#475569' : '#cbd5e1', marginTop: '6px', transition: 'background-color 0.8s ease' }} />
            </div>
          )
        ))}

        {/* Hour Hand Container */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: `rotate(${hourAngle}deg)`, transition: draggingHand === 'hour' ? 'none' : 'transform 0.1s linear', pointerEvents: 'none' }}>
          <div
            onPointerDown={handlePointerDown('hour')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: 'absolute', top: '15%', left: '50%', width: '40px', height: '50%', transform: 'translateX(-50%)', cursor: interactive ? 'grab' : 'default', zIndex: 8, touchAction: 'none', pointerEvents: 'auto'
            }}
          >
            {/* The visible hand */}
            <div style={{
              position: 'absolute', bottom: '35%', left: '50%', width: '16px', height: '50%', backgroundColor: 'var(--secondary-color)', transformOrigin: 'bottom center', borderRadius: '8px', transform: 'translateX(-50%)', boxShadow: 'var(--shadow-md)', pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Minute Hand Container */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: `rotate(${minuteAngle}deg)`, transition: draggingHand === 'minute' ? 'none' : 'transform 0.1s linear', pointerEvents: 'none' }}>
          <div
            onPointerDown={handlePointerDown('minute')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: 'absolute', top: '0%', left: '50%', width: '40px', height: '65%', transform: 'translateX(-50%)', cursor: interactive ? 'grab' : 'default', zIndex: 9, touchAction: 'none', pointerEvents: 'auto'
            }}
          >
             {/* The visible hand */}
             <div style={{
              position: 'absolute', bottom: '23%', left: '50%', width: '12px', height: '65%', backgroundColor: 'var(--primary-color)', transformOrigin: 'bottom center', borderRadius: '6px', transform: 'translateX(-50%)', boxShadow: 'var(--shadow-md)', pointerEvents: 'none'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
