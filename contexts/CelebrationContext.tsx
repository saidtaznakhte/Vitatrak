
import React, { createContext, useState, useCallback, useContext } from 'react';

interface CelebrationContextType {
  isCelebrating: boolean;
  triggerCelebration: () => void;
}

export const CelebrationContext = createContext<CelebrationContextType>({
  isCelebrating: false,
  triggerCelebration: () => {},
});

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const triggerCelebration = useCallback(() => {
    setIsCelebrating(true);
    setTimeout(() => {
      setIsCelebrating(false);
    }, 4000); // Duration of the confetti animation
  }, []);

  return (
    <CelebrationContext.Provider value={{ isCelebrating, triggerCelebration }}>
      {children}
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => useContext(CelebrationContext);
