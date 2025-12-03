import React from 'react';
import './Message.css';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const messageTime = formatTime(message.timestamp);

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  return (
    <div className={`message-container ${isUser ? 'user-message' : 'other-message'}`}>
      <div className="message-content">
        <div className="message-text">
          <p>{message.content}</p>
        </div>
        <div className="message-time">
          <span>{messageTime}</span>
        </div>
      </div>
      
      {!isUser && (
        <div className="message-sender">
          <span>{message.senderName || 'مرسل'}</span>
        </div>
      )}
    </div>
  );
};

export default Message;