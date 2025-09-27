import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Target, MessageCircle, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          💰 Savings Tracker
        </Link>
        
        {user && (
          <ul className="navbar-nav">
            <li>
              <Link to="/dashboard">
                <BarChart3 size={20} style={{ marginRight: '0.5rem' }} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/goals">
                <Target size={20} style={{ marginRight: '0.5rem' }} />
                Goals
              </Link>
            </li>
            <li>
              <Link to="/chat">
                <MessageCircle size={20} style={{ marginRight: '0.5rem' }} />
                Chat
              </Link>
            </li>
            <li>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <User size={20} style={{ marginRight: '0.5rem' }} />
                {user.name}
              </span>
            </li>
            <li>
              <button onClick={handleLogout}>
                <LogOut size={20} style={{ marginRight: '0.5rem' }} />
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
