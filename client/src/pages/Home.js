import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall, FaUsers, FaVideo } from 'react-icons/fa';
import { playersAPI, highlightsAPI } from '../services/api';
import Logo from '../components/Logo';

const HomeContainer = styled.div`
  padding: 2rem 0;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: var(--primary-text);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--primary-text);
  opacity: 0.8;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: #2C2C2C;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #c3ac83;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #c3ac83;
  opacity: 0.8;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-text);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const HighlightCard = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const HighlightThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const HighlightContent = styled.div`
  padding: 1.5rem;
`;

const HighlightTitle = styled.h3`
  font-size: 1.2rem;
  color: #c3ac83;
  margin-bottom: 0.5rem;
`;

const HighlightPlayer = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const HighlightDate = styled.p`
  color: #c3ac83;
  opacity: 0.6;
  font-size: 0.9rem;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: var(--accent-color);
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #6B3410;
  }
`;

const ScoreboardSection = styled.div`
  margin-bottom: 3rem;
`;

const ScoreboardTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-text);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ScoreboardWidget = styled.div`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home = () => {
  const [stats, setStats] = useState({
    players: 0,
    games: 0,
    highlights: 0
  });
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, highlightsResponse] = await Promise.all([
          playersAPI.getAll(),
          highlightsAPI.getAll()
        ]);

        setStats({
          players: playersResponse.data.length,
          games: 0, // This would need to be fetched from games API
          highlights: highlightsResponse.data.length
        });

        setRecentHighlights(highlightsResponse.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load GameChanger widget script
  useEffect(() => {
    const loadGameChangerScript = () => {
      // Check if script is already loaded
      if (window.GC) {
        window.GC.team.schedule.init({
          target: "#gc-schedule-widget-0uxd",
          widgetId: "b5a8a24c-489d-42df-9440-3e6c12ebce1d",
          maxVerticalGamesVisible: 4,
        });
        return;
      }

      // Load the script
      const script = document.createElement('script');
      script.src = 'https://widgets.gc.com/static/js/sdk.v1.js';
      script.onload = () => {
        // Initialize the widget once script is loaded
        if (window.GC) {
          window.GC.team.schedule.init({
            target: "#gc-schedule-widget-0uxd",
            widgetId: "b5a8a24c-489d-42df-9440-3e6c12ebce1d",
            maxVerticalGamesVisible: 4,
          });
        }
      };
      document.head.appendChild(script);
    };

    loadGameChangerScript();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <HomeContainer>
      <Hero>
        <Logo />
      </Hero>

      <Section>
        <StatsGrid>
          <StatCard>
            <StatIcon>
              <FaUsers />
            </StatIcon>
            <StatNumber>{stats.players}</StatNumber>
            <StatLabel>Players</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaBaseballBall />
            </StatIcon>
            <StatNumber>{stats.games}</StatNumber>
            <StatLabel>Games</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon>
              <FaVideo />
            </StatIcon>
            <StatNumber>{stats.highlights}</StatNumber>
            <StatLabel>Highlights</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>

      <Section>
        <ScoreboardSection>
          <ScoreboardTitle>Live Schedule & Scores</ScoreboardTitle>
          <ScoreboardWidget>
            <div id="gc-schedule-widget-0uxd"></div>
          </ScoreboardWidget>
        </ScoreboardSection>
      </Section>

      {recentHighlights.length > 0 && (
        <Section>
          <SectionTitle>Recent Highlights</SectionTitle>
          <HighlightsGrid>
            {recentHighlights.map((highlight) => (
              <HighlightCard key={highlight.id}>
                {highlight.thumbnail_url && (
                  <HighlightThumbnail 
                    src={highlight.thumbnail_url} 
                    alt={highlight.title}
                  />
                )}
                <HighlightContent>
                  <HighlightTitle>{highlight.title}</HighlightTitle>
                  <HighlightPlayer>
                    {highlight.player?.full_name || 'Unknown Player'}
                  </HighlightPlayer>
                  <HighlightDate>
                    {new Date(highlight.created_at).toLocaleDateString()}
                  </HighlightDate>
                </HighlightContent>
              </HighlightCard>
            ))}
          </HighlightsGrid>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <CTAButton to="/highlights">View All Highlights</CTAButton>
          </div>
        </Section>
      )}
    </HomeContainer>
  );
};

export default Home; 