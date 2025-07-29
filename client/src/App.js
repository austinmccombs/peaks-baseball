import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Roster from './pages/Roster';
import PlayerDetail from './pages/PlayerDetail';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import Stats from './pages/Stats';
import Highlights from './pages/Highlights';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminSetup from './pages/AdminSetup';
import ProtectedRoute from './components/ProtectedRoute';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--primary-bg);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px 0;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/player/:id" element={<PlayerDetail />} />
              <Route path="/games" element={<Games />} />
              <Route path="/game/:id" element={<GameDetail />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/highlights" element={<Highlights />} />
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
          </div>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App; 