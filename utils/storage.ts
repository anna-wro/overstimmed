export interface EnergyLog {
  id: string;
  energyLevel: number;
  notes: string;
  timestamp: string;
}

export interface TriggerLog {
  id: string;
  triggerType: 'positive' | 'neutral' | 'overwhelming';
  description: string;
  timestamp: string;
}

export const saveEnergyLog = (log: EnergyLog): void => {
  const logs = getEnergyLogs();
  logs.push(log);
  localStorage.setItem('energyLogs', JSON.stringify(logs));
};

export const getEnergyLogs = (): EnergyLog[] => {
  const logs = localStorage.getItem('energyLogs');
  return logs ? JSON.parse(logs) : [];
};

export const saveTriggerLog = (log: TriggerLog): void => {
  const logs = getTriggerLogs();
  logs.push(log);
  localStorage.setItem('triggerLogs', JSON.stringify(logs));
};

export const getTriggerLogs = (): TriggerLog[] => {
  const logs = localStorage.getItem('triggerLogs');
  return logs ? JSON.parse(logs) : [];
}; 