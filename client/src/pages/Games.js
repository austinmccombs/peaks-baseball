import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { gamesAPI } from '../services/api';

const GamesContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #2C2C2C;
  margin-bottom: 2rem;
  text-align: center;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const GameCard = styled.div`
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

const GameHeader = styled.div`
  background: #2C2C2C;
  color: #c3ac83;
  padding: 1.5rem;
  text-align: center;
  border-bottom: 2px solid #c3ac83;
`;

const GameDate = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const GameOpponent = styled.h3`
  font-size: 1.5rem;
  margin: 0;
`;

const GameResult = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const GameContent = styled.div`
  padding: 1.5rem;
  background: #2C2C2C;
`;

const GameScore = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: #c3ac83;
`;

const GameLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c3ac83;
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const GameNotes = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const GameActions = styled.div`
  display: flex;
  gap: 0.5rem;
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
  border: 1px solid #2C2C2C;
  
  &:hover {
    background-color: #2C2C2C;
    color: #c3ac83;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: #c3ac83;
  color: #2C2C2C;
  
  &:hover {
    background-color: #2C2C2C;
    color: #c3ac83;
  }
`;

const RecordDisplay = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #2C2C2C;
  border-radius: 8px;
  border: 2px solid #c3ac83;
`;

const RecordTitle = styled.h2`
  font-size: 1.5rem;
  color: #c3ac83;
  margin-bottom: 1rem;
`;

const RecordStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #c3ac83;
`;

const RecordItem = styled.div`
  text-align: center;
`;

const RecordNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #c3ac83;
`;

const RecordLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #c3ac83;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background: #FFEBEE;
  border-radius: 8px;
  margin: 2rem 0;
`;

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate team record
  const calculateRecord = () => {
    let wins = 0;
    let losses = 0;
    
    games.forEach(game => {
      if (game.game_result === 'W') {
        wins++;
      } else if (game.game_result === 'L') {
        losses++;
      }
    });
    
    return { wins, losses };
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await gamesAPI.getAll();
        setGames(response.data);
      } catch (err) {
        setError('Failed to load games data');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading games...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const record = calculateRecord();

  return (
    <GamesContainer>
      <RecordDisplay>
        <RecordTitle>Season Record</RecordTitle>
        <RecordStats>
          <RecordItem>
            <RecordNumber>{record.wins}</RecordNumber>
            <RecordLabel>Wins</RecordLabel>
          </RecordItem>
          <RecordItem>
            <RecordNumber>{record.losses}</RecordNumber>
            <RecordLabel>Losses</RecordLabel>
          </RecordItem>
        </RecordStats>
      </RecordDisplay>
      
      <GamesGrid>
        {games.map((game) => (
          <GameCard key={game.id}>
            <GameHeader>
              <GameDate>{game.formatted_date}</GameDate>
              <GameOpponent>vs {game.opponent}</GameOpponent>
              <GameResult>{game.game_result}</GameResult>
            </GameHeader>
            
            <GameContent>
              <GameScore>
                {game.score_display}
              </GameScore>
              
              {game.location && (
                <GameLocation>
                  <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                  {game.location}
                </GameLocation>
              )}
              
              {game.notes && <GameNotes>{game.notes}</GameNotes>}
              
              <GameActions>
                <ActionButton to={`/game/${game.id}`}>
                  <FaBaseballBall /> View Details
                </ActionButton>
              </GameActions>
            </GameContent>
          </GameCard>
        ))}
      </GamesGrid>
      
      {games.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No games found.</p>
        </div>
      )}
    </GamesContainer>
  );
};

export default Games; 