import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaVideo, FaUser } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { highlightsAPI } from '../services/api';

const HighlightsContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #c3ac83;
  margin-bottom: 2rem;
  text-align: center;
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
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
  border: 1px solid #c3ac83;
  
  &:hover {
    transform: translateY(-5px);
  }
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

const HighlightPlayer = styled.div`
  display: flex;
  align-items: center;
  color: #c3ac83;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const HighlightDate = styled.p`
  color: #c3ac83;
  opacity: 0.7;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const HighlightDescription = styled.p`
  color: #c3ac83;
  opacity: 0.8;
  line-height: 1.5;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #c3ac83;
`;



const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await highlightsAPI.getAll();
        setHighlights(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching highlights:', err);
        // Don't show error banner for empty data
        setHighlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading highlights...</LoadingMessage>;
  }

  return (
    <HighlightsContainer>
      <PageTitle>Team Highlights</PageTitle>
      
      <HighlightsGrid>
        {highlights.map((highlight) => (
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
              <HighlightPlayer>
                <FaUser style={{ marginRight: '0.5rem' }} />
                {highlight.player?.full_name || 'Unknown Player'}
              </HighlightPlayer>
              <HighlightDate>
                {new Date(highlight.created_at).toLocaleDateString()}
              </HighlightDate>
              {highlight.description && (
                <HighlightDescription>{highlight.description}</HighlightDescription>
              )}
            </HighlightContent>
          </HighlightCard>
        ))}
      </HighlightsGrid>
      
      {highlights.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#2C2C2C' }}>No data available</p>
        </div>
      )}
    </HighlightsContainer>
  );
};

export default Highlights; 