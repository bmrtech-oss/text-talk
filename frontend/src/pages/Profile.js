import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

import useAuth from '../hooks/useAuth';
import Feed from '../components/Feed';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import EditProfileModal from '../components/EditProfileModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { userService } from '../services/userService';
import { tweetService } from '../services/tweetService';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tweets');

  const isOwnProfile = !username || username === currentUser?.username;

  const { data: profileUser, isLoading: profileLoading, error } = useQuery(
    ['user', username || currentUser?.username],
    () => userService.getUserProfile(username || currentUser?.username),
    {
      enabled: !!currentUser,
      onError: (error) => {
        toast.error('Failed to load profile');
      }
    }
  );

  const followMutation = useMutation(
    () => userService.followUser(profileUser.username),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', profileUser.username]);
        toast.success(`Followed @${profileUser.username}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to follow user');
      }
    }
  );

  const unfollowMutation = useMutation(
    () => userService.unfollowUser(profileUser.username),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', profileUser.username]);
        toast.success(`Unfollowed @${profileUser.username}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to unfollow user');
      }
    }
  );

  const handleFollow = () => {
    if (profileUser.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries(['user', currentUser?.username]);
    toast.success('Profile updated successfully');
  };

  if (profileLoading) {
    return (
      <div className="profile-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <i className="fas fa-exclamation-triangle" />
        <h2>Profile not found</h2>
        <p>The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!profileUser) {
    return null;
  }

  return (
    <div className="profile">
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        onFollow={handleFollow}
        onEditProfile={handleEditProfile}
        isFollowing={profileUser.isFollowing}
        isFollowLoading={followMutation.isLoading || unfollowMutation.isLoading}
      />

      <ProfileStats
        user={profileUser}
        onFollowingClick={() => setActiveTab('following')}
        onFollowersClick={() => setActiveTab('followers')}
      />

      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'tweets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tweets')}
        >
          Tweets
        </button>
        <button
          className={`tab ${activeTab === 'replies' ? 'active' : ''}`}
          onClick={() => setActiveTab('replies')}
        >
          Replies
        </button>
        <button
          className={`tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
        <button
          className={`tab ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          Likes
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'tweets' && (
          <Feed type="user" username={profileUser.username} />
        )}
        {activeTab === 'replies' && (
          <div className="tab-content">
            <p>Replies will be shown here</p>
          </div>
        )}
        {activeTab === 'media' && (
          <div className="tab-content">
            <p>Media will be shown here</p>
          </div>
        )}
        {activeTab === 'likes' && (
          <div className="tab-content">
            <p>Likes will be shown here</p>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
