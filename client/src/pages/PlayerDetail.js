import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall, FaVideo, FaChartBar, FaCalendar } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { playersAPI } from '../services/api';
import SortableTable from '../components/SortableTable';

const PlayerDetailContainer = styled.div`
  padding: 2rem 0;
`;

const PlayerHeader = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const JerseyNumber = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const PlayerName = styled.h1`
  font-size: 2.5rem;
  color: #c3ac83;
  margin-bottom: 0.5rem;
`;

const PlayerPosition = styled.p`
  font-size: 1.2rem;
  color: #c3ac83;
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const PlayerBio = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.active ? '#2C2C2C' : '#c3ac83'};
  color: ${props => props.active ? '#c3ac83' : '#2C2C2C'};
  border: ${props => props.active ? 'none' : '2px solid #2C2C2C'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#2C2C2C' : '#2C2C2C'};
    color: #c3ac83;
  }
`;

const TabContent = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #2C2C2C;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #c3ac83;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #c3ac83;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #c3ac83;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const HighlightCard = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #c3ac83;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
`;

const HighlightContent = styled.div`
  padding: 1.5rem;
`;

const HighlightTitle = styled.h3`
  font-size: 1.2rem;
  color: #c3ac83;
  margin-bottom: 0.5rem;
`;

const HighlightDate = styled.p`
  color: #c3ac83;
  opacity: 0.7;
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--primary-text);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
  background: #FFEBEE;
  border-radius: 8px;
  margin: 2rem 0;
`;

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await playersAPI.getById(id);
        setPlayer(response.data);
      } catch (err) {
        setError('Failed to load player data');
        console.error('Error fetching player:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const gameLogColumns = [
    { key: 'game.short_date', label: 'Date' },
    { key: 'game.opponent', label: 'Opponent' },
    { key: 'at_bats', label: 'AB' },
    { key: 'hits', label: 'H' },
    { key: 'runs_scored', label: 'R' },
    { key: 'runs_batted_in', label: 'RBI' },
    { key: 'batting_average', label: 'AVG' }
  ];

  if (loading) {
    return <LoadingMessage>Loading player data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!player) {
    return <ErrorMessage>Player not found</ErrorMessage>;
  }

  const renderStats = () => {
    const stats = player.season_stats_summary || {};
    
    return (
      <div>
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.games_played || 0}</StatValue>
            <StatLabel>Games Played</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.batting_average || '.000'}</StatValue>
            <StatLabel>Batting Average</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.on_base_percentage || '.000'}</StatValue>
            <StatLabel>On-Base %</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.slugging_percentage || '.000'}</StatValue>
            <StatLabel>Slugging %</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.hits || 0}</StatValue>
            <StatLabel>Hits</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.home_runs || 0}</StatValue>
            <StatLabel>Home Runs</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.runs_batted_in || 0}</StatValue>
            <StatLabel>RBI</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.stolen_bases || 0}</StatValue>
            <StatLabel>Stolen Bases</StatLabel>
          </StatCard>
        </StatsGrid>
        
        {player.stats && player.stats.length > 0 && (
          <div>
            <h3>Game Log</h3>
            <SortableTable
              data={player.stats}
              columns={gameLogColumns}
              defaultSort="game.short_date"
              defaultSortDirection="desc"
            />
          </div>
        )}
      </div>
    );
  };

  const renderHighlights = () => {
    return (
      <HighlightsGrid>
        {player.highlights && player.highlights.length > 0 ? (
          player.highlights.map((highlight) => (
            <HighlightCard key={highlight.id}>
              <VideoContainer>
                <ReactPlayer
                  url={highlight.video_embed_url}
                  width="100%"
                  height="100%"
                  controls
                  light={highlight.thumbnail_url}
                />
              </VideoContainer>
              <HighlightContent>
                <HighlightTitle>{highlight.title}</HighlightTitle>
                <HighlightDate>
                  {new Date(highlight.created_at).toLocaleDateString()}
                </HighlightDate>
              </HighlightContent>
            </HighlightCard>
          ))
        ) : (
          <p style={{ color: '#c3ac83' }}>No highlights available for this player.</p>
        )}
      </HighlightsGrid>
    );
  };

  return (
    <PlayerDetailContainer>
      <PlayerHeader>
        <JerseyNumber>#{player.jersey_number}</JerseyNumber>
        <PlayerName>{player.full_name}</PlayerName>
        <PlayerPosition>{player.position}</PlayerPosition>
        {player.bio && <PlayerBio>{player.bio}</PlayerBio>}
      </PlayerHeader>

      <TabsContainer>
        <Tab 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')}
        >
          <FaChartBar /> Stats
        </Tab>
        <Tab 
          active={activeTab === 'highlights'} 
          onClick={() => setActiveTab('highlights')}
        >
          <FaVideo /> Highlights
        </Tab>
      </TabsContainer>

      <TabContent>
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'highlights' && renderHighlights()}
      </TabContent>
    </PlayerDetailContainer>
  );
};

export default PlayerDetail; 