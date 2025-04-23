import React, { createContext, useContext } from 'react';
import { createBackend } from './useBackend';

const BackendContext = createContext<ReturnType<typeof createBackend>>(null);

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const backend = createBackend();

  return (
    <BackendContext.Provider value={backend}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackendContext must be used within a BackendProvider');
  }
  return context;
}
