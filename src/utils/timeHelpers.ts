export const snapToNearestMinute = (minute: number): number => {
  return Math.round(minute);
};

export const angleToTime = (angle: number, type: 'hour' | 'minute'): number => {
  // Angle: 0 is at 12 o'clock, 90 is at 3 o'clock, etc.
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  if (type === 'minute') {
    // 360 degrees = 60 minutes -> 6 degrees per minute
    return Math.round(normalizedAngle / 6) % 60;
  } else {
    // 360 degrees = 12 hours -> 30 degrees per hour
    // Wait, hour hand moves smoothly, so its position depends on minutes too.
    // For direct dragging of the hour hand snapping to hours:
    return Math.round(normalizedAngle / 30) % 12 || 12;
  }
};

export const timeToAngle = (time: number, type: 'hour' | 'minute'): number => {
  if (type === 'minute') {
    return time * 6;
  } else {
    return (time % 12) * 30;
  }
};

export const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 12) + 1; // 1 to 12
  const minutes = Math.floor(Math.random() * 60); // 0 to 59
  return { hours, minutes };
};
