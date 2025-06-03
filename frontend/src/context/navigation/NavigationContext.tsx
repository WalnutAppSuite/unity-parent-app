import { createContext, useState, ReactNode } from "react";

interface NavigationContextType {
    isBackButtonEnabled: boolean;
    setIsBackButtonEnabled: (value: boolean) => void;
    isMenuEnabled: boolean;
    setIsMenuEnabled: (value: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType>({
    isBackButtonEnabled: true,
    setIsBackButtonEnabled: () => { },
    isMenuEnabled: true,
    setIsMenuEnabled: () => { },
});

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const [isBackButtonEnabled, setIsBackButtonEnabled] = useState(true);
    const [isMenuEnabled, setIsMenuEnabled] = useState(true);

    return (
        <NavigationContext.Provider value={{
            isBackButtonEnabled,
            setIsBackButtonEnabled,
            isMenuEnabled,
            setIsMenuEnabled,
        }}>
            {children}
        </NavigationContext.Provider>
    );
}; 