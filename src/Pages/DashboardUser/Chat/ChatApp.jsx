import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { fetchChats, sendMessage } from '../../../services/api';
import './ChatApp.css';

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await fetchChats();
      setChats(data);
      if (data.length > 0) {
        setSelectedChat(data[0]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    try {
      const newMessage = {
        id: Date.now(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        chatId: selectedChat.id
      };

      // إرسال للباك اند
      await sendMessage(selectedChat.id, content);
      
      // تحديث الرسائل محلياً
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-app">
      <Sidebar 
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        loading={loading}
      />
      <div className="chat-main">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="no-chat-selected">
            <p>اختر محادثة لبدء الدردشة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;