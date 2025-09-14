import React, { useState, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-hot-toast';

import { getTimeline, getTweet } from '../services/tweetService';
import Tweet from './Tweet';
import TweetBox from './TweetBox';
import LoadingSpinner from './LoadingSpinner';
import './Feed.css';

const Feed = ({ type = 'timeline', username = null }) => {
  const [refreshing, setRefreshing] = useState(false);

  const fetchTweets = useCallback(
    async ({ pageParam = 1 }) => {
      let response;
      
      if (type === 'timeline') {
        response = await getTimeline(pageParam);
      } else if (type === 'user' && username) {
        response = await getTimeline(pageParam, username);
      } else {
        throw new Error('Invalid feed type');
      }

      return {
        tweets: response.tweets,
        nextPage: response.hasMore ? pageParam + 1 : undefined,
        hasMore: response.hasMore,
      };
    },
    [type, username]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ['tweets', type, username],
    fetchTweets,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Feed refreshed');
    } catch (error) {
      toast.error('Failed to refresh feed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleTweetSuccess = () => {
    refetch();
  };

  const tweets = data?.pages.flatMap(page => page.tweets) || [];

  if (status === 'loading') {
    return (
      <div className="feed">
        <div className="feed-header">
          <h2>Home</h2>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <i className={`fas ${refreshing ? 'fa-spin fa-spinner' : 'fa-sync-alt'}`} />
          </button>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="feed">
        <div className="feed-header">
          <h2>Home</h2>
        </div>
        <div className="error-state">
          <i className="fas fa-exclamation-triangle" />
          <p>Failed to load tweets</p>
          <button onClick={() => refetch()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed" id="tweet-feed">
      <div className="feed-header">
        <h2>{type === 'timeline' ? 'Home' : `${username}'s Tweets`}</h2>
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Refresh feed"
        >
          <i className={`fas ${refreshing ? 'fa-spin fa-spinner' : 'fa-sync-alt'}`} />
        </button>
      </div>

      {type === 'timeline' && (
        <TweetBox onSuccess={handleTweetSuccess} />
      )}

      {tweets.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-feather-alt" />
          <h3>No tweets yet</h3>
          <p>
            {type === 'timeline'
              ? 'Follow some users to see tweets here!'
              : 'This user hasn\'t tweeted anything yet.'
            }
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<LoadingSpinner />}
          endMessage={
            <div className="end-message">
              <p>You've reached the end! 🎉</p>
            </div>
          }
          refreshFunction={handleRefresh}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <p style={{ textAlign: 'center' }}>⬇️ Pull down to refresh</p>
          }
          releaseToRefreshContent={
            <p style={{ textAlign: 'center' }}>⬆️ Release to refresh</p>
          }
        >
          {tweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </InfiniteScroll>
      )}

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};

export default Feed;
