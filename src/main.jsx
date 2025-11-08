import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
//import TopicView from './pages/TopicView'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* <Route path="/topic/:topicId" element={<TopicView />} /> */}
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
