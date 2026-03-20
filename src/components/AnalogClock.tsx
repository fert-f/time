import React, { useRef, useState } from 'react';
import { useTime } from '../context/TimeContext';

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startAngleRad = (startAngle - 90) * Math.PI / 180;
  const endAngleRad = (endAngle - 90) * Math.PI / 180;

  const startOuterX = x + outerRadius * Math.cos(startAngleRad);
  const startOuterY = y + outerRadius * Math.sin(startAngleRad);
  const endOuterX = x + outerRadius * Math.cos(endAngleRad);
  const endOuterY = y + outerRadius * Math.sin(endAngleRad);

  const startInnerX = x + innerRadius * Math.cos(startAngleRad);
  const startInnerY = y + innerRadius * Math.sin(startAngleRad);
  const endInnerX = x + innerRadius * Math.cos(endAngleRad);
  const endInnerY = y + innerRadius * Math.sin(endAngleRad);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuterX, startOuterY,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 1, endOuterX, endOuterY,
    "L", endInnerX, endInnerY,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 0, startInnerX, startInnerY,
    "Z"
  ].join(" ");
};

const hourColors: Record<number, string> = {
  1: '#F4511E', // Orange
  2: '#FB8C00', // Yellow-Orange
  3: '#FFB300', // Yellow
  4: '#7CB342', // Light Green
  5: '#43A047', // Green
  6: '#00897B', // Teal
  7: '#1E88E5', // Blue
  8: '#3949AB', // Dark Blue
  9: '#5E35B1', // Purple
  10: '#8E24AA', // Plum
  11: '#D81B60', // Pink
  12: '#E53935'  // Red
};

export const AnalogClock: React.FC = () => {
  const { totalMinutes, dayOffset, addMinutes, isTestMode, testModeStep } = useTime();
  const clockRef = useRef<SVGSVGElement>(null);

  const [draggingHand, setDraggingHand] = useState<'hour' | 'minute' | null>(null);
  const [lastAngle, setLastAngle] = useState<number | null>(null);

  const absoluteContinuousMinutes = dayOffset * 1440 + totalMinutes;
  const minuteAngle = absoluteContinuousMinutes * 6;
  const hourAngle = absoluteContinuousMinutes * 0.5;

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

    if (deltaAngle < -180) deltaAngle += 360;
    else if (deltaAngle > 180) deltaAngle -= 360;

    if (Math.abs(deltaAngle) > 0.1) {
      if (draggingHand === 'minute') {
        addMinutes(deltaAngle / 6);
      } else if (draggingHand === 'hour') {
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

  return (
    <div style={{ width: '100%', maxWidth: '380px', margin: '0.5rem auto', display: 'flex', justifyContent: 'center' }}>
      <svg
        ref={clockRef}
        viewBox="0 0 320 320"
        style={{ width: '100%', height: 'auto', touchAction: 'none', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <defs>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Wooden Frame */}
        <circle cx="160" cy="160" r="156" fill="#E8C396" stroke="#C49A6C" strokeWidth="4" filter="url(#shadow)" />
        <circle cx="160" cy="160" r="148" fill="#FFFFFF" />

        {/* Minute Track */}
        {[...Array(60)].map((_, i) => {
          const isFive = i % 5 === 0;
          const hourIndex = i === 0 ? 12 : i / 5;
          const bgColor = isFive ? hourColors[hourIndex] : '#FFFFFF';
          const textColor = isFive ? '#FFFFFF' : '#333333';
          const startAngle = i * 6 - 3;
          const endAngle = i * 6 + 3;

          const angleRad = (i * 6 - 90) * Math.PI / 180;
          // Radius placing the text cleanly in the track
          const textRadius = 139;
          const textX = 160 + textRadius * Math.cos(angleRad);
          const textY = 160 + textRadius * Math.sin(angleRad);

          return (
            <g key={`min-${i}`}>
              <path
                d={describeArc(160, 160, 130, 148, startAngle, endAngle)}
                fill={bgColor}
                stroke="#E2E8F0"
                strokeWidth="0.5"
              />
              <text
                x={textX}
                y={textY}
                fill={textColor}
                fontSize="8"
                fontWeight={isFive ? "800" : "500"}
                textAnchor="middle"
                alignmentBaseline="central"
                style={{ userSelect: 'none' }}
              >
                {i}
              </text>
            </g>
          );
        })}

        {/* Inner Arcs removed as requested */}

        {/* Center dot under hands */}
        <circle cx="160" cy="160" r="16" fill="#F1F5F9" />

        {/* Hour Circles and Numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angleRad = (hour * 30 - 90) * Math.PI / 180;
          const radius = 100;
          const cx = 160 + radius * Math.cos(angleRad);
          const cy = 160 + radius * Math.sin(angleRad);

          return (
            <g key={`hour-${hour}`}>
              <circle cx={cx} cy={cy} r="18" fill={hourColors[hour]} opacity="0.3" />
              <text
                x={cx}
                y={cy}
                fill={hourColors[hour]}
                fontSize="22"
                fontWeight="800"
                textAnchor="middle"
                alignmentBaseline="central"
                dy="1"
              >
                {hour}
              </text>
            </g>
          );
        })}

        {/* Minute Hand */}
        <g
          transform={`rotate(${minuteAngle} 160 160)`}
          style={{ transition: draggingHand === 'minute' ? 'none' : 'transform 0.1s linear', cursor: interactive ? 'grab' : 'default' }}
          onPointerDown={handlePointerDown('minute')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Hitbox */}
          <rect x="145" y="30" width="30" height="150" fill="transparent" />
          <path d="M 156 40 L 164 40 L 164 160 L 156 160 Z" fill="#1E88E5" rx="4" />
          <circle cx="160" cy="160" r="10" fill="#1E88E5" />
          <text
            x="205"
            y="160"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
            alignmentBaseline="central"
            transform="rotate(-90 160 160)"
          >
            MINUTE
          </text>
        </g>

        {/* Hour Hand */}
        <g
          transform={`rotate(${hourAngle} 160 160)`}
          style={{ transition: draggingHand === 'hour' ? 'none' : 'transform 0.1s linear', cursor: interactive ? 'grab' : 'default' }}
          onPointerDown={handlePointerDown('hour')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Hitbox */}
          <rect x="145" y="70" width="30" height="110" fill="transparent" />
          <path d="M 152 80 L 168 80 L 168 160 L 152 160 Z" fill="#E53935" rx="6" />
          <text
            x="200"
            y="160"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            textAnchor="middle"
            alignmentBaseline="central"
            transform="rotate(-90 160 160)"
          >
            HOUR
          </text>
        </g>

        {/* Center Pin */}
        <circle cx="160" cy="160" r="4" fill="#FFCA28" />
        <circle cx="160" cy="160" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
