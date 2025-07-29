import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaUser } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #c3ac83 0%, #b5a075 100%);
`;

const LoginCard = styled.div`
  background: #2C2C2C;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid #c3ac83;
  max-width: 400px;
  width: 100%;
`;

const LoginTitle = styled.h1`
  color: #c3ac83;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const LoginSubtitle = styled.p`
  color: #c3ac83;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.8;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #c3ac83;
  border-radius: 8px;
  background: #2C2C2C;
  color: #c3ac83;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: #c3ac83;
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #c3ac83;
  opacity: 0.7;
`;

const LoginButton = styled.button`
  background: #c3ac83;
  color: #2C2C2C;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #b5a075;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  
  a {
    color: #c3ac83;
    text-decoration: none;
    font-size: 0.9rem;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple admin authentication (in a real app, this would be more secure)
    if (username === 'admin' && password === 'peaks2024') {
      // Store admin session
      localStorage.setItem('adminAuthenticated', 'true');
      // Dispatch custom event to notify header of login
      window.dispatchEvent(new Event('localStorageChange'));
      navigate('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Admin Access</LoginTitle>
        <LoginSubtitle>
          Enter your credentials to access the team management panel
        </LoginSubtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <BackLink>
          <a href="/">← Back to Home</a>
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin; 