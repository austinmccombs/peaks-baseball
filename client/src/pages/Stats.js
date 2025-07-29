import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaTrophy } from 'react-icons/fa';
import { statsAPI } from '../services/api';

const StatsContainer = styled.div`
  padding: 2rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #c3ac83;
  margin-bottom: 2rem;
  text-align: center;
`;

const StatsSection = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #c3ac83;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #c3ac83;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
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
  cursor: pointer;
  border-bottom: 1px solid #c3ac83;
  
  &:hover {
    background: #3a3a3a;
  }
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

const Stats = () => {
  const [seasonStats, setSeasonStats] = useState({ batting_leaders: [], pitching_leaders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getSeasonStats(2024);
        setSeasonStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading statistics...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <StatsContainer>
      <PageTitle>Team Statistics</PageTitle>
      
      <StatsSection>
        <SectionTitle>
          <FaChartBar style={{ marginRight: '0.5rem' }} />
          Batting Leaders
        </SectionTitle>
        <StatsTable>
          <thead>
            <tr>
              <TableHeader>Player</TableHeader>
              <TableHeader>AVG</TableHeader>
              <TableHeader>H</TableHeader>
              <TableHeader>HR</TableHeader>
              <TableHeader>RBI</TableHeader>
              <TableHeader>R</TableHeader>
              <TableHeader>SB</TableHeader>
            </tr>
          </thead>
          <tbody>
            {seasonStats.batting_leaders?.slice(0, 10).map((stat, index) => (
              <tr key={index}>
                <TableCell>{stat.player?.full_name}</TableCell>
                <TableCell>{stat.batting_average || '.000'}</TableCell>
                <TableCell>{stat.hits || 0}</TableCell>
                <TableCell>{stat.home_runs || 0}</TableCell>
                <TableCell>{stat.runs_batted_in || 0}</TableCell>
                <TableCell>{stat.runs_scored || 0}</TableCell>
                <TableCell>{stat.stolen_bases || 0}</TableCell>
              </tr>
            ))}
          </tbody>
        </StatsTable>
      </StatsSection>

      <StatsSection>
        <SectionTitle>
          <FaTrophy style={{ marginRight: '0.5rem' }} />
          Pitching Leaders
        </SectionTitle>
        <StatsTable>
                      <thead>
              <tr>
                <TableHeader>Player</TableHeader>
                <TableHeader>W</TableHeader>
                <TableHeader>L</TableHeader>
                <TableHeader>ERA</TableHeader>
                <TableHeader>IP</TableHeader>
                <TableHeader>SO</TableHeader>
                <TableHeader>S</TableHeader>
              </tr>
            </thead>
            <tbody>
              {seasonStats.pitching_leaders?.slice(0, 10).map((stat, index) => (
                <tr key={index}>
                  <TableCell>{stat.player?.full_name}</TableCell>
                  <TableCell>{stat.wins || 0}</TableCell>
                  <TableCell>{stat.losses || 0}</TableCell>
                  <TableCell>{stat.era || '0.00'}</TableCell>
                  <TableCell>{stat.innings_pitched || 0}</TableCell>
                  <TableCell>{stat.strikeouts || 0}</TableCell>
                  <TableCell>{stat.saves || 0}</TableCell>
                </tr>
              ))}
            </tbody>
        </StatsTable>
      </StatsSection>
    </StatsContainer>
  );
};

export default Stats; 