import React, { useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = ({ 
  chat, 
  messages, 
  onSendMessage, 
  messagesLoading = false,
  isStartingNewChat = false
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const messagesListRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesListRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const getLastSeen = () => {
    if (chat.last_message?.created_at) {
      return `آخر نشاط: ${chat.last_message.created_at}`;
    }
    if (chat.last_message_at) {
      return `آخر نشاط: ${chat.last_message_at}`;
    }
    return 'غير متصل';
  };

  const getUnreadStatus = () => {
    if (chat.unread_count > 0) {
      return 'يوجد رسائل غير مقروءة';
    }
    if (chat.last_message?.is_read === false) {
      return 'يوجد رسالة غير مقروؤة';
    }
    return getLastSeen();
  };

  const renderAvatar = () => {
    if (chat.image_profile) {
      return (
        <>
          <img 
            src={chat.image_profile} 
            alt={chat.name}
            className="chat-avatar-image"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.parentNode.querySelector('.avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="avatar-fallback" style={{ display: 'none' }}>
            {chat.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </>
      );
    }
    return (
      <div className="avatar-fallback">
        {chat.name?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  };

  // عرض حالة التحميل للمحادثة الجديدة
  if (isStartingNewChat) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar large">
              {renderAvatar()}
              <span className="status-dot offline"></span>
            </div>
            <div className="chat-user-info">
              <h3>{chat.name}</h3>
              <p className="status">جاري بدء المحادثة...</p>
            </div>
          </div>
        </div>
        
        <div className="messages-container">
          <div className="messages-loading">
            <div className="loading-spinner large"></div>
            <p>جاري بدء المحادثة مع {chat.name}</p>
            <small>الرجاء الانتظار...</small>
          </div>
        </div>
        
        <MessageInput onSendMessage={onSendMessage} disabled={true} />
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar large">
            {renderAvatar()}
            <span className="status-dot offline"></span>
          </div>
          <div className="chat-user-info">
            <h3>{chat.name}</h3>
            <p className="status">{getUnreadStatus()}</p>
          </div>
        </div>
      </div>

      <div className="messages-container" ref={containerRef}>
        {messagesLoading ? (
          <div className="messages-loading">
            <div className="loading-spinner"></div>
            <p>جاري تحميل الرسائل...</p>
            <small>من {chat.name}</small>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <div className="empty-chat-icon">💬</div>
            <h4>ابدأ المحادثة</h4>
            <p>هذه بداية محادثتك مع {chat.name}</p>
            <small>أرسل رسالة للبدء</small>
          </div>
        ) : (
          <div className="messages-list" ref={messagesListRef}>
            {messages.map(message => (
              <Message 
                key={message.id} 
                message={message}
                isUser={message.is_mine}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageInput 
        onSendMessage={onSendMessage} 
        disabled={messagesLoading || isStartingNewChat}
      />
    </div>
  );
};

export default ChatWindow;