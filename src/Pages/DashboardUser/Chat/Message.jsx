import React from 'react';
import './Message.css';

const Message = ({ message, isUser }) => {
  // تحديد إذا كانت الرسالة من المستخدم الحالي
  const isUserMessage = () => {
    if (typeof isUser !== 'undefined') return isUser;
    if (typeof message.is_mine !== 'undefined') return message.is_mine;
    return false;
  };

  const userMessage = isUserMessage();
  
  const formatTime = (timestamp) => {
    if (message.created_at_human) {
      return message.created_at_human;
    }
    
    if (!timestamp) return 'الآن';
    
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
    if (userMessage) return null;
    
    const senderImage = message.sender?.image_profile || null;
    const senderName = message.sender?.name || 'مرسل';
    
    if (senderImage) {
      return (
        <div className="message-sender-avatar">
          <img 
            src={senderImage} 
            alt={senderName}
            className="avatar-image-small"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.querySelector('.avatar-fallback-small').style.display = 'flex';
            }}
          />
          <div className="avatar-fallback-small" style={{ display: 'none' }}>
            {senderName?.charAt(0) || '?'}
          </div>
        </div>
      );
    }
    
    return (
      <div className="message-sender-avatar">
        <div className="avatar-fallback-small">
          {senderName?.charAt(0) || '?'}
        </div>
      </div>
    );
  };

  return (
    <div className={`message-container ${userMessage ? 'user-message' : 'other-message'}`}>
      {!userMessage && renderSenderAvatar()}
      
      <div className="message-content-wrapper">
        {!userMessage && (
          <div className="message-sender-name">
            <span>{message.sender?.name || 'مرسل'}</span>
          </div>
        )}
        
        <div className="message-content">
          <div className="message-text">
            <p>{message.message || message.content}</p>
          </div>
          <div className="message-meta">
            <span className="message-time">
              {formatTime(message.created_at || message.timestamp)}
            </span>
            {userMessage && (
              <span className="message-status">
                {message.is_read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;