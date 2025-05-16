import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { EnergyLog, TriggerLog } from '../utils/storage';

const LogHistory: React.FC = () => {
  const { logs, triggerLogs } = useEnergy();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Log History</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Energy Logs</h3>
        {logs.length === 0 ? (
          <p>No energy logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log: EnergyLog) => (
              <li key={log.id} className="p-2 bg-gray-100 rounded">
                <p>Energy Level: {log.energyLevel}</p>
                <p>Notes: {log.notes}</p>
                <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Trigger Logs</h3>
        {triggerLogs.length === 0 ? (
          <p>No trigger logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {triggerLogs.map((log: TriggerLog) => (
              <li key={log.id} className="p-2 bg-gray-100 rounded">
                <p>Trigger Type: {log.triggerType}</p>
                <p>Description: {log.description}</p>
                <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogHistory; 