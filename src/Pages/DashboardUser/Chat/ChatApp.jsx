// ChatApp.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../../utils/auth';
import './ChatApp.css';
import axios from 'axios';

const BASE_URL = 'https://api.maaashi.com/api';

const ChatApp = () => {
  const { user_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token: userToken } = parseAuthCookie(cookies?.token);
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);

  // جلب المحادثات الموجودة
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/conversations`, {
        headers: { 
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  };

  // إنشاء محادثة جديدة
  const startConversation = async (userId) => {
    try {
      setIsStartingNewChat(true);
      const response = await axios.post(
        `${BASE_URL}/conversations/start?user_id=${userId}`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    } finally {
      setIsStartingNewChat(false);
    }
  };

  // جلب رسائل محادثة معينة
  const fetchMessages = async (convId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/conversations/${convId}/messages`,
        { 
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching messages for conversation ${convId}:`, error);
      return [];
    }
  };

  // إرسال رسالة
  const sendMessage = async (convId, messageContent) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/messages/send`,
        { 
          conversation_id: convId,
          message: messageContent
        },
        { 
          headers: { 
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // تحويل الاستجابة لتتوافق مع الشكل المطلوب
      const sentMessage = response.data.data;
      return {
        id: sentMessage.id,
        content: sentMessage.message,
        sender_id: sentMessage.sender_id,
        created_at: sentMessage.created_at,
        created_at_human: sentMessage.created_at_human
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // تحميل المحادثات عند فتح التطبيق
  useEffect(() => {
    if (!userToken) {
      navigate('/login');
      return;
    }

    const loadChats = async () => {
      try {
        setLoading(true);
        const conversations = await fetchConversations();
        
              // تحويل البيانات لتتوافق مع المكونات
      const formattedChats = conversations.map(conv => ({
        id: conv.conversation_id,
        conversation_id: conv.conversation_id,
        name: conv.other_user.name,
        avatar: conv.other_user.name?.charAt(0) || 'U',
        image_profile: conv.other_user.image_profile,
        lastMessage: conv.last_message?.message || 'بدأ المحادثة',
        lastTime: conv.last_message_at || 'الآن',
        unreadCount: conv.unread_count || 0,
        other_user: conv.other_user,
        last_message: conv.last_message
      }));
        
        setChats(formattedChats);

        // إذا كان هناك user_id في الـ URL، نتعامل مع محادثة مستخدم معين
        if (user_id) {
          await handleUserChat(user_id, formattedChats);
        } else if (formattedChats.length > 0) {
          // إذا لا يوجد user_id، نفتح أول محادثة
          await selectChat(formattedChats[0]);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userToken, user_id]);

  // التعامل مع محادثة مستخدم معين
  const handleUserChat = async (userId, existingChats = chats) => {
    try {
      // البحث عن محادثة موجودة مع هذا المستخدم
      const existingChat = existingChats.find(
        chat => chat.other_user?.id.toString() === userId.toString()
      );

      if (existingChat) {
        // إذا كانت المحادثة موجودة، نفتحها
        await selectChat(existingChat);
      } else {
        // إذا لم تكن موجودة، ننشئ محادثة جديدة
        try {
          const newConversation = await startConversation(userId);
          
          const newChat = {
            id: newConversation.conversation_id,
            conversation_id: newConversation.conversation_id,
            name: newConversation.other_user.name,
            avatar: newConversation.other_user.name?.charAt(0) || 'U',
            lastMessage: 'بدأ المحادثة',
            lastTime: 'الآن',
            unreadCount: 0,
            other_user: newConversation.other_user
          };
          
          // إضافة المحادثة الجديدة في البداية
          setChats(prev => [newChat, ...prev]);
          await selectChat(newChat);
        } catch (error) {
          console.error('Failed to start conversation:', error);
          // عرض رسالة خطأ للمستخدم
          alert('فشل في بدء المحادثة. يرجى المحاولة مرة أخرى.');
        }
      }
    } catch (error) {
      console.error('Error handling user chat:', error);
    }
  };

  // اختيار محادثة و تحميل رسائلها
  const selectChat = async (chat) => {
    try {
      setSelectedChat(chat);
      setConversationId(chat.conversation_id);
      
      const chatMessages = await fetchMessages(chat.conversation_id);
      
      // تحويل الرسائل لتتوافق مع مكون Message
      const formattedMessages = chatMessages.map(msg => ({
        id: msg.id,
        content: msg.message,
        sender: msg.sender_id === chat.other_user?.id ? 'other' : 'user',
        senderName: msg.sender_id === chat.other_user?.id ? chat.name : 'أنت',
        timestamp: msg.created_at,
        timestampHuman: msg.created_at_human || msg.created_at,
        read: msg.is_read || true
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  // إرسال رسالة جديدة
  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim() || !conversationId) return;

    try {
      // معرف المستخدم الحالي (يجب أن يكون متوفراً من الـ API)
      const currentUserId = 41; 
      
      // إنشاء رسالة مؤقتة للعرض الفوري
      const tempMessage = {
        id: Date.now(),
        content,
        sender: 'user',
        senderName: 'أنت',
        timestamp: new Date().toISOString(),
        timestampHuman: 'الآن',
        read: true
      };

      // إضافة الرسالة المؤقتة
      setMessages(prev => [...prev, tempMessage]);

      // إرسال الرسالة للخادم
      const sentMessage = await sendMessage(conversationId, content);

      // تحديث قائمة المحادثات
      setChats(prev => 
        prev.map(chat => 
          chat.conversation_id === conversationId
            ? { 
                ...chat, 
                lastMessage: content,
                lastTime: 'الآن'
              }
            : chat
        )
      );
      
      // استبدال الرسالة المؤقتة بالرسالة الرسمية
      const newMessage = {
        id: sentMessage.id,
        content: sentMessage.content,
        sender: sentMessage.sender_id === currentUserId ? 'user' : 'other',
        senderName: sentMessage.sender_id === currentUserId ? 'أنت' : selectedChat.name,
        timestamp: sentMessage.created_at,
        timestampHuman: sentMessage.created_at_human,
        read: true
      };
      
      // استبدال الرسالة المؤقتة بالرسالة الحقيقية
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? newMessage : msg
        ).filter(msg => msg.id !== tempMessage.id) // إزالة الرسالة المؤقتة إذا لم تكن موجودة
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      // إزالة الرسالة المؤقتة في حالة الخطأ
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert('فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  // تحديث المحادثات تلقائياً كل 30 ثانية
  useEffect(() => {
    if (!userToken) return;

    const interval = setInterval(async () => {
      if (selectedChat) {
        const updatedMessages = await fetchMessages(selectedChat.conversation_id);
        const formattedMessages = updatedMessages.map(msg => ({
          id: msg.id,
          content: msg.message,
          sender: msg.sender_id === selectedChat.other_user?.id ? 'other' : 'user',
          senderName: msg.sender_id === selectedChat.other_user?.id ? selectedChat.name : 'أنت',
          timestamp: msg.created_at,
          timestampHuman: msg.created_at_human || msg.created_at,
          read: msg.is_read || true
        }));
        setMessages(formattedMessages);
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [userToken, selectedChat]);

  return (
    <div className="chat-app">
      <Sidebar 
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={selectChat}
        loading={loading}
        isStartingNewChat={isStartingNewChat}
      />
      <div className="chat-main">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            isStartingNewChat={isStartingNewChat}
          />
        ) : (
          <div className="no-chat-selected">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>جاري تحميل المحادثات...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>لا توجد محادثات</h3>
                <p>ابدأ محادثة جديدة بالضغط على زر "رسالة" في أي إعلان</p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👈</div>
                <h3>اختر محادثة</h3>
                <p>اختر محادثة من القائمة الجانبية لبدء الدردشة</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;