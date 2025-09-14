import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: 'fas fa-home',
      label: 'Home',
      active: location.pathname === '/',
    },
    {
      path: '/explore',
      icon: 'fas fa-hashtag',
      label: 'Explore',
      active: location.pathname === '/explore',
    },
    {
      path: '/notifications',
      icon: 'fas fa-bell',
      label: 'Notifications',
      active: location.pathname === '/notifications',
    },
    {
      path: '/messages',
      icon: 'fas fa-envelope',
      label: 'Messages',
      active: location.pathname === '/messages',
    },
    {
      path: `/profile/${user?.username}`,
      icon: 'fas fa-user',
      label: 'Profile',
      active: location.pathname.startsWith('/profile'),
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <i className="fas fa-dove" />
          <span>SafeTweet</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-item ${item.active ? 'active' : ''}`}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button className="tweet-button">
        <i className="fas fa-feather" />
        <span>Tweet</span>
      </button>

      <div className="user-profile">
        <div className="user-info">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <i className="fas fa-user" />
            )}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || user?.username}</div>
            <div className="user-handle">@{user?.username}</div>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout} title="Logout">
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
