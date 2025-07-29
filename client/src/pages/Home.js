import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall, FaUsers, FaVideo, FaSpinner } from 'react-icons/fa';
import { playersAPI, highlightsAPI, gamesAPI } from '../services/api';
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
  background: #2C2C2C;
  border-radius: 8px;
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c3ac83;
  font-size: 1.1rem;
  
  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const WidgetError = styled.div`
  text-align: center;
  color: #c3ac83;
  opacity: 0.8;
  font-size: 1rem;
`;

const WidgetContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const Home = () => {
  const [stats, setStats] = useState({
    players: 0,
    record: { wins: 0, losses: 0 },
    highlights: 0
  });
  const [recentHighlights, setRecentHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [widgetLoading, setWidgetLoading] = useState(true);
  const [widgetError, setWidgetError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, highlightsResponse, gamesResponse] = await Promise.all([
          playersAPI.getAll(),
          highlightsAPI.getAll(),
          gamesAPI.getAll()
        ]);

        // Calculate team record
        let wins = 0;
        let losses = 0;
        gamesResponse.data.forEach(game => {
          if (game.game_result === 'W') {
            wins++;
          } else if (game.game_result === 'L') {
            losses++;
          }
        });

        setStats({
          players: playersResponse.data.length,
          record: { wins, losses },
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

  // Optimized GameChanger widget loading
  useEffect(() => {
    let scriptLoaded = false;
    let timeoutId;

    const loadGameChangerScript = async () => {
      try {
        // Check if script is already loaded
        if (window.GC) {
          initializeWidget();
          return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src*="widgets.gc.com"]')) {
          // Wait for existing script to load
          const checkInterval = setInterval(() => {
            if (window.GC) {
              clearInterval(checkInterval);
              initializeWidget();
            }
          }, 100);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            setWidgetError(true);
            setWidgetLoading(false);
          }, 10000);
          return;
        }

        // Load the script with timeout
        const script = document.createElement('script');
        script.src = 'https://widgets.gc.com/static/js/sdk.v1.js';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          scriptLoaded = true;
          initializeWidget();
        };
        
        script.onerror = () => {
          setWidgetError(true);
          setWidgetLoading(false);
        };

        // Set timeout for script loading
        timeoutId = setTimeout(() => {
          if (!scriptLoaded) {
            setWidgetError(true);
            setWidgetLoading(false);
          }
        }, 8000); // 8 second timeout

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading GameChanger widget:', error);
        setWidgetError(true);
        setWidgetLoading(false);
      }
    };

    const initializeWidget = () => {
      try {
        if (window.GC && window.GC.team && window.GC.team.schedule) {
          window.GC.team.schedule.init({
            target: "#gc-schedule-widget-0uxd",
            widgetId: "b5a8a24c-489d-42df-9440-3e6c12ebce1d",
            maxVerticalGamesVisible: 4,
          });
          setWidgetLoading(false);
        } else {
          setWidgetError(true);
          setWidgetLoading(false);
        }
      } catch (error) {
        console.error('Error initializing GameChanger widget:', error);
        setWidgetError(true);
        setWidgetLoading(false);
      }
    };

    // Load widget after a short delay to prioritize main content
    const widgetTimer = setTimeout(() => {
      loadGameChangerScript();
    }, 1000);

    return () => {
      clearTimeout(widgetTimer);
      clearTimeout(timeoutId);
    };
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
            <StatNumber>{stats.record.wins}-{stats.record.losses}</StatNumber>
            <StatLabel>Record</StatLabel>
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
            <WidgetContainer>
              {widgetLoading && (
                <LoadingSpinner>
                  <FaSpinner />
                  Loading schedule...
                </LoadingSpinner>
              )}
              {widgetError && (
                <WidgetError>
                  Schedule widget temporarily unavailable.
                  <br />
                  <a href="https://gc.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c3ac83', textDecoration: 'underline' }}>
                    View on GameChanger
                  </a>
                </WidgetError>
              )}
              <div id="gc-schedule-widget-0uxd" style={{ display: widgetLoading || widgetError ? 'none' : 'block' }}></div>
            </WidgetContainer>
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