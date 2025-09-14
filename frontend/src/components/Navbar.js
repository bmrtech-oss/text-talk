import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-dove" />
          <span>SafeTweet</span>
        </Link>

        <div className="navbar-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Search SafeTweet"
            className="search-input"
          />
        </div>

        <div className="navbar-actions">
          <button className="nav-button">
            <i className="fas fa-bell" />
          </button>

          <button className="nav-button">
            <i className="fas fa-envelope" />
          </button>

          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-expanded={showMenu}
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <i className="fas fa-user" />
                )}
              </div>
              <span className="user-name">{user?.name || user?.username}</span>
              <i className="fas fa-chevron-down" />
            </button>

            {showMenu && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={handleProfileClick}
                >
                  <i className="fas fa-user" />
                  Profile
                </button>
                <button className="dropdown-item">
                  <i className="fas fa-cog" />
                  Settings
                </button>
                <hr className="dropdown-divider" />
                <button
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt" />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button className="tweet-button-mobile">
            <i className="fas fa-feather" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div
          className="dropdown-backdrop"
          onClick={() => setShowMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
