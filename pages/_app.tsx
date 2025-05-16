import React from 'react';
import { AppProps } from 'next/app';
import { EnergyProvider } from '../context/EnergyContext';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <EnergyProvider>
      <Component {...pageProps} />
    </EnergyProvider>
  );
};

export default MyApp; 