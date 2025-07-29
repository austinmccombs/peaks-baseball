import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { adminPlayersAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUndo } from 'react-icons/fa';
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

const PlayersList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PlayerCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #c3ac83;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerInfo = styled.div`
  color: #c3ac83;
`;

const PlayerName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #c3ac83;
`;

const PlayerDetails = styled.p`
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

const PlayerManager = ({ onClose }) => {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    jersey_number: '',
    position: '',
    bio: '',
    height_inches: '',
    weight_lbs: '',
    birth_date: '',
    photo_url: ''
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const response = await adminPlayersAPI.getAll();
      setPlayers(response.data);
    } catch (error) {
      setMessage('Error loading players');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Convert empty strings to null for numeric fields
    const processedData = {
      ...formData,
      height_inches: formData.height_inches === '' ? null : formData.height_inches,
      weight_lbs: formData.weight_lbs === '' ? null : formData.weight_lbs,
      jersey_number: formData.jersey_number === '' ? null : formData.jersey_number
    };
    
    try {
      if (editingPlayer) {
        console.log('Attempting to update player:', editingPlayer.id, processedData);
        const response = await adminPlayersAPI.update(editingPlayer.id, processedData);
        console.log('Update response:', response);
        setMessage('Player updated successfully!');
      } else {
        console.log('Attempting to create player:', processedData);
        const response = await adminPlayersAPI.create(processedData);
        console.log('Create response:', response);
        setMessage('Player created successfully!');
      }
      setIsModalOpen(false);
      setEditingPlayer(null);
      resetForm();
      loadPlayers();
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error saving player: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      first_name: player.first_name,
      last_name: player.last_name,
      jersey_number: player.jersey_number,
      position: player.position,
      bio: player.bio || '',
      height_inches: player.height_inches || '',
      weight_lbs: player.weight_lbs || '',
      birth_date: player.birth_date || '',
      photo_url: player.photo_url || ''
    });
    setIsModalOpen(true);
    setMessage('');
  };

  const handleDelete = async (playerId) => {
    if (window.confirm('Are you sure you want to deactivate this player?')) {
      try {
        console.log('Attempting to delete player:', playerId);
        const response = await adminPlayersAPI.delete(playerId);
        console.log('Delete response:', response);
        setMessage('Player deactivated successfully!');
        loadPlayers();
      } catch (error) {
        console.error('Delete error:', error);
        setMessage('Error deactivating player: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleReactivate = async (playerId) => {
    try {
      console.log('Attempting to reactivate player:', playerId);
      // Find the player in the current list
      const player = players.find(p => p.id === playerId);
      if (!player) {
        setMessage('Player not found');
        return;
      }
      
      console.log('Player data for reactivation:', player);
      // Update with active set to true
      const response = await adminPlayersAPI.update(playerId, { ...player, active: true });
      console.log('Reactivate response:', response);
      setMessage('Player reactivated successfully!');
      loadPlayers();
    } catch (error) {
      console.error('Reactivate error:', error);
      setMessage('Error reactivating player: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      jersey_number: '',
      position: '',
      bio: '',
      height_inches: '',
      weight_lbs: '',
      birth_date: '',
      photo_url: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ManagerContainer>
      <ManagerHeader>
        <ManagerTitle>Manage Players</ManagerTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => {
            setIsModalOpen(true);
            setEditingPlayer(null);
            resetForm();
            setMessage('');
          }}>
            <FaPlus />
            Add Player
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
          setEditingPlayer(null);
          resetForm();
        }}
        title={editingPlayer ? 'Edit Player' : 'Add New Player'}
        onSave={handleSubmit}
        saveText={editingPlayer ? 'Update Player' : 'Add Player'}
        loading={loading}
      >
        <FormGrid>
          <FormGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Jersey Number</Label>
            <Input
              type="number"
              name="jersey_number"
              value={formData.jersey_number}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Position</Label>
            <Select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Position</option>
              <option value="P">Pitcher</option>
              <option value="C">Catcher</option>
              <option value="1B">First Base</option>
              <option value="2B">Second Base</option>
              <option value="3B">Third Base</option>
              <option value="SS">Shortstop</option>
              <option value="LF">Left Field</option>
              <option value="CF">Center Field</option>
              <option value="RF">Right Field</option>
              <option value="DH">Designated Hitter</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Height (inches)</Label>
            <Input
              type="number"
              name="height_inches"
              value={formData.height_inches}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Weight (lbs)</Label>
            <Input
              type="number"
              name="weight_lbs"
              value={formData.weight_lbs}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Birth Date</Label>
            <Input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Photo URL</Label>
            <Input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleInputChange}
            />
          </FormGroup>
        </FormGrid>
        
        <FormGroup>
          <Label>Bio</Label>
          <Input
            as="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
        </FormGroup>
      </Modal>

      <PlayersList>
        {players.map(player => (
          <PlayerCard key={player.id} style={{ opacity: player.active ? 1 : 0.6 }}>
            <PlayerInfo>
              <PlayerName>
                {player.display_name}
                {!player.active && <span style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Deactivated)</span>}
              </PlayerName>
              <PlayerDetails>
                Position: {player.position} | 
                {player.height_inches && ` Height: ${player.height_inches}"`} | 
                {player.weight_lbs && ` Weight: ${player.weight_lbs} lbs`}
              </PlayerDetails>
            </PlayerInfo>
            <ActionButtons>
              <IconButton onClick={() => handleEdit(player)}>
                <FaEdit />
              </IconButton>
              {player.active ? (
                <IconButton danger onClick={() => handleDelete(player.id)}>
                  <FaTrash />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleReactivate(player.id)}>
                  <FaUndo />
                </IconButton>
              )}
            </ActionButtons>
          </PlayerCard>
        ))}
      </PlayersList>
    </ManagerContainer>
  );
};

export default PlayerManager; 