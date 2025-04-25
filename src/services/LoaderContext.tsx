import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoaderContextType {
    loading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
    children: ReactNode;
}

export const LoaderProvider = ({ children }: LoaderProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    const showLoader = React.useCallback(() => {
        setLoading(true);
    }, []);

    const hideLoader = React.useCallback(() => {
        setLoading(false);
    }, []);

    const contextValue: LoaderContextType = {
        loading,
        showLoader,
        hideLoader
    };

    return (
        <LoaderContext.Provider value={contextValue}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
}; 