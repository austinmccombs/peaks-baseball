import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBaseballBall } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: var(--primary-text);
  color: var(--primary-bg);
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const FooterIcon = styled(FaBaseballBall)`
  margin-right: 10px;
  font-size: 1.5rem;
`;

const FooterText = styled.p`
  margin: 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const AdminLink = styled(Link)`
  color: var(--primary-bg);
  text-decoration: none;
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 1rem;
  display: inline-block;
  
  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          <FooterIcon />
          Peaks Baseball
        </FooterLogo>

        <FooterText>&copy; {new Date().getFullYear()} Peaks Baseball. All rights reserved.</FooterText>
        <AdminLink to="/admin/login">Admin Access</AdminLink>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 