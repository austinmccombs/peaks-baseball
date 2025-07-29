import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { statsAPI, playersAPI, gamesAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaChartBar } from 'react-icons/fa';
import Modal from './Modal';

const ManagerContainer = styled.div`
  background: #2C2C2C;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #c3ac83;
`;

const ManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ManagerTitle = styled.h3`
  color: #c3ac83;
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #c3ac83;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #b5a075;
  }
`;

const AddButton = styled.button`
  background: #c3ac83;
  color: #2C2C2C;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b5a075;
    transform: translateY(-2px);
  }
`;

const Form = styled.form`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #c3ac83;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #c3ac83;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #c3ac83;
  border-radius: 4px;
  background: #2C2C2C;
  color: #c3ac83;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #b5a075;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #c3ac83;
  border-radius: 4px;
  background: #2C2C2C;
  color: #c3ac83;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #b5a075;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: #c3ac83;
  color: #2C2C2C;
  
  &:hover {
    background: #b5a075;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #5a6268;
  }
`;

const StatsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #c3ac83;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatInfo = styled.div`
  color: #c3ac83;
`;

const StatTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #c3ac83;
`;

const StatDetails = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #c3ac83;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1a1a1a;
    color: ${props => props.danger ? '#dc3545' : '#b5a075'};
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: white;
  background: ${props => props.success ? '#28a745' : '#dc3545'};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  background: #2C2C2C;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
`;

const StatLabel = styled.div`
  color: #c3ac83;
  opacity: 0.8;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  color: #c3ac83;
  font-weight: 600;
`;

const SectionTitle = styled.h5`
  color: #c3ac83;
  margin: 1rem 0 0.5rem 0;
  font-size: 1rem;
`;

const StatsManager = ({ onClose }) => {
  const [stats, setStats] = useState([]);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    game_id: '',
    // Batting stats
    at_bats: '',
    hits: '',
    doubles: '',
    triples: '',
    home_runs: '',
    runs_batted_in: '',
    runs_scored: '',
    walks: '',
    strikeouts: '',
    stolen_bases: '',
    hit_by_pitch: '',
    // Pitching stats
    innings_pitched: '',
    earned_runs: '',
    hits_allowed: '',
    walks_allowed: '',
    strikeouts_pitched: '',
    wins: '',
    losses: '',
    saves: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, playersResponse, gamesResponse] = await Promise.all([
        statsAPI.getAll(),
        playersAPI.getAll(),
        gamesAPI.getAll()
      ]);
      setStats(statsResponse.data);
      setPlayers(playersResponse.data);
      setGames(gamesResponse.data);
    } catch (error) {
      setMessage('Error loading data');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Convert empty strings to 0 for numeric fields
      const processedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] === '') {
          processedData[key] = 0;
        } else {
          processedData[key] = formData[key];
        }
      });

      if (editingStat) {
        await statsAPI.update(editingStat.id, processedData);
        setMessage('Stats updated successfully!');
      } else {
        await statsAPI.create(processedData);
        setMessage('Stats created successfully!');
      }
      setIsModalOpen(false);
      setEditingStat(null);
      resetForm();
      loadData();
    } catch (error) {
      setMessage('Error saving stats');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stat) => {
    setEditingStat(stat);
    setFormData({
      player_id: stat.player_id,
      game_id: stat.game_id,
      at_bats: stat.at_bats || '',
      hits: stat.hits || '',
      doubles: stat.doubles || '',
      triples: stat.triples || '',
      home_runs: stat.home_runs || '',
      runs_batted_in: stat.runs_batted_in || '',
      runs_scored: stat.runs_scored || '',
      walks: stat.walks || '',
      strikeouts: stat.strikeouts || '',
      stolen_bases: stat.stolen_bases || '',
      hit_by_pitch: stat.hit_by_pitch || '',
      innings_pitched: stat.innings_pitched || '',
      earned_runs: stat.earned_runs || '',
      hits_allowed: stat.hits_allowed || '',
      walks_allowed: stat.walks_allowed || '',
      strikeouts_pitched: stat.strikeouts_pitched || '',
      wins: stat.wins || '',
      losses: stat.losses || '',
      saves: stat.saves || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (statId) => {
    if (window.confirm('Are you sure you want to delete these stats?')) {
      try {
        await statsAPI.delete(statId);
        setMessage('Stats deleted successfully!');
        loadData();
      } catch (error) {
        setMessage('Error deleting stats');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      player_id: '',
      game_id: '',
      at_bats: '',
      hits: '',
      doubles: '',
      triples: '',
      home_runs: '',
      runs_batted_in: '',
      runs_scored: '',
      walks: '',
      strikeouts: '',
      stolen_bases: '',
      hit_by_pitch: '',
      innings_pitched: '',
      earned_runs: '',
      hits_allowed: '',
      walks_allowed: '',
      strikeouts_pitched: '',
      wins: '',
      losses: '',
      saves: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.display_name : 'Unknown Player';
  };

  const getGameInfo = (gameId) => {
    const game = games.find(g => g.id === gameId);
    return game ? `${game.opponent} - ${new Date(game.game_date).toLocaleDateString()}` : 'Unknown Game';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ManagerContainer>
      <ManagerHeader>
        <ManagerTitle>Manage Player Stats</ManagerTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => {
            setIsModalOpen(true);
            setEditingStat(null);
            resetForm();
          }}>
            <FaPlus />
            Add Stats
          </AddButton>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </div>
      </ManagerHeader>

      {message && (
        <Message success={message.includes('successfully')}>
          {message}
        </Message>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStat(null);
          resetForm();
        }}
        title={editingStat ? 'Edit Player Stats' : 'Add Player Stats'}
        onSave={handleSubmit}
        saveText={editingStat ? 'Update Stats' : 'Add Stats'}
        loading={loading}
        width="800px"
      >
          
          <FormGrid>
            <FormGroup>
              <Label>Player</Label>
              <Select
                name="player_id"
                value={formData.player_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Player</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.display_name}
                  </option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Game</Label>
              <Select
                name="game_id"
                value={formData.game_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Game</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.opponent} - {formatDate(game.game_date)}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormGrid>

          <SectionTitle>Batting Stats</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>At Bats</Label>
              <Input
                type="number"
                name="at_bats"
                value={formData.at_bats}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Hits</Label>
              <Input
                type="number"
                name="hits"
                value={formData.hits}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Doubles</Label>
              <Input
                type="number"
                name="doubles"
                value={formData.doubles}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Triples</Label>
              <Input
                type="number"
                name="triples"
                value={formData.triples}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Home Runs</Label>
              <Input
                type="number"
                name="home_runs"
                value={formData.home_runs}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>RBI</Label>
              <Input
                type="number"
                name="runs_batted_in"
                value={formData.runs_batted_in}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Runs Scored</Label>
              <Input
                type="number"
                name="runs_scored"
                value={formData.runs_scored}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Walks</Label>
              <Input
                type="number"
                name="walks"
                value={formData.walks}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Strikeouts</Label>
              <Input
                type="number"
                name="strikeouts"
                value={formData.strikeouts}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Stolen Bases</Label>
              <Input
                type="number"
                name="stolen_bases"
                value={formData.stolen_bases}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Hit by Pitch</Label>
              <Input
                type="number"
                name="hit_by_pitch"
                value={formData.hit_by_pitch}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
          </FormGrid>

          <SectionTitle>Pitching Stats</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>Innings Pitched</Label>
              <Input
                type="number"
                name="innings_pitched"
                value={formData.innings_pitched}
                onChange={handleInputChange}
                min="0"
                step="0.1"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Earned Runs</Label>
              <Input
                type="number"
                name="earned_runs"
                value={formData.earned_runs}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Hits Allowed</Label>
              <Input
                type="number"
                name="hits_allowed"
                value={formData.hits_allowed}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Walks Allowed</Label>
              <Input
                type="number"
                name="walks_allowed"
                value={formData.walks_allowed}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Strikeouts (Pitching)</Label>
              <Input
                type="number"
                name="strikeouts_pitched"
                value={formData.strikeouts_pitched}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Wins</Label>
              <Input
                type="number"
                name="wins"
                value={formData.wins}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Losses</Label>
              <Input
                type="number"
                name="losses"
                value={formData.losses}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Saves</Label>
              <Input
                type="number"
                name="saves"
                value={formData.saves}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
          </FormGrid>
          
      </Modal>

      <StatsList>
        {stats.map(stat => (
          <StatCard key={stat.id}>
            <StatHeader>
              <StatInfo>
                <StatTitle>{getPlayerName(stat.player_id)}</StatTitle>
                <StatDetails>{getGameInfo(stat.game_id)}</StatDetails>
              </StatInfo>
              <ActionButtons>
                <IconButton onClick={() => handleEdit(stat)}>
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDelete(stat.id)} danger>
                  <FaTrash />
                </IconButton>
              </ActionButtons>
            </StatHeader>
            
            <StatsGrid>
              {stat.at_bats > 0 && (
                <>
                  <StatItem>
                    <StatLabel>AB</StatLabel>
                    <StatValue>{stat.at_bats}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>H</StatLabel>
                    <StatValue>{stat.hits}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>AVG</StatLabel>
                    <StatValue>{stat.batting_average}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>HR</StatLabel>
                    <StatValue>{stat.home_runs}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>RBI</StatLabel>
                    <StatValue>{stat.runs_batted_in}</StatValue>
                  </StatItem>
                </>
              )}
              
              {stat.innings_pitched > 0 && (
                <>
                  <StatItem>
                    <StatLabel>IP</StatLabel>
                    <StatValue>{stat.innings_pitched}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>ERA</StatLabel>
                    <StatValue>{stat.era}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>SO</StatLabel>
                    <StatValue>{stat.strikeouts_pitched}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>W</StatLabel>
                    <StatValue>{stat.wins}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>L</StatLabel>
                    <StatValue>{stat.losses}</StatValue>
                  </StatItem>
                </>
              )}
            </StatsGrid>
          </StatCard>
        ))}
      </StatsList>
    </ManagerContainer>
  );
};

export default StatsManager; 