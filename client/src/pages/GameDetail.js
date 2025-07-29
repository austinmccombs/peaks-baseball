import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { gamesAPI } from '../services/api';
import AddGameStats from '../components/AddGameStats';

const GameDetailContainer = styled.div`
  padding: 2rem 0;
`;

const GameHeader = styled.div`
  background: #c3ac83;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 2px solid #2C2C2C;
`;

const GameDate = styled.div`
  font-size: 1.5rem;
  color: #2C2C2C;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  color: #2C2C2C;
  margin-bottom: 1rem;
`;

const GameScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const GameResult = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2C2C2C;
  margin-bottom: 1rem;
`;

const GameLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2C2C;
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const GameNotes = styled.p`
  color: #2C2C2C;
  opacity: 0.8;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsSection = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid #c3ac83;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #c3ac83;
  margin-bottom: 1.5rem;
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background: #2C2C2C;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #c3ac83;
  border-bottom: 1px solid #c3ac83;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #c3ac83;
  color: #c3ac83;
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

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGame = async () => {
    try {
      const [gameResponse, statsResponse] = await Promise.all([
        gamesAPI.getById(id),
        gamesAPI.getStats(id)
      ]);
      setGame(gameResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load game data');
      console.error('Error fetching game:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [id]);

  const handleStatsAdded = () => {
    // Refresh the stats when new stats are added
    fetchGame();
  };

  if (loading) {
    return <LoadingMessage>Loading game data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!game) {
    return <ErrorMessage>Game not found</ErrorMessage>;
  }

  return (
    <GameDetailContainer>
      <GameHeader>
        <GameDate>{game.formatted_date}</GameDate>
        <GameTitle>vs {game.opponent}</GameTitle>
        <GameScore>{game.score_display}</GameScore>
        <GameResult>Result: {game.game_result}</GameResult>
        {game.location && (
          <GameLocation>
            <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
            {game.location}
          </GameLocation>
        )}
        {game.notes && <GameNotes>{game.notes}</GameNotes>}
      </GameHeader>

      <StatsSection>
        <SectionTitle>Player Statistics</SectionTitle>
        {stats.length > 0 ? (
          <StatsTable>
            <thead>
              <tr>
                <TableHeader>Player</TableHeader>
                <TableHeader>AB</TableHeader>
                <TableHeader>H</TableHeader>
                <TableHeader>R</TableHeader>
                <TableHeader>RBI</TableHeader>
                <TableHeader>AVG</TableHeader>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id}>
                  <TableCell>{stat.player?.full_name}</TableCell>
                  <TableCell>{stat.at_bats}</TableCell>
                  <TableCell>{stat.hits}</TableCell>
                  <TableCell>{stat.runs_scored}</TableCell>
                  <TableCell>{stat.runs_batted_in}</TableCell>
                  <TableCell>{stat.batting_average}</TableCell>
                </tr>
              ))}
            </tbody>
          </StatsTable>
        ) : (
          <p style={{ color: '#c3ac83' }}>No statistics available for this game.</p>
        )}
      </StatsSection>

      <AddGameStats gameId={id} onStatsAdded={handleStatsAdded} />
    </GameDetailContainer>
  );
};

export default GameDetail; 