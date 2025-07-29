import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { highlightsAPI, playersAPI } from '../../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaVideo } from 'react-icons/fa';
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

const HighlightsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const HighlightCard = styled.div`
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #c3ac83;
`;

const HighlightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const HighlightInfo = styled.div`
  color: #c3ac83;
  flex: 1;
`;

const HighlightTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #c3ac83;
`;

const HighlightDetails = styled.p`
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

const VideoPreview = styled.div`
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: #2C2C2C;
`;

const VideoIframe = styled.iframe`
  width: 100%;
  height: 200px;
  border: none;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const DurationBadge = styled.span`
  background: #c3ac83;
  color: #2C2C2C;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  
  // YouTube
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const videoId = url.includes('youtu.be/') 
      ? url.split('youtu.be/')[1].split('?')[0]
      : url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  
  return null;
};

const HighlightsManager = ({ onClose }) => {
  const [highlights, setHighlights] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    player_id: '',
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    duration_seconds: '',
    highlight_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [highlightsResponse, playersResponse] = await Promise.all([
        highlightsAPI.getAll(),
        playersAPI.getAll()
      ]);
      setHighlights(highlightsResponse.data);
      setPlayers(playersResponse.data);
    } catch (error) {
      setMessage('Error loading data');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingHighlight) {
        await highlightsAPI.update(editingHighlight.id, formData);
        setMessage('Highlight updated successfully!');
      } else {
        await highlightsAPI.create(formData);
        setMessage('Highlight created successfully!');
      }
      setIsModalOpen(false);
      setEditingHighlight(null);
      resetForm();
      loadData();
    } catch (error) {
      setMessage('Error saving highlight');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (highlight) => {
    setEditingHighlight(highlight);
    setFormData({
      player_id: highlight.player_id,
      title: highlight.title,
      description: highlight.description || '',
      video_url: highlight.video_url || '',
      thumbnail_url: highlight.thumbnail_url || '',
      duration_seconds: highlight.duration_seconds || '',
      highlight_date: highlight.highlight_date || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (highlightId) => {
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      try {
        await highlightsAPI.delete(highlightId);
        setMessage('Highlight deleted successfully!');
        loadData();
      } catch (error) {
        setMessage('Error deleting highlight');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      player_id: '',
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      duration_seconds: '',
      highlight_date: ''
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ManagerContainer>
      <ManagerHeader>
        <ManagerTitle>Manage Highlights</ManagerTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton onClick={() => {
            setIsModalOpen(true);
            setEditingHighlight(null);
            resetForm();
          }}>
            <FaPlus />
            Add Highlight
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
          setEditingHighlight(null);
          resetForm();
        }}
        title={editingHighlight ? 'Edit Highlight' : 'Add New Highlight'}
        onSave={handleSubmit}
        saveText={editingHighlight ? 'Update Highlight' : 'Add Highlight'}
        loading={loading}
        width="700px"
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
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Amazing Home Run"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Video URL</Label>
              <Input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                required
                placeholder="YouTube or Vimeo URL"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Thumbnail URL</Label>
              <Input
                type="url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                placeholder="Image URL for thumbnail"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Duration (seconds)</Label>
              <Input
                type="number"
                name="duration_seconds"
                value={formData.duration_seconds}
                onChange={handleInputChange}
                min="0"
                placeholder="Video duration in seconds"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Highlight Date</Label>
              <Input
                type="date"
                name="highlight_date"
                value={formData.highlight_date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormGrid>
          
          <FormGroup>
            <Label>Description</Label>
            <Input
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Describe the highlight..."
            />
          </FormGroup>
          
      </Modal>

      <HighlightsList>
        {highlights.map(highlight => (
          <HighlightCard key={highlight.id}>
            <HighlightHeader>
              <HighlightInfo>
                <HighlightTitle>
                  {highlight.title}
                  {highlight.duration_seconds && (
                    <DurationBadge>
                      {formatDuration(highlight.duration_seconds)}
                    </DurationBadge>
                  )}
                </HighlightTitle>
                <HighlightDetails>
                  Player: {getPlayerName(highlight.player_id)} | 
                  Date: {formatDate(highlight.highlight_date)}
                  {highlight.description && ` | ${highlight.description}`}
                </HighlightDetails>
              </HighlightInfo>
              <ActionButtons>
                <IconButton onClick={() => handleEdit(highlight)}>
                  <FaEdit />
                </IconButton>
                <IconButton onClick={() => handleDelete(highlight.id)} danger>
                  <FaTrash />
                </IconButton>
              </ActionButtons>
            </HighlightHeader>
            
            {(highlight.video_url || highlight.thumbnail_url) && (
              <VideoPreview>
                {getVideoEmbedUrl(highlight.video_url) ? (
                  <VideoIframe
                    src={getVideoEmbedUrl(highlight.video_url)}
                    title={highlight.title}
                    allowFullScreen
                  />
                ) : highlight.thumbnail_url ? (
                  <ThumbnailImage
                    src={highlight.thumbnail_url}
                    alt={highlight.title}
                  />
                ) : (
                  <div style={{ 
                    height: '200px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#c3ac83',
                    background: '#2C2C2C'
                  }}>
                    <FaVideo size={48} />
                  </div>
                )}
              </VideoPreview>
            )}
          </HighlightCard>
        ))}
      </HighlightsList>
    </ManagerContainer>
  );
};

export default HighlightsManager; 