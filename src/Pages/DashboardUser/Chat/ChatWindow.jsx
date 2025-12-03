import React, { useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = ({ chat, messages, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">{chat.name.charAt(0)}</div>
          <div>
            <h3>{chat.name}</h3>
            <p className="status">{chat.status || 'غير متصل'}</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>لا توجد رسائل بعد. ابدأ محادثة!</p>
          </div>
        ) : (
          messages.map(message => (
            <Message key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;