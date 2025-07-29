import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserShield, FaLock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const SetupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #c3ac83 0%, #b5a075 100%);
`;

const SetupCard = styled.div`
  background: #2C2C2C;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid #c3ac83;
  max-width: 500px;
  width: 100%;
`;

const SetupTitle = styled.h1`
  color: #c3ac83;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
`;

const SetupSubtitle = styled.p`
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

const SetupButton = styled.button`
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

const SuccessMessage = styled.div`
  color: #4CAF50;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PasswordRequirements = styled.div`
  background: #1a1a1a;
  border: 1px solid #c3ac83;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const RequirementTitle = styled.h4`
  color: #c3ac83;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
`;

const RequirementList = styled.ul`
  color: #c3ac83;
  opacity: 0.8;
  font-size: 0.8rem;
  margin: 0;
  padding-left: 1.5rem;
`;

const RequirementItem = styled.li`
  margin-bottom: 0.25rem;
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

const AdminSetup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if setup is needed
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/v1/admin/setup-status');
        const data = await response.json();
        setSetupNeeded(data.setup_needed);
        
        if (!data.setup_needed) {
          setError('Admin setup is not needed. Admin users already exist.');
        }
      } catch (err) {
        console.error('Error checking setup status:', err);
      }
    };

    checkSetupStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          email: email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Admin user created successfully! You can now log in.');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create admin user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!setupNeeded) {
    return (
      <SetupContainer>
        <SetupCard>
          <SetupTitle>Setup Not Needed</SetupTitle>
          <SetupSubtitle>
            Admin users already exist. Please use the login page instead.
          </SetupSubtitle>
          <BackLink>
            <a href="/admin/login">Go to Admin Login</a>
          </BackLink>
        </SetupCard>
      </SetupContainer>
    );
  }

  return (
    <SetupContainer>
      <SetupCard>
        <SetupTitle>Admin Setup</SetupTitle>
        <SetupSubtitle>
          Create the first admin user for the Peaks Baseball team management system
        </SetupSubtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUserShield />
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
          
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          
          <PasswordRequirements>
            <RequirementTitle>Password Requirements:</RequirementTitle>
            <RequirementList>
              <RequirementItem>At least 8 characters long</RequirementItem>
              <RequirementItem>Choose a strong, secure password</RequirementItem>
              <RequirementItem>This will be your admin login credentials</RequirementItem>
            </RequirementList>
          </PasswordRequirements>
          
          <SetupButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Admin User...' : 'Create Admin User'}
          </SetupButton>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && (
          <SuccessMessage>
            <FaCheckCircle />
            {success}
          </SuccessMessage>
        )}
        
        <BackLink>
          <a href="/">← Back to Home</a>
        </BackLink>
      </SetupCard>
    </SetupContainer>
  );
};

export default AdminSetup; 