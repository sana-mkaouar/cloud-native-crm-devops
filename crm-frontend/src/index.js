import React from 'react';
import { createRoot } from 'react-dom/client';  // ⭐ CHANGEMENT
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);  // ⭐ CHANGEMENT

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);