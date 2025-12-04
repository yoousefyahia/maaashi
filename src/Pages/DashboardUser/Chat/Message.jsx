// Message.jsx
import React from 'react';
import './Message.css';

const Message = ({ message, isUser }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'الآن';
    
    // إذا كان التنسيق "X hours ago"
    if (typeof timestamp === 'string' && timestamp.includes('ago')) {
      return timestamp;
    }
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
      if (diffHours < 24) return `قبل ${diffHours} ساعة`;
      
      return date.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  // عرض صورة المرسل (للرسائل من الآخرين فقط)
  const renderSenderAvatar = () => {
    if (isUser) return null;
    
    // يمكنك تمرير صورة المرسل مع الرسالة أو استخدام صورة افتراضية
    const senderImage = message.senderImage || null;
    
    if (senderImage) {
      return (
        <div className="message-sender-avatar">
          <img 
            src={senderImage} 
            alt={message.senderName}
            className="avatar-image-small"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.querySelector('.avatar-fallback-small').style.display = 'flex';
            }}
          />
          <div className="avatar-fallback-small" style={{ display: 'none' }}>
            {message.senderName?.charAt(0) || '?'}
          </div>
        </div>
      );
    }
    
    return (
      <div className="message-sender-avatar">
        <div className="avatar-fallback-small">
          {message.senderName?.charAt(0) || '?'}
        </div>
      </div>
    );
  };

  return (
    <div className={`message-container ${isUser ? 'user-message' : 'other-message'}`}>
      {!isUser && renderSenderAvatar()}
      
      <div className="message-content-wrapper">
        {!isUser && (
          <div className="message-sender-name">
            <span>{message.senderName}</span>
          </div>
        )}
        
        <div className="message-content">
          <div className="message-text">
            <p>{message.content}</p>
          </div>
          <div className="message-meta">
            <span className="message-time">
              {message.timestampHuman || formatTime(message.timestamp)}
            </span>
            {isUser && (
              <span className="message-status">
                {message.read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;