import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import MethodologyPage from './pages/MethodologyPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [activeResult, setActiveResult] = useState(null);

  const handleSelectRecord = (record) => {
    setActiveResult(record);
    setActivePage('analyze');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col cyber-grid radial-glow selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (page !== 'analyze') {
            // Keep active result in state so user can return to it if needed
          }
          setActivePage(page);
        }}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'landing' && (
          <LandingPage setActivePage={setActivePage} />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
            onSelectRecord={handleSelectRecord}
          />
        )}

        {activePage === 'analyze' && (
          <AnalyzePage
            activeResult={activeResult}
            setActiveResult={setActiveResult}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            setActivePage={setActivePage}
            onSelectRecord={handleSelectRecord}
          />
        )}

        {activePage === 'methodology' && (
          <MethodologyPage />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
