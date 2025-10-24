import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', overlay = false }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'spinner-small';
      case 'large':
        return 'spinner-large';
      case 'medium':
      default:
        return 'spinner-medium';
    }
  };

  const getMessageSizeClass = () => {
    switch (size) {
      case 'small':
        return 'message-small';
      case 'large':
        return 'message-large';
      case 'medium':
      default:
        return 'message-medium';
    }
  };

  return (
    <div className={`loading-container ${overlay ? 'overlay' : ''}`}>
      <div className={`modern-spinner ${getSizeClass()}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && (
        <div className={`loading-message ${getMessageSizeClass()}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;



