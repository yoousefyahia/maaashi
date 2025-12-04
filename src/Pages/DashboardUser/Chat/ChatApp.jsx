import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../../utils/auth';
import './ChatApp.css';
import axios from 'axios';

const BASE_URL = 'https://api.maaashi.com/api';

const ChatApp = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token: userToken } = parseAuthCookie(cookies?.token);
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  // 🔧 دالة لتفكيك الـ JWT Token والحصول على الـ ID
  const getUserIdFromToken = () => {
    if (!userToken) return null;
    
    try {
      // الـ JWT Token بيكون بالشكل: header.payload.signature
      const payload = userToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      // هنا بيكون الـ ID موجود في الـ token
      // ممكن يكون في حقل: id, user_id, sub (subject)
      return decodedPayload.id || decodedPayload.user_id || decodedPayload.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // 🔧 أو نستخدم API لجلب المعلومات
  const fetchCurrentUser = async () => {
    if (!userToken) return null;
    
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { 
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.data) {
        setCurrentUserInfo(response.data.data);
        return response.data.data.id;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  // جلب المحادثات
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
      
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // 🌟 تحميل البيانات الأولية
  useEffect(() => {
    if (!userToken) {
      navigate('/login');
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // 1. جلب معلومات المستخدم الحالي
        const currentUserId = await fetchCurrentUser();
        
        // 2. جلب المحادثات
        const conversations = await fetchConversations();
        
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

        // التعامل مع user_id إذا كان موجوداً في الـ URL
        if (user_id) {
          await handleUserChat(user_id, formattedChats, currentUserId);
        } else if (formattedChats.length > 0) {
          await selectChat(formattedChats[0]);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [userToken, user_id]);

  // 🌟 التعامل مع محادثة مستخدم معين
  const handleUserChat = async (userId, existingChats = chats, currentUserId) => {
    try {
      const targetUserId = parseInt(userId);
      
      if (isNaN(targetUserId)) {
        console.error('Invalid user ID:', userId);
        return;
      }
      
      // 🔧 التحقق من أن المستخدم لا يحاول إنشاء محادثة مع نفسه
      // هنا نحتاج الـ currentUserId من الـ API
      if (currentUserId && currentUserId === targetUserId) {
        alert('لا يمكنك إنشاء محادثة مع نفسك');
        return;
      }

      // البحث عن محادثة موجودة مع هذا المستخدم
      const existingChat = existingChats.find(
        chat => chat.other_user?.id === targetUserId
      );

      if (existingChat) {
        await selectChat(existingChat);
      } else {
        try {
          setIsStartingNewChat(true);
          const newConversation = await startConversation(targetUserId);
          
          const newChat = {
            id: newConversation.conversation_id,
            conversation_id: newConversation.conversation_id,
            name: newConversation.other_user.name,
            avatar: newConversation.other_user.name?.charAt(0) || 'U',
            image_profile: newConversation.other_user.image_profile,
            lastMessage: 'بدأ المحادثة',
            lastTime: 'الآن',
            unreadCount: 0,
            other_user: newConversation.other_user
          };
          
          setChats(prev => [newChat, ...prev]);
          await selectChat(newChat);
        } catch (error) {
          console.error('Failed to start conversation:', error);
          if (error.response?.status === 400) {
            alert('لا يمكن إنشاء محادثة مع هذا المستخدم');
          } else {
            alert('فشل في بدء المحادثة. يرجى المحاولة مرة أخرى.');
          }
        } finally {
          setIsStartingNewChat(false);
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
      
      // 🌟 هنا الباكند هو الذي يحدد is_mine
      // لا نحتاج لمقارنة IDs في الفرونتند
      const formattedMessages = chatMessages.map(msg => ({
        id: msg.id,
        content: msg.message,
        is_mine: msg.is_mine,  // 🔥 هذا يأتي من الباكند
        sender: msg.sender,
        timestamp: msg.created_at,
        timestampHuman: msg.created_at_human || msg.created_at,
        is_read: msg.is_read || true
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
      // إنشاء رسالة مؤقتة للعرض الفوري
      const tempMessage = {
        id: Date.now(),
        content,
        is_mine: true,  // 🔥 نفترض أنها رسالتي لأني أنا الذي أرسل
        sender: currentUserInfo,
        timestamp: new Date().toISOString(),
        timestampHuman: 'الآن',
        is_read: false
      };

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
                lastTime: 'الآن',
                last_message: {
                  message: content,
                  created_at: new Date().toISOString()
                }
              }
            : chat
        )
      );
      
      // استبدال الرسالة المؤقتة بالرسالة الرسمية
      setMessages(prev => 
        prev.filter(msg => msg.id !== tempMessage.id).concat([{
          id: sentMessage.id,
          content: sentMessage.message,
          is_mine: sentMessage.is_mine || true,  // 🔥 تأتي من الباكند
          sender: sentMessage.sender || currentUserInfo,
          timestamp: sentMessage.created_at,
          timestampHuman: sentMessage.created_at_human,
          is_read: sentMessage.is_read
        }])
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      alert('فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  // تحديث المحادثات تلقائياً
  useEffect(() => {
    if (!userToken || !selectedChat) return;

    const interval = setInterval(async () => {
      const updatedMessages = await fetchMessages(selectedChat.conversation_id);
      const formattedMessages = updatedMessages.map(msg => ({
        id: msg.id,
        content: msg.message,
        is_mine: msg.is_mine,
        sender: msg.sender,
        timestamp: msg.created_at,
        timestampHuman: msg.created_at_human || msg.created_at,
        is_read: msg.is_read || true
      }));
      setMessages(formattedMessages);
    }, 30000);

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