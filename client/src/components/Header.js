import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaCog } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: var(--primary-text);
  color: var(--primary-bg);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-bg);
  
  &:hover {
    opacity: 0.9;
  }
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  object-fit: contain;
`;



const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--primary-bg);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--primary-text);
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--primary-bg);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(212, 194, 167, 0.2);
  }
  
  &.active {
    background-color: var(--accent-color);
    color: white;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    setIsAdminAuthenticated(adminAuth === 'true');

    // Listen for storage changes (when admin logs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'adminAuthenticated') {
        setIsAdminAuthenticated(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab logout)
    const handleCustomStorageChange = () => {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      setIsAdminAuthenticated(adminAuth === 'true');
    };

    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/roster', label: 'Roster' },
    { path: '/games', label: 'Games' },
    { path: '/stats', label: 'Stats' },
    { path: '/highlights', label: 'Highlights' }
  ];

  // Add admin link if authenticated
  if (isAdminAuthenticated) {
    navItems.push({ path: '/admin', label: 'Admin', icon: <FaCog /> });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">
          <LogoImage src="/images/peaks-reverse-image.jpg" alt="Peaks Baseball Logo" />
        </Logo>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <Nav>
          <NavList isOpen={isMobileMenuOpen}>
            {navItems.map((item) => (
              <NavItem key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 