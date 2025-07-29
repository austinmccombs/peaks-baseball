import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  height: 360px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
`;

const Logo = () => {
  return (
    <LogoContainer>
      <LogoImage 
        src="/images/peaks-logo.jpeg" 
        alt="Peaks Baseball Team Logo"
      />
    </LogoContainer>
  );
};

export default Logo; 