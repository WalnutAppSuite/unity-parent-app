import React, { createContext, useState, ReactNode } from "react";

interface PendingFormsContextType {
  hasPendingForms: boolean;
  setHasPendingForms: (value: boolean) => void;
  isOnFormPage: boolean;
  setIsOnFormPage: (value: boolean) => void;
}

// Create context with default values
export const PendingFormsContext = createContext<PendingFormsContextType>({
  hasPendingForms: false,
  setHasPendingForms: () => {},
  isOnFormPage: false,
  setIsOnFormPage: () => {},
});

// Create provider component
interface PendingFormsProviderProps {
  children: ReactNode;
}

export const PendingFormsProvider: React.FC<PendingFormsProviderProps> = ({ children }) => {
  const [hasPendingForms, setHasPendingForms] = useState(false);
  const [isOnFormPage, setIsOnFormPage] = useState(false);

  return (
    <PendingFormsContext.Provider
      value={{
        hasPendingForms,
        setHasPendingForms,
        isOnFormPage,
        setIsOnFormPage,
      }}
    >
      {children}
    </PendingFormsContext.Provider>
  );
};

// Custom hook for easier context usage
export const usePendingForms = () => React.useContext(PendingFormsContext);
