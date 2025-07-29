import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserPlus, FaGamepad, FaChartBar, FaVideo, FaSignOutAlt } from 'react-icons/fa';
import PlayerManager from '../components/admin/PlayerManager';
import GameManager from '../components/admin/GameManager';
import StatsManager from '../components/admin/StatsManager';
import HighlightsManager from '../components/admin/HighlightsManager';

const AdminContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #c3ac83;
  margin-bottom: 2rem;
  text-align: center;
`;

const LogoutButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border: 2px solid #c3ac83;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
  z-index: 1000;
  
  &:hover {
    background: linear-gradient(135deg, #A0522D 0%, #CD853F 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
    border-color: #b5a075;
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 10px rgba(139, 69, 19, 0.3);
  }
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const AdminCard = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid #c3ac83;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  color: #c3ac83;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #c3ac83;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const AdminButton = styled.button`
  background: #c3ac83;
  color: #2C2C2C;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b5a075;
    transform: translateY(-2px);
  }
`;

const Admin = () => {
  const [activeManager, setActiveManager] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    // Dispatch custom event to notify header of logout
    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/admin/login');
  };

  const adminFeatures = [
    {
      icon: <FaUserPlus />,
      title: 'Manage Players',
      description: 'Add, edit, or remove players from the roster. Update player information and statistics.',
      action: () => setActiveManager('player')
    },
    {
      icon: <FaGamepad />,
      title: 'Manage Games',
      description: 'Add new games, update scores, and manage game information.',
      action: () => setActiveManager('game')
    },
    {
      icon: <FaChartBar />,
      title: 'Manage Stats',
      description: 'Enter and update player statistics for individual games.',
      action: () => setActiveManager('stats')
    },
    {
      icon: <FaVideo />,
      title: 'Manage Highlights',
      description: 'Upload and manage video highlights for players.',
      action: () => setActiveManager('highlights')
    }
  ];

  const renderManager = () => {
    switch (activeManager) {
      case 'player':
        return <PlayerManager onClose={() => setActiveManager(null)} />;
      case 'game':
        return <GameManager onClose={() => setActiveManager(null)} />;
      case 'stats':
        return <StatsManager onClose={() => setActiveManager(null)} />;
      case 'highlights':
        return <HighlightsManager onClose={() => setActiveManager(null)} />;
      default:
        return null;
    }
  };

  return (
    <AdminContainer>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </LogoutButton>
      <PageTitle>Admin Panel</PageTitle>
      
      {!activeManager ? (
        <AdminGrid>
          {adminFeatures.map((feature, index) => (
            <AdminCard key={index}>
              <CardIcon>{feature.icon}</CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
              <AdminButton onClick={feature.action}>
                Manage {feature.title.split(' ')[1]}
              </AdminButton>
            </AdminCard>
          ))}
        </AdminGrid>
      ) : (
        renderManager()
      )}
    </AdminContainer>
  );
};

export default Admin; 