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

const describeArcStroke = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = (startAngle - 90) * Math.PI / 180;
  const end = (endAngle - 90) * Math.PI / 180;

  const startX = x + radius * Math.cos(start);
  const startY = y + radius * Math.sin(start);
  const endX = x + radius * Math.cos(end);
  const endY = y + radius * Math.sin(end);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startX, startY,
    "A", radius, radius, 0, largeArcFlag, 1, endX, endY
  ].join(" ");
};

const hourColors: Record<number, string> = {
  1: '#FF7675', // Soft Red
  2: '#FF9F43', // Pastel Orange
  3: '#FDCB6E', // Soft Yellow
  4: '#00B894', // Mint
  5: '#1DD1A1', // Teal Green
  6: '#0ABDE3', // Cyan
  7: '#54A0FF', // Soft Blue
  8: '#5F27CD', // Purple
  9: '#8E44AD', // Plum
  10: '#D980FA', // Pinkish Purple
  11: '#FD79A8', // Pastel Pink
  12: '#FF4757'  // Watermelon Red
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

  const springTransition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      margin: '2rem auto',
      display: 'flex',
      justifyContent: 'center',
      filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.08))'
    }}>
      <svg
        ref={clockRef}
        viewBox="0 0 320 320"
        style={{ width: '100%', height: 'auto', touchAction: 'none' }}
        className="clock-svg"
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap');
            .clock-svg text {
              font-family: 'Nunito', system-ui, -apple-system, sans-serif;
            }
          `}
        </style>
        <defs>
          {/* Shadow for hands to pop from the screen */}
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.3" />
          </filter>

          {/* Gentle bubble drop shadow for hour marks and inner arcs */}
          <filter id="bubbleDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
          </filter>

          {/* Glossy top highlight for hour bubbles */}
          <radialGradient id="bubbleHighlight" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Gradients for the wooden frame to give it rich skeuomorphic depth */}
          <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d5b5" />
            <stop offset="100%" stopColor="#c89660" />
          </linearGradient>
          <linearGradient id="woodBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>

          {/* Gradients for hands */}
          <linearGradient id="minHand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="hourHand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          {/* Center pin metallic look */}
          <radialGradient id="centerPin" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#EAB308" />
          </radialGradient>
        </defs>

        {/* Outer Wooden Frame Stack */}
        <circle cx="160" cy="160" r="156" fill="url(#woodGrad)" />
        <circle cx="160" cy="160" r="156" fill="url(#woodBevel)" />
        <circle cx="160" cy="160" r="148" fill="#F8FAFC" /> {/* Off-white face base */}

        {/* Subtle inner shadow to make the face properly recessed */}
        <circle cx="160" cy="160" r="148" fill="none" stroke="#000" strokeWidth="6" opacity="0.04" />
        <circle cx="160" cy="160" r="148" fill="none" stroke="#000" strokeWidth="2" opacity="0.06" />

        {/* Minute Track rings and segments */}
        {[...Array(60)].map((_, i) => {
          const isFive = i % 5 === 0;
          const hourIndex = i === 0 ? 12 : i / 5;
          const bgColor = isFive ? hourColors[hourIndex] : 'transparent';
          const textColor = isFive ? '#FFFFFF' : '#64748B';
          const startAngle = i * 6 - 3;
          const endAngle = i * 6 + 3;

          const angleRad = (i * 6 - 90) * Math.PI / 180;
          const textRadius = 139;
          const textX = 160 + textRadius * Math.cos(angleRad);
          const textY = 160 + textRadius * Math.sin(angleRad);

          return (
            <g key={`min-${i}`}>
              <path
                d={describeArc(160, 160, 130, 148, startAngle, endAngle)}
                fill={bgColor}
                stroke="rgba(0,0,0,0.03)"
                strokeWidth="1"
              />
              <text
                x={textX}
                y={textY}
                fill={textColor}
                fontSize="8"
                fontWeight={isFive ? "900" : "800"}
                textAnchor="middle"
                alignmentBaseline="central"
                style={{ userSelect: 'none' }}
              >
                {i}
              </text>
            </g>
          );
        })}
        {/* Border line separating minute track from internal face */}
        <circle cx="160" cy="160" r="130" fill="none" stroke="#CBD5E1" strokeWidth="1" opacity="0.5" />

        {/* Inner Arcs (Quarter past, etc.) rendered as chunky smooth strokes */}
        <path d={describeArcStroke(160, 160, 58, 4, 86)} stroke="#FF9F43" strokeWidth="10" strokeLinecap="round" opacity="0.9" filter="url(#bubbleDrop)" />
        <path d={describeArcStroke(160, 160, 58, 94, 176)} stroke="#1DD1A1" strokeWidth="10" strokeLinecap="round" opacity="0.9" filter="url(#bubbleDrop)" />
        <path d={describeArcStroke(160, 160, 58, 184, 266)} stroke="#54A0FF" strokeWidth="10" strokeLinecap="round" opacity="0.9" filter="url(#bubbleDrop)" />
        <path d={describeArcStroke(160, 160, 58, 274, 356)} stroke="#D980FA" strokeWidth="10" strokeLinecap="round" opacity="0.9" filter="url(#bubbleDrop)" />

        {/* Text for inner arcs */}
        <text x="160" y="85" fill="#64748B" fontSize="10" fontWeight="800" textAnchor="middle">O'clock</text>
        <text x="235" y="160" fill="#64748B" fontSize="10" fontWeight="800" textAnchor="middle" alignmentBaseline="central">Quarter past</text>
        <text x="160" y="238" fill="#64748B" fontSize="10" fontWeight="800" textAnchor="middle">Half past</text>
        <text x="85" y="160" fill="#64748B" fontSize="10" fontWeight="800" textAnchor="middle" alignmentBaseline="central">Quarter to</text>

        {/* Center alignment dot */}
        <circle cx="160" cy="160" r="18" fill="#F1F5F9" filter="url(#bubbleDrop)" />

        {/* Hour Circles and Numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angleRad = (hour * 30 - 90) * Math.PI / 180;
          const radius = 100;
          const cx = 160 + radius * Math.cos(angleRad);
          const cy = 160 + radius * Math.sin(angleRad);

          return (
            <g key={`hour-${hour}`}>
              <circle cx={cx} cy={cy} r="18" fill={hourColors[hour]} filter="url(#bubbleDrop)" />
              <circle cx={cx} cy={cy} r="18" fill="url(#bubbleHighlight)" />
              <text
                x={cx}
                y={cy}
                fill="#FFFFFF"
                fontSize="22"
                fontWeight="900"
                textAnchor="middle"
                alignmentBaseline="central"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}
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
          style={{ transition: draggingHand === 'minute' ? 'none' : springTransition, cursor: interactive ? 'grab' : 'default' }}
          onPointerDown={handlePointerDown('minute')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          filter="url(#handShadow)"
        >
          {/* Extended Hitbox */}
          <rect x="145" y="20" width="30" height="180" fill="transparent" />
          <rect x="153" y="25" width="14" height="155" rx="7" fill="url(#minHand)" />
          {/* Text inside the hand, anchoring at the start from the tail end so tip scales gracefully */}
          <text
            x="275"
            y="160"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="900"
            letterSpacing="2"
            textAnchor="end"
            alignmentBaseline="central"
            transform="rotate(-90 160 160)"
            style={{ textShadow: '0px 1px 1px rgba(0,0,0,0.2)' }}
          >
            MINUTE
          </text>
        </g>

        {/* Hour Hand */}
        <g
          transform={`rotate(${hourAngle} 160 160)`}
          style={{ transition: draggingHand === 'hour' ? 'none' : springTransition, cursor: interactive ? 'grab' : 'default' }}
          onPointerDown={handlePointerDown('hour')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          filter="url(#handShadow)"
        >
          {/* Extended Hitbox */}
          <rect x="145" y="70" width="30" height="110" fill="transparent" />
          <rect x="152" y="75" width="16" height="105" rx="8" fill="url(#hourHand)" />
          <text
            x="245"
            y="160"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="900"
            letterSpacing="2"
            textAnchor="end"
            alignmentBaseline="central"
            transform="rotate(-90 160 160)"
            style={{ textShadow: '0px 1px 1px rgba(0,0,0,0.2)' }}
          >
            HOUR
          </text>
        </g>

        {/* Center Pin Overlay */}
        <circle cx="160" cy="160" r="10" fill="url(#centerPin)" filter="url(#bubbleDrop)" />
        <circle cx="160" cy="160" r="6" fill="#FFFFFF" opacity="0.6" />
      </svg>
    </div>
  );
};
