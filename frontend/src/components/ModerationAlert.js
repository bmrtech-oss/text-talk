import React from 'react';
import './ModerationAlert.css';

const ModerationAlert = ({ type, message, suggestions = [], onDismiss }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'error':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Content Approved';
      case 'warning':
        return 'Content Review Needed';
      case 'error':
        return 'Content Violation';
      default:
        return 'Moderation Notice';
    }
  };

  return (
    <div className={`moderation-alert moderation-alert--${type}`}>
      <div className="moderation-alert__header">
        <i className={getIcon()} />
        <h4>{getTitle()}</h4>
        {onDismiss && (
          <button
            className="moderation-alert__close"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>
      
      <div className="moderation-alert__content">
        <p>{message}</p>
        
        {suggestions.length > 0 && (
          <div className="moderation-alert__suggestions">
            <strong>Suggestions:</strong>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationAlert;
