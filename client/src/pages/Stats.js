import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaTrophy } from 'react-icons/fa';
import { statsAPI } from '../services/api';
import SortableTable from '../components/SortableTable';

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

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #c3ac83;
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
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Don't show error banner for empty data
        setSeasonStats({ batting_leaders: [], pitching_leaders: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const battingColumns = [
    { key: 'player.full_name', label: 'Player' },
    { key: 'batting_average', label: 'AVG' },
    { key: 'hits', label: 'H' },
    { key: 'home_runs', label: 'HR' },
    { key: 'runs_batted_in', label: 'RBI' },
    { key: 'runs_scored', label: 'R' },
    { key: 'stolen_bases', label: 'SB' }
  ];

  const pitchingColumns = [
    { key: 'player.full_name', label: 'Player' },
    { key: 'wins', label: 'W' },
    { key: 'losses', label: 'L' },
    { key: 'era', label: 'ERA' },
    { key: 'innings_pitched', label: 'IP' },
    { key: 'strikeouts', label: 'SO' },
    { key: 'saves', label: 'S' }
  ];

  if (loading) {
    return <LoadingMessage>Loading statistics...</LoadingMessage>;
  }

  return (
    <StatsContainer>
      <PageTitle>Team Statistics</PageTitle>
      
      {seasonStats.batting_leaders && seasonStats.batting_leaders.length > 0 && (
        <StatsSection>
          <SectionTitle>
            <FaChartBar style={{ marginRight: '0.5rem' }} />
            Batting Leaders
          </SectionTitle>
          <SortableTable
            data={seasonStats.batting_leaders}
            columns={battingColumns}
            defaultSort="batting_average"
            defaultSortDirection="desc"
          />
        </StatsSection>
      )}

      {seasonStats.pitching_leaders && seasonStats.pitching_leaders.length > 0 && (
        <StatsSection>
          <SectionTitle>
            <FaTrophy style={{ marginRight: '0.5rem' }} />
            Pitching Leaders
          </SectionTitle>
          <SortableTable
            data={seasonStats.pitching_leaders}
            columns={pitchingColumns}
            defaultSort="era"
            defaultSortDirection="asc"
          />
        </StatsSection>
      )}

      {(!seasonStats.batting_leaders || seasonStats.batting_leaders.length === 0) && 
       (!seasonStats.pitching_leaders || seasonStats.pitching_leaders.length === 0) && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#2C2C2C' }}>No data available</p>
        </div>
      )}
    </StatsContainer>
  );
};

export default Stats; 