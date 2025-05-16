import React from 'react';
import EnergyLogForm from '../components/EnergyLogForm';
import TriggerLogForm from '../components/TriggerLogForm';
import LogHistory from '../components/LogHistory';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Overstimmed</h1>
      <EnergyLogForm />
      <TriggerLogForm />
      <LogHistory />
    </div>
  );
};

export default Home; 