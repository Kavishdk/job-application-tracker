import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { JobDetail } from './pages/JobDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/job/:id" element={<JobDetail />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
