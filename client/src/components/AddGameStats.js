import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { statsAPI, playersAPI } from '../services/api';
import { FaPlus, FaTimes, FaChartBar } from 'react-icons/fa';
import Modal from './admin/Modal';

const AddStatsContainer = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid #c3ac83;
`;

const AddStatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddStatsTitle = styled.h3`
  color: #c3ac83;
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleButton = styled.button`
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
  background: #2C2C2C;
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
  background: #1a1a1a;
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
  background: #1a1a1a;
  color: #c3ac83;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #b5a075;
  }
`;

const SectionTitle = styled.h4`
  color: #c3ac83;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem 0;
  border-bottom: 1px solid #c3ac83;
  padding-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  background: #c3ac83;
  color: #2C2C2C;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b5a075;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: none;
  color: #c3ac83;
  border: 1px solid #c3ac83;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c3ac83;
    color: #2C2C2C;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${props => props.success ? '#4CAF50' : '#f44336'};
  color: white;
  text-align: center;
`;

const AddGameStats = ({ gameId, onStatsAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    game_id: gameId,
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

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await playersAPI.getAll();
        setPlayers(response.data);
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };

    loadPlayers();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Convert empty strings to 0 for numeric fields
      const processedData = {
        ...formData,
        at_bats: formData.at_bats === '' ? 0 : parseInt(formData.at_bats),
        hits: formData.hits === '' ? 0 : parseInt(formData.hits),
        doubles: formData.doubles === '' ? 0 : parseInt(formData.doubles),
        triples: formData.triples === '' ? 0 : parseInt(formData.triples),
        home_runs: formData.home_runs === '' ? 0 : parseInt(formData.home_runs),
        runs_batted_in: formData.runs_batted_in === '' ? 0 : parseInt(formData.runs_batted_in),
        runs_scored: formData.runs_scored === '' ? 0 : parseInt(formData.runs_scored),
        walks: formData.walks === '' ? 0 : parseInt(formData.walks),
        strikeouts: formData.strikeouts === '' ? 0 : parseInt(formData.strikeouts),
        stolen_bases: formData.stolen_bases === '' ? 0 : parseInt(formData.stolen_bases),
        hit_by_pitch: formData.hit_by_pitch === '' ? 0 : parseInt(formData.hit_by_pitch),
        innings_pitched: formData.innings_pitched === '' ? 0 : parseFloat(formData.innings_pitched),
        earned_runs: formData.earned_runs === '' ? 0 : parseInt(formData.earned_runs),
        hits_allowed: formData.hits_allowed === '' ? 0 : parseInt(formData.hits_allowed),
        walks_allowed: formData.walks_allowed === '' ? 0 : parseInt(formData.walks_allowed),
        strikeouts_pitched: formData.strikeouts_pitched === '' ? 0 : parseInt(formData.strikeouts_pitched),
        wins: formData.wins === '' ? 0 : parseInt(formData.wins),
        losses: formData.losses === '' ? 0 : parseInt(formData.losses),
        saves: formData.saves === '' ? 0 : parseInt(formData.saves)
      };

      await statsAPI.create(processedData);
      setMessage('Stats added successfully!');
      resetForm();
      setIsModalOpen(false);
      
      // Notify parent component to refresh stats
      if (onStatsAdded) {
        onStatsAdded();
      }
    } catch (error) {
      console.error('Error adding stats:', error);
      setMessage('Error adding stats: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      player_id: '',
      game_id: gameId,
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

  return (
    <AddStatsContainer>
      <AddStatsHeader>
        <AddStatsTitle>
          <FaChartBar />
          Add Player Stats
        </AddStatsTitle>
        <ToggleButton onClick={() => setIsModalOpen(true)}>
          <FaPlus />
          Add Stats
        </ToggleButton>
      </AddStatsHeader>

      {message && (
        <Message success={message.includes('successfully')}>
          {message}
        </Message>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
          setMessage('');
        }}
        title="Add Player Stats"
        onSave={handleSubmit}
        saveText="Add Stats"
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
              <Label>Runs Batted In</Label>
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
              <Label>Hit By Pitch</Label>
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
    </AddStatsContainer>
  );
};

export default AddGameStats; 