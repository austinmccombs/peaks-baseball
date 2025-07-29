import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaBaseballBall, FaChartBar, FaUsers } from 'react-icons/fa';
import { playersAPI } from '../services/api';

const RosterContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-text);
  margin-bottom: 2rem;
  text-align: center;
`;

const RosterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PlayerCard = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform 0.3s ease;
  border: 2px solid #2C2C2C;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PlayerHeader = styled.div`
  background: #c3ac83;
  color: #2C2C2C;
  padding: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #2C2C2C;
`;

const JerseyNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PlayerName = styled.h3`
  font-size: 1.5rem;
  margin: 0;
`;

const PlayerPosition = styled.p`
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
`;

const PlayerContent = styled.div`
  padding: 1.5rem;
  background: #2C2C2C;
`;

const PlayerBio = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.5;
  height: 4.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: #c3ac83;
  border-radius: 4px;
`;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2C2C2C;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #2C2C2C;
  opacity: 0.7;
`;

const PlayerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  background: #c3ac83;
  color: #2C2C2C;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #b5a075;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: var(--secondary-bg);
  color: var(--primary-text);
  
  &:hover {
    background-color: #D0C0A8;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--primary-text);
`;



const Roster = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await playersAPI.getRosterStats();
        setPlayers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching players:', err);
        // Don't show error banner for empty data
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading roster...</LoadingMessage>;
  }

  // Show empty state when no players
  if (players.length === 0) {
    return (
      <RosterContainer>
        <PageTitle>Team Roster</PageTitle>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#2C2C2C' }}>No data available</p>
        </div>
      </RosterContainer>
    );
  }

  return (
    <RosterContainer>
      <PageTitle>Team Roster</PageTitle>
      
      <RosterGrid>
        {players.map((player) => (
          <PlayerCard key={player.id}>
            <PlayerHeader>
              <JerseyNumber>#{player.jersey_number}</JerseyNumber>
              <PlayerName>{player.full_name}</PlayerName>
              <PlayerPosition>{player.position}</PlayerPosition>
            </PlayerHeader>
            
            <PlayerContent>
              {player.bio && <PlayerBio>{player.bio}</PlayerBio>}
              
              {player.season_stats && (
                <StatsGrid>
                  <StatItem>
                    <StatValue>{player.season_stats.games_played || 0}</StatValue>
                    <StatLabel>Games</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.season_stats.batting_average || '.000'}</StatValue>
                    <StatLabel>AVG</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.season_stats.hits || 0}</StatValue>
                    <StatLabel>Hits</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{player.season_stats.home_runs || 0}</StatValue>
                    <StatLabel>HR</StatLabel>
                  </StatItem>
                </StatsGrid>
              )}
              
              <PlayerActions>
                <ActionButton to={`/player/${player.id}`}>
                  <FaUser /> View Profile
                </ActionButton>
              </PlayerActions>
            </PlayerContent>
          </PlayerCard>
        ))}
      </RosterGrid>
    </RosterContainer>
  );
};

export default Roster; 