import { useState, useCallback } from 'react';
import { moderationService } from '../services/moderationService';

const useModeration = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const checkContent = useCallback(async (content) => {
    if (!content || typeof content !== 'string') {
      setError('Invalid content provided');
      return null;
    }

    setIsChecking(true);
    setError(null);

    try {
      const moderationResult = await moderationService.checkContent(content);
      setResult(moderationResult);
      return moderationResult;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Moderation check failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsChecking(false);
    setResult(null);
    setError(null);
  }, []);

  const getSeverity = useCallback(() => {
    if (!result) return 'neutral';
    
    const { moderationResult } = result;
    
    if (!moderationResult.isApproved) {
      if (moderationResult.violations.includes('hate_speech') || 
          moderationResult.violations.includes('violence')) {
        return 'high';
      }
      return 'medium';
    }
    
    return 'low';
  }, [result]);

  return {
    isChecking,
    result,
    error,
    checkContent,
    reset,
    getSeverity,
    isApproved: result?.moderationResult?.isApproved ?? true,
    violations: result?.moderationResult?.violations ?? [],
    suggestions: result?.moderationResult?.suggestedChanges ?? [],
  };
};

export default useModeration;
