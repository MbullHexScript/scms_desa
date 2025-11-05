import React, { createContext, useState } from 'react';

interface ApiContextType {
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiUrl] = useState(
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  );

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl: () => {} }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = React.useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
};
