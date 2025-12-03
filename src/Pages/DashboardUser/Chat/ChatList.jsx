import React from 'react';
import './ChatList.css';

const ChatList = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <div className="chat-list">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
          onClick={() => onSelectChat(chat)}
        >
          <div className="chat-avatar">
            {chat.name.charAt(0)}
          </div>
          <div className="chat-info">
            <h4>{chat.name}</h4>
            <p className="last-message">{chat.lastMessage}</p>
            <span className="timestamp">{chat.lastTime}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;