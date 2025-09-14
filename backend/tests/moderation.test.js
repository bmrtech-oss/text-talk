const { simulateModeration } = require('../utils/moderationAPI');

describe('Content Moderation Tests', () => {
  it('should approve safe content', () => {
    const result = simulateModeration('This is a normal tweet about technology');
    expect(result.isApproved).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('should reject content with prohibited terms', () => {
    const result = simulateModeration('This is hate speech and violence');
    expect(result.isApproved).toBe(false);
    expect(result.violations).toContain('inappropriate_content');
  });

  it('should flag potentially controversial content', () => {
    const result = simulateModeration('My opinion about politics and religion');
    expect(result.isApproved).toBe(false);
    expect(result.violations).toContain('potentially_controversial');
  });

  it('should handle empty content', () => {
    const result = simulateModeration('');
    expect(result.isApproved).toBe(true);
  });
});
