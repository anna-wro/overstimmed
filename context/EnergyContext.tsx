import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnergyLog, getEnergyLogs, saveEnergyLog, TriggerLog, getTriggerLogs, saveTriggerLog } from '../utils/storage';

interface EnergyContextType {
  logs: EnergyLog[];
  triggerLogs: TriggerLog[];
  addLog: (log: EnergyLog) => void;
  addTriggerLog: (log: TriggerLog) => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [triggerLogs, setTriggerLogs] = useState<TriggerLog[]>([]);

  useEffect(() => {
    setLogs(getEnergyLogs());
    setTriggerLogs(getTriggerLogs());
  }, []);

  const addLog = (log: EnergyLog) => {
    saveEnergyLog(log);
    setLogs(getEnergyLogs());
  };

  const addTriggerLog = (log: TriggerLog) => {
    saveTriggerLog(log);
    setTriggerLogs(getTriggerLogs());
  };

  return (
    <EnergyContext.Provider value={{ logs, triggerLogs, addLog, addTriggerLog }}>
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
}; 