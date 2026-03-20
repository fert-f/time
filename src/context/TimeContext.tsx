import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type TestModeStep = 'hidden' | 'revealed';

interface TimeContextType {
  totalMinutes: number; // 0 to 1439 (24 hours)
  hours: number;        // 1 to 12
  minutes: number;      // 0 to 59
  dayOffset: number;    // Tracks active day based on midnight wrapping
  isPM: boolean;
  is24Hour: boolean;
  isTestMode: boolean;
  testModeStep: TestModeStep;
  language: 'ru' | 'en';
  
  addMinutes: (delta: number) => void;
  resetToNow: () => void;
  toggle24Hour: () => void;
  toggleTestMode: () => void;
  toggleLanguage: () => void;
  handleTestModeAction: () => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initDate = new Date();
  
  // Single continuous state representing all time traveled.
  const [absoluteMinutes, setAbsoluteMinutes] = useState(initDate.getHours() * 60 + initDate.getMinutes());
  
  const [is24Hour, setIs24Hour] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testModeStep, setTestModeStep] = useState<TestModeStep>('hidden');
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  // Derive everything strictly from this single source of truth
  const totalMinutes = ((absoluteMinutes % 1440) + 1440) % 1440;
  const dayOffset = Math.floor(absoluteMinutes / 1440);
  
  let current24Hour = Math.floor(totalMinutes / 60);
  let minutes = Math.round(totalMinutes % 60);
  
  // Fix edge case where rounding pushes 59.6 minutes to 60
  if (minutes === 60) {
    minutes = 0;
    current24Hour = (current24Hour + 1) % 24;
  }

  const hours = current24Hour % 12 === 0 ? 12 : current24Hour % 12;
  const isPM = current24Hour >= 12;

  const addMinutes = (delta: number) => {
    setAbsoluteMinutes((prev) => prev + delta);
  };

  const toggle24Hour = () => setIs24Hour((prev) => !prev);
  const toggleLanguage = () => setLanguage((prev) => prev === 'ru' ? 'en' : 'ru');

  const resetToNow = () => {
    const d = new Date();
    setAbsoluteMinutes(d.getHours() * 60 + d.getMinutes());
    if (isTestMode) setIsTestMode(false);
  };

  const generateNewTestTime = () => {
    const newMins = Math.floor(Math.random() * 1440);
    // Align absoluteMinutes to the new time without changing current day offset unnecessarily?
    // Actually, just set absoluteMinutes to exactly the new Mins (which means day 0).
    setAbsoluteMinutes(newMins);
  };

  const toggleTestMode = () => {
    setIsTestMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        setTestModeStep('hidden');
        generateNewTestTime();
      }
      return nextMode;
    });
  };

  const handleTestModeAction = () => {
    if (testModeStep === 'hidden') {
      setTestModeStep('revealed');
    } else {
      setTestModeStep('hidden');
      generateNewTestTime();
    }
  };

  return (
    <TimeContext.Provider
      value={{
        totalMinutes,
        hours,
        minutes,
        dayOffset,
        isPM,
        is24Hour,
        isTestMode,
        testModeStep,
        language,
        addMinutes,
        resetToNow,
        toggle24Hour,
        toggleTestMode,
        toggleLanguage,
        handleTestModeAction,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
