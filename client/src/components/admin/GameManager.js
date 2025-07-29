import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gamesAPI, statsAPI, playersAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaChartBar, FaUserPlus } from 'react-icons/fa';
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

const GamesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const GameCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #c3ac83;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameInfo = styled.div`
  color: #c3ac83;
`;

const GameTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #c3ac83;
`;

const GameDetails = styled.p`
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

const StatsSection = styled.div`
  background: #2C2C2C;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  border: 1px solid #c3ac83;
`;

const SectionTitle = styled.h4`
  color: #c3ac83;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const AddStatsButton = styled.button`
  background: #c3ac83;
  color: #2C2C2C;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b5a075;
  }
`;

const RemoveStatsButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c82333;
  }
`;

const StatsCard = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #c3ac83;
  margin-bottom: 1rem;
`;

const StatsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PlayerSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #c3ac83;
  border-radius: 4px;
  background: #2C2C2C;
  color: #c3ac83;
  font-size: 0.9rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #b5a075;
  }
`;

const GameManager = ({ onClose }) => {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    game_date: '',
    season: new Date().getFullYear(),
    home_team: true,
    team_score: '',
    opponent_score: '',
    notes: '',
    location: ''
  });
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    loadGames();
    loadPlayers();
  }, []);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getAll();
      setGames(response.data);
    } catch (error) {
      setMessage('Error loading games');
    }
  };

  const loadPlayers = async () => {
    try {
      const response = await playersAPI.getAll();
      setPlayers(response.data);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let gameId;
      
      if (editingGame) {
        await gamesAPI.update(editingGame.id, formData);
        setMessage('Game updated successfully!');
        gameId = editingGame.id;
      } else {
        const gameResponse = await gamesAPI.create(formData);
        console.log('Game response:', gameResponse);
        gameId = gameResponse.data.id;
        console.log('Game ID:', gameId);
        setMessage('Game created successfully!');
      }

      // Add player stats if any exist
      if (playerStats.length > 0 && gameId) {
        console.log('Creating stats for game ID:', gameId);
        console.log('Player stats to create:', playerStats);
        
        for (const stat of playerStats) {
          if (stat.player_id && stat.player_id !== '') {
            const processedStat = {
              ...stat,
              game_id: gameId,
              at_bats: stat.at_bats === '' ? 0 : parseInt(stat.at_bats),
              hits: stat.hits === '' ? 0 : parseInt(stat.hits),
              doubles: stat.doubles === '' ? 0 : parseInt(stat.doubles),
              triples: stat.triples === '' ? 0 : parseInt(stat.triples),
              home_runs: stat.home_runs === '' ? 0 : parseInt(stat.home_runs),
              runs_batted_in: stat.runs_batted_in === '' ? 0 : parseInt(stat.runs_batted_in),
              runs_scored: stat.runs_scored === '' ? 0 : parseInt(stat.runs_scored),
              walks: stat.walks === '' ? 0 : parseInt(stat.walks),
              strikeouts: stat.strikeouts === '' ? 0 : parseInt(stat.strikeouts),
              stolen_bases: stat.stolen_bases === '' ? 0 : parseInt(stat.stolen_bases),
              hit_by_pitch: stat.hit_by_pitch === '' ? 0 : parseInt(stat.hit_by_pitch),
              innings_pitched: stat.innings_pitched === '' ? 0 : parseFloat(stat.innings_pitched),
              earned_runs: stat.earned_runs === '' ? 0 : parseInt(stat.earned_runs),
              hits_allowed: stat.hits_allowed === '' ? 0 : parseInt(stat.hits_allowed),
              walks_allowed: stat.walks_allowed === '' ? 0 : parseInt(stat.walks_allowed),
              strikeouts_pitched: stat.strikeouts_pitched === '' ? 0 : parseInt(stat.strikeouts_pitched),
              wins: stat.wins === '' ? 0 : parseInt(stat.wins),
              losses: stat.losses === '' ? 0 : parseInt(stat.losses),
              saves: stat.saves === '' ? 0 : parseInt(stat.saves)
            };
            console.log('Creating stat:', processedStat);
            const statResponse = await statsAPI.create(processedStat);
            console.log('Stat creation response:', statResponse);
          }
        }
        setMessage('Game and player stats created successfully!');
      }

      setIsModalOpen(false);
      setEditingGame(null);
      resetForm();
      setPlayerStats([]);
      loadGames();
    } catch (error) {
      console.error('Error saving game:', error);
      setMessage('Error saving game: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      opponent: game.opponent,
      game_date: game.game_date,
      season: game.season,
      home_team: game.home_team,
      team_score: game.team_score || '',
      opponent_score: game.opponent_score || '',
      notes: game.notes || '',
      location: game.location || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await gamesAPI.delete(gameId);
        setMessage('Game deleted successfully!');
        loadGames();
      } catch (error) {
        setMessage('Error deleting game');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      opponent: '',
      game_date: '',
      season: new Date().getFullYear(),
      home_team: true,
      team_score: '',
      opponent_score: '',
      notes: '',
      location: ''
    });
    setPlayerStats([]);
  };

  const addPlayerStats = () => {
    setPlayerStats([...playerStats, {
      player_id: '',
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
    }]);
  };

  const removePlayerStats = (index) => {
    setPlayerStats(playerStats.filter((_, i) => i !== index));
  };

  const updatePlayerStats = (index, field, value) => {
    const updatedStats = [...playerStats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setPlayerStats(updatedStats);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getScoreDisplay = (game) => {
    if (game.team_score !== null && game.opponent_score !== null) {
      return `${game.team_score} - ${game.opponent_score}`;
    }
    return 'TBD';
  };

  return (
    <ManagerContainer>
      <ManagerHeader>
        <ManagerTitle>Manage Games</ManagerTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => {
            setIsModalOpen(true);
            setEditingGame(null);
            resetForm();
            setPlayerStats([]);
          }}>
            <FaPlus />
            Add Game
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
          setEditingGame(null);
          resetForm();
          setPlayerStats([]);
        }}
        title={editingGame ? 'Edit Game' : 'Add New Game'}
        onSave={handleSubmit}
        saveText={editingGame ? 'Update Game' : 'Add Game'}
        loading={loading}
        width="800px"
      >
          
          <FormGrid>
            <FormGroup>
              <Label>Opponent</Label>
              <Input
                type="text"
                name="opponent"
                value={formData.opponent}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Game Date</Label>
              <Input
                type="date"
                name="game_date"
                value={formData.game_date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Season</Label>
              <Input
                type="number"
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Home Field, Away Stadium"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Team Score</Label>
              <Input
                type="number"
                name="team_score"
                value={formData.team_score}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Opponent Score</Label>
              <Input
                type="number"
                name="opponent_score"
                value={formData.opponent_score}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
          </FormGrid>
          
          <FormGroup>
            <Label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="home_team"
                checked={formData.home_team}
                onChange={handleInputChange}
              />
              Home Game
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>Notes</Label>
            <Input
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Game notes, highlights, etc."
            />
          </FormGroup>

          {!editingGame && (
            <StatsSection>
              <SectionTitle>
                <FaChartBar />
                Player Statistics (Optional)
              </SectionTitle>
              
              {playerStats.map((stat, index) => (
                <StatsCard key={index}>
                  <StatsCardHeader>
                    <PlayerSelect
                      value={stat.player_id}
                      onChange={(e) => updatePlayerStats(index, 'player_id', e.target.value)}
                    >
                      <option value="">Select Player</option>
                      {players.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.display_name}
                        </option>
                      ))}
                    </PlayerSelect>
                    <RemoveStatsButton onClick={() => removePlayerStats(index)}>
                      Remove
                    </RemoveStatsButton>
                  </StatsCardHeader>
                  
                  <SectionTitle style={{ fontSize: '1rem', margin: '0.5rem 0' }}>Batting Stats</SectionTitle>
                  <StatsGrid>
                    <FormGroup>
                      <Label>At Bats</Label>
                      <Input
                        type="number"
                        value={stat.at_bats}
                        onChange={(e) => updatePlayerStats(index, 'at_bats', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Hits</Label>
                      <Input
                        type="number"
                        value={stat.hits}
                        onChange={(e) => updatePlayerStats(index, 'hits', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Doubles</Label>
                      <Input
                        type="number"
                        value={stat.doubles}
                        onChange={(e) => updatePlayerStats(index, 'doubles', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Triples</Label>
                      <Input
                        type="number"
                        value={stat.triples}
                        onChange={(e) => updatePlayerStats(index, 'triples', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Home Runs</Label>
                      <Input
                        type="number"
                        value={stat.home_runs}
                        onChange={(e) => updatePlayerStats(index, 'home_runs', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>RBI</Label>
                      <Input
                        type="number"
                        value={stat.runs_batted_in}
                        onChange={(e) => updatePlayerStats(index, 'runs_batted_in', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Runs Scored</Label>
                      <Input
                        type="number"
                        value={stat.runs_scored}
                        onChange={(e) => updatePlayerStats(index, 'runs_scored', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Walks</Label>
                      <Input
                        type="number"
                        value={stat.walks}
                        onChange={(e) => updatePlayerStats(index, 'walks', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Strikeouts</Label>
                      <Input
                        type="number"
                        value={stat.strikeouts}
                        onChange={(e) => updatePlayerStats(index, 'strikeouts', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Stolen Bases</Label>
                      <Input
                        type="number"
                        value={stat.stolen_bases}
                        onChange={(e) => updatePlayerStats(index, 'stolen_bases', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Hit By Pitch</Label>
                      <Input
                        type="number"
                        value={stat.hit_by_pitch}
                        onChange={(e) => updatePlayerStats(index, 'hit_by_pitch', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                  </StatsGrid>
                  
                  <SectionTitle style={{ fontSize: '1rem', margin: '0.5rem 0' }}>Pitching Stats</SectionTitle>
                  <StatsGrid>
                    <FormGroup>
                      <Label>Innings Pitched</Label>
                      <Input
                        type="number"
                        value={stat.innings_pitched}
                        onChange={(e) => updatePlayerStats(index, 'innings_pitched', e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Earned Runs</Label>
                      <Input
                        type="number"
                        value={stat.earned_runs}
                        onChange={(e) => updatePlayerStats(index, 'earned_runs', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Hits Allowed</Label>
                      <Input
                        type="number"
                        value={stat.hits_allowed}
                        onChange={(e) => updatePlayerStats(index, 'hits_allowed', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Walks Allowed</Label>
                      <Input
                        type="number"
                        value={stat.walks_allowed}
                        onChange={(e) => updatePlayerStats(index, 'walks_allowed', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Strikeouts (Pitching)</Label>
                      <Input
                        type="number"
                        value={stat.strikeouts_pitched}
                        onChange={(e) => updatePlayerStats(index, 'strikeouts_pitched', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Wins</Label>
                      <Input
                        type="number"
                        value={stat.wins}
                        onChange={(e) => updatePlayerStats(index, 'wins', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Losses</Label>
                      <Input
                        type="number"
                        value={stat.losses}
                        onChange={(e) => updatePlayerStats(index, 'losses', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Saves</Label>
                      <Input
                        type="number"
                        value={stat.saves}
                        onChange={(e) => updatePlayerStats(index, 'saves', e.target.value)}
                        min="0"
                      />
                    </FormGroup>
                  </StatsGrid>
                </StatsCard>
              ))}
              
              <AddStatsButton onClick={addPlayerStats}>
                <FaUserPlus />
                Add Player Stats
              </AddStatsButton>
            </StatsSection>
          )}
          
      </Modal>

      <GamesList>
        {games.map(game => (
          <GameCard key={game.id}>
            <GameInfo>
              <GameTitle>
                {game.home_team ? 'vs' : '@'} {game.opponent}
              </GameTitle>
              <GameDetails>
                {formatDate(game.game_date)} | Season: {game.season} | 
                Score: {getScoreDisplay(game)}
                {game.location && ` | ${game.location}`}
              </GameDetails>
            </GameInfo>
            <ActionButtons>
              <IconButton onClick={() => handleEdit(game)}>
                <FaEdit />
              </IconButton>
              <IconButton onClick={() => handleDelete(game.id)} danger>
                <FaTrash />
              </IconButton>
            </ActionButtons>
          </GameCard>
        ))}
      </GamesList>
    </ManagerContainer>
  );
};

export default GameManager; 