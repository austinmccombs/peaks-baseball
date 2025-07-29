import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: #2C2C2C;
  border-radius: 12px;
  border: 2px solid #c3ac83;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  width: ${props => props.width || '600px'};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #c3ac83;
`;

const ModalTitle = styled.h3`
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
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #b5a075;
    background: rgba(197, 172, 131, 0.1);
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #c3ac83;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #c3ac83;
  color: #2C2C2C;
  
  &:hover:not(:disabled) {
    background: #b5a075;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #c3ac83;
  border: 1px solid #c3ac83;
  
  &:hover:not(:disabled) {
    background: rgba(197, 172, 131, 0.1);
  }
`;

const DangerButton = styled(Button)`
  background: #dc3545;
  color: white;
  
  &:hover:not(:disabled) {
    background: #c82333;
  }
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSave, 
  onCancel, 
  saveText = 'Save', 
  cancelText = 'Cancel',
  showSave = true,
  showCancel = true,
  width,
  loading = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer width={width}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {children}
        </ModalContent>
        
        {(showSave || showCancel) && (
          <ModalFooter>
            {showCancel && (
              <SecondaryButton onClick={handleCancel} disabled={loading}>
                {cancelText}
              </SecondaryButton>
            )}
            {showSave && (
              <PrimaryButton onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : saveText}
              </PrimaryButton>
            )}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal; 