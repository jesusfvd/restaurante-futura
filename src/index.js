import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AuthGate from './components/AuthGate';
import RestauranteApp from './RestauranteModerno'; // Aquí la importación está bien

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate>
      <RestauranteApp />
    </AuthGate>
  </React.StrictMode>
);