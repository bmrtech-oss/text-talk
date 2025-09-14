import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';

import Feed from '../components/Feed';
import Sidebar from '../components/Sidebar';
import TrendingSidebar from '../components/TrendingSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { tweetService } from '../services/tweetService';
import { userService } from '../services/userService';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const { data: trendingTweets, isLoading: trendingLoading } = useQuery(
    'trendingTweets',
    () => tweetService.getTrendingTweets(),
    {
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        toast.error('Failed to load trending tweets');
      }
    }
  );

  const { data: suggestedUsers, isLoading: usersLoading } = useQuery(
    'suggestedUsers',
    () => userService.getSuggestedUsers(),
    {
      staleTime: 10 * 60 * 1000,
      onError: (error) => {
        toast.error('Failed to load suggested users');
      }
    }
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  if (trendingLoading || usersLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <button
              className="mobile-menu-button"
              onClick={toggleMobileSidebar}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars" />
            </button>
            
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => handleTabChange('timeline')}
              >
                For You
              </button>
              <button
                className={`tab ${activeTab === 'following' ? 'active' : ''}`}
                onClick={() => handleTabChange('following')}
              >
                Following
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            {activeTab === 'timeline' && <Feed type="timeline" />}
            {activeTab === 'following' && (
              <div className="following-feed">
                <Feed type="following" />
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="dashboard-aside">
          <TrendingSidebar
            trendingTweets={trendingTweets}
            suggestedUsers={suggestedUsers}
          />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="mobile-sidebar-overlay">
            <div className="mobile-sidebar">
              <Sidebar />
              <button
                className="close-sidebar"
                onClick={toggleMobileSidebar}
                aria-label="Close menu"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button className="fab" aria-label="New tweet">
        <i className="fas fa-feather" />
      </button>
    </div>
  );
};

export default Dashboard;
