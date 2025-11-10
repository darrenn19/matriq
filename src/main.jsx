import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Matrix from './pages/matrix';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matrix" element={<Matrix />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
