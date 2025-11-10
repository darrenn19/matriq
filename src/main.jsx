import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Matrix from "./pages/matrix";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/matriq">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/matrix" element={<Matrix />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
