import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

import { createTweet } from '../services/tweetService';
import { checkContentModeration } from '../services/moderationService';
import useAuth from '../hooks/useAuth';
import './TweetBox.css';

const TweetBox = ({ replyTo = null, onSuccess = null }) => {
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const textareaRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const content = watch('content', '');

  const tweetMutation = useMutation(createTweet, {
    onSuccess: () => {
      toast.success('Tweet posted successfully!');
      reset();
      setModerationResult(null);
      setCharacterCount(0);
      queryClient.invalidateQueries('tweets');
      queryClient.invalidateQueries('timeline');
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post tweet');
    },
  });

  const moderationMutation = useMutation(checkContentModeration, {
    onMutate: () => setIsModerating(true),
    onSuccess: (data) => {
      setModerationResult(data);
      if (!data.moderationResult.isApproved) {
        toast.error('Content violates guidelines. Please revise your tweet.');
      }
    },
    onError: () => {
      toast.error('Moderation service unavailable. Please try again.');
    },
    onSettled: () => setIsModerating(false),
  });

  const handleContentChange = (e) => {
    const text = e.target.value;
    setCharacterCount(text.length);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }

    // Clear moderation result when content changes
    if (moderationResult && text !== moderationResult.content) {
      setModerationResult(null);
    }
  };

  const handleModerationCheck = async (content) => {
    if (!content.trim()) return;
    
    moderationMutation.mutate(content);
  };

  const onSubmit = async (data) => {
    if (moderationResult && !moderationResult.moderationResult.isApproved) {
      toast.error('Please address the moderation issues before posting');
      return;
    }

    const tweetData = {
      content: data.content.trim(),
      ...(replyTo && { replyTo }),
    };

    tweetMutation.mutate(tweetData);
  };

  const insertEmoji = (emojiData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content.substring(0, start) + emoji + content.substring(end);

    setValue('content', text);
    setCharacterCount(text.length);
    textarea.focus();
    textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    setShowEmojiPicker(false);
  };

  const isOverLimit = characterCount > 280;
  const canPost = content.trim().length > 0 && characterCount <= 280;

  return (
    <div className="tweet-box">
      <div className="tweet-box-header">
        <h3>Compose Tweet</h3>
        {replyTo && <span className="replying-to">Replying to tweet</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="tweet-form">
        <div className="tweet-input-container">
          <textarea
            {...register('content', {
              required: 'Tweet content is required',
              maxLength: {
                value: 280,
                message: 'Tweet cannot exceed 280 characters',
              },
              validate: (value) => value.trim().length > 0 || 'Tweet cannot be empty',
            })}
            ref={textareaRef}
            placeholder="What's happening?"
            className="tweet-textarea"
            onChange={handleContentChange}
            rows={3}
            disabled={tweetMutation.isLoading}
          />
          
          {errors.content && (
            <p className="error-message">{errors.content.message}</p>
          )}

          {moderationResult && (
            <div className={`moderation-feedback ${moderationResult.moderationResult.isApproved ? 'approved' : 'rejected'}`}>
              <i className={`fas ${moderationResult.moderationResult.isApproved ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} />
              <span>
                {moderationResult.moderationResult.isApproved
                  ? 'Content approved'
                  : 'Content needs review'
                }
              </span>
              {moderationResult.moderationResult.suggestedChanges?.length > 0 && (
                <div className="suggestions">
                  <strong>Suggestions:</strong>
                  <ul>
                    {moderationResult.moderationResult.suggestedChanges.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tweet-actions">
          <div className="action-buttons">
            <button
              type="button"
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={tweetMutation.isLoading}
            >
              <i className="far fa-smile" />
            </button>

            <button
              type="button"
              className="moderate-button"
              onClick={() => handleModerationCheck(content)}
              disabled={!content.trim() || isModerating || tweetMutation.isLoading}
            >
              <i className="fas fa-shield-alt" />
              {isModerating ? 'Checking...' : 'Check Content'}
            </button>
          </div>

          <div className="submit-section">
            <span className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
              {characterCount}/280
            </span>
            <button
              type="submit"
              className="tweet-button"
              disabled={!canPost || tweetMutation.isLoading || isModerating}
            >
              {tweetMutation.isLoading ? (
                <div className="loading-spinner" />
              ) : replyTo ? (
                'Reply'
              ) : (
                'Tweet'
              )}
            </button>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={insertEmoji} />
          </div>
        )}
      </form>
    </div>
  );
};

export default TweetBox;
