export interface RoutineEvent {
  id: string;
  hour: number;
  minute: number;
  labelRu: string;
  labelEn: string;
  emoji: string;
  color: string;
}

export const dailyRoutine: RoutineEvent[] = [
  { id: '1', hour: 7, minute: 0, labelRu: 'Завтрак', labelEn: 'Breakfast', emoji: '🥞', color: '#f59e0b' },
  { id: '2', hour: 8, minute: 0, labelRu: 'Школа', labelEn: 'School', emoji: '🎒', color: '#3b82f6' },
  { id: '3', hour: 14, minute: 10, labelRu: 'Домой', labelEn: 'Go Home', emoji: '🏠', color: '#10b981' },
  { id: '4', hour: 17, minute: 30, labelRu: 'Ужин', labelEn: 'Dinner', emoji: '🍲', color: '#f97316' },
  { id: '5', hour: 19, minute: 45, labelRu: 'Подготовка ко сну', labelEn: 'Get ready for bed', emoji: '🛁', color: '#8b5cf6' },
  { id: '6', hour: 21, minute: 0, labelRu: 'Сон', labelEn: 'Sleep', emoji: '🌙', color: '#1e3a8a' }
];

export const getCurrentRoutineEvent = (currentHours: number, currentMinutes: number): RoutineEvent => {
  const currentTotal = currentHours * 60 + currentMinutes;
  
  let currentEvent = dailyRoutine[dailyRoutine.length - 1]; // default to last event if before first
  
  for (let i = 0; i < dailyRoutine.length; i++) {
    const eventTime = dailyRoutine[i].hour * 60 + dailyRoutine[i].minute;
    if (currentTotal >= eventTime) {
      currentEvent = dailyRoutine[i];
    } else {
      break;
    }
  }
  
  return currentEvent;
};
