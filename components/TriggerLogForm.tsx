import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { TriggerLog } from '../utils/storage';

const TriggerLogForm: React.FC = () => {
  const [triggerType, setTriggerType] = useState<'positive' | 'neutral' | 'overwhelming'>('neutral');
  const [description, setDescription] = useState<string>('');
  const { addTriggerLog } = useEnergy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: TriggerLog = {
      id: Date.now().toString(),
      triggerType,
      description,
      timestamp: new Date().toISOString(),
    };
    addTriggerLog(log);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Log Sensory Trigger</h2>
      <div className="mb-4">
        <label className="block mb-2">Trigger Type:</label>
        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value as 'positive' | 'neutral' | 'overwhelming')}
          className="w-full p-2 border rounded"
        >
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="overwhelming">Overwhelming</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Trigger Log
      </button>
    </form>
  );
};

export default TriggerLogForm; 