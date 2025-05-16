import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { EnergyLog } from '../utils/storage';

const EnergyLogForm: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const { addLog } = useEnergy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: EnergyLog = {
      id: Date.now().toString(),
      energyLevel,
      notes,
      timestamp: new Date().toISOString(),
    };
    addLog(log);
    setNotes('');
    setEnergyLevel(5);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Log Your Energy Level</h2>
      <div className="mb-4">
        <label className="block mb-2">Energy Level (1-10):</label>
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(Number(e.target.value))}
          className="w-full"
        />
        <span className="ml-2">{energyLevel}</span>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Log
      </button>
    </form>
  );
};

export default EnergyLogForm; 