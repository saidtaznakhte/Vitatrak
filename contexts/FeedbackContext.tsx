import React, { createContext, useState, useCallback, useContext } from 'react';

interface FeedbackContextType {
  isSuccessVisible: boolean;
  showSuccess: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const showSuccess = useCallback(() => {
    if (isSuccessVisible) return;
    setIsSuccessVisible(true);
    setTimeout(() => {
      setIsSuccessVisible(false);
    }, 1500); // Animation duration + buffer
  }, [isSuccessVisible]);

  const value = { showSuccess, isSuccessVisible };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return { showSuccess: context.showSuccess };
};

export const useSuccessState = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useSuccessState must be used within a FeedbackProvider');
  }
  return { isSuccessVisible: context.isSuccessVisible };
};
