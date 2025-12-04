import React, { useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = ({ chat, messages, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getLastSeen = () => {
    if (chat.last_message_at) {
      return `آخر نشاط: ${chat.last_message_at}`;
    }
    return 'غير متصل';
  };

  const renderAvatar = () => {
    if (chat.image_profile) {
      return (
        <img 
          src={chat.image_profile} 
          alt={chat.name}
          className="chat-avatar-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.querySelector('.avatar-fallback').style.display = 'flex';
          }}
        />
      );
    }
    return (
      <div className="avatar-fallback">
        {chat.avatar}
      </div>
    );
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar large">
            {renderAvatar()}
            <span className={`status-dot ${chat.status || 'offline'}`}></span>
          </div>
          <div className="chat-user-info">
            <h3>{chat.name}</h3>
            <p className="status">
              {chat.last_message?.is_read === false ? 'يوجد رسائل غير مقروءة' : getLastSeen()}
            </p>
          </div>
        </div>
      </div>

      <div className="messages-container" ref={containerRef}>
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="empty-chat-icon">💬</div>
            <h4>ابدأ المحادثة</h4>
            <p>هذه بداية محادثتك مع {chat.name}</p>
            <small>أرسل رسالة للبدء</small>
          </div>
        ) : (
          <>
            <div className="messages-list">
              {messages.map(message => (
                <Message 
                  key={message.id} 
                  message={message}
                  isUser={message.is_mine}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;