import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../../utils/auth';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ChatApp.css';

const BASE_URL = 'https://api.maaashi.com/api';

const ChatApp = () => {
  // Hooks and Authentication
  const { user_id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token: userToken, userId: currentUserId, user: currentUser } = parseAuthCookie(cookies?.token);

  // State Management
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Authentication Check
  useEffect(() => {
    if (!userToken) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
    }
  }, [userToken, navigate]);

  // API Service Functions
  const apiService = {
    get: async (endpoint) => {
      try {
        const res = await axios.get(`${BASE_URL}/${endpoint}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        return res.data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(`خطأ في جلب البيانات: ${errorMsg}`);
        throw error;
      }
    },

    post: async (endpoint, data = {}) => {
      try {
        const res = await axios.post(`${BASE_URL}/${endpoint}`, data, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        return res.data;
      } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        const errorMessage = error.response?.data?.message || 'فشل في تنفيذ العملية';
        toast.error(errorMessage);
        throw error;
      }
    }
  };

  // Data Formatters
  const formatMessage = (msg) => ({
    id: msg.id,
    message: msg.message, // حفظ الاسم الأصلي
    content: msg.message, // للتوافق مع المكونات القديمة
    is_mine: msg.is_mine,
    sender: msg.sender || { 
      id: msg.sender_id, 
      name: currentUser?.name, 
      image_profile: currentUser?.image_profile 
    },
    image_profile: msg.sender?.image_profile,
    timestamp: msg.created_at,
    timestampHuman: msg.created_at_human || msg.created_at,
    is_read: msg.is_read || false,
    created_at: msg.created_at,
    created_at_human: msg.created_at_human
  });

  const formatChat = (chat) => ({
    id: chat.conversation_id,
    conversation_id: chat.conversation_id,
    name: chat.other_user?.name || 'مستخدم غير معروف',
    avatar: chat.other_user?.name?.charAt(0) || 'U',
    image_profile: chat.other_user?.image_profile || null,
    lastMessage: chat.last_message?.message || 'بدون رسائل',
    lastTime: chat.last_message_at || 'الآن',
    unread_count: chat.unread_count || 0,
    other_user: chat.other_user,
    last_message: chat.last_message,
    is_online: chat.other_user?.is_online || false,
    last_seen: chat.other_user?.last_seen || 'غير معروف'
  });

  // Core API Functions
  const getCurrentUserId = async () => {
    if (currentUserId) return currentUserId;
    try {
      const response = await apiService.get('user/profile');
      return response.data?.id || null;
    } catch (error) {
      console.error('Error fetching current user ID:', error);
      return null;
    }
  };

  const fetchConversations = useCallback(async () => {
    try {
      const response = await apiService.get('conversations');
      return response.data || [];
    } catch (error) {
      return [];
    }
  }, [userToken]);

  const fetchMessages = async (convId) => {
    try {
      const response = await apiService.get(`conversations/${convId}/messages`);
      return response.data || [];
    } catch (error) {
      return [];
    }
  };

  const sendMessage = async (convId, message) => {
    try {
      const response = await apiService.post('messages/send', { 
        conversation_id: convId, 
        message: message 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await apiService.post(`conversations/start?user_id=${userId}`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Chat List Management
  const updateChatsAfterMessage = (conversationId, newMessage, isMine = true) => {
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat.conversation_id === conversationId) {
          return {
            ...chat,
            last_message: {
              message: newMessage,
              created_at: new Date().toISOString(),
              is_read: false,
              sender_id: isMine ? currentUserId : chat.other_user?.id
            },
            lastMessage: newMessage,
            lastTime: 'الآن',
            unread_count: isMine ? 0 : (chat.unread_count || 0) + 1
          };
        }
        return chat;
      });
      
      // ترتيب المحادثات حسب آخر رسالة
      return updatedChats.sort((a, b) => {
        const timeA = a.last_message?.created_at ? new Date(a.last_message.created_at).getTime() : 0;
        const timeB = b.last_message?.created_at ? new Date(b.last_message.created_at).getTime() : 0;
        return timeB - timeA;
      });
    });
  };

  // Chat Selection
  const selectChat = async (chat) => {
    if (isStartingNewChat || !chat) return;
    
    setMessagesLoading(true);
    setSelectedChat(chat);
    setConversationId(chat.conversation_id);
    
    try {
      const msgs = await fetchMessages(chat.conversation_id);
      
      // تحديث عدد الرسائل غير المقروءة
      setChats(prev => prev.map(c => 
        c.conversation_id === chat.conversation_id ? { ...c, unread_count: 0 } : c
      ));
      
      // تحويل الرسائل إلى التنسيق الصحيح
      const formattedMessages = Array.isArray(msgs) ? msgs.map(formatMessage) : [];
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error selecting chat:', error);
      toast.error('فشل في تحميل المحادثة');
    } finally {
      setMessagesLoading(false);
    }
  };

  // Chat Initialization
  const handleUserChat = async (targetId, existingChats, myUserId) => {
    if (!targetId || !myUserId) return;
    
    if (myUserId === parseInt(targetId)) {
      toast.error('لا يمكنك إنشاء محادثة مع نفسك');
      navigate('/ChatApp'); 
      return;
    }

    // البحث عن محادثة موجودة
    const existingChat = existingChats.find(c => 
      c.other_user && c.other_user.id === parseInt(targetId)
    );
    
    if (existingChat) {
      await selectChat(existingChat);
      return;
    }

    try {
      setIsStartingNewChat(true);
      const newConv = await startConversation(targetId);
      
      // إنشاء محادثة جديدة من الرد
      const newChat = {
        conversation_id: newConv.conversation_id,
        id: newConv.conversation_id,
        name: newConv.other_user?.name || 'مستخدم جديد',
        image_profile: newConv.other_user?.image_profile || null,
        lastMessage: 'بدأ المحادثة',
        lastTime: 'الآن',
        unread_count: 0,
        other_user: newConv.other_user,
        last_message: {
          message: 'بدأ المحادثة',
          created_at: new Date().toISOString(),
          sender_id: currentUserId
        },
        is_online: newConv.other_user?.is_online || false,
        last_seen: newConv.other_user?.last_seen || 'الآن'
      };
      
      setChats(prev => [formatChat(newChat), ...prev]);
      await selectChat(newChat);
      toast.success('تم بدء المحادثة بنجاح');
    } catch (e) {
      console.error('Error starting new chat:', e);
    } finally {
      setIsStartingNewChat(false);
    }
  };

  // Message Handling
  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) {
      toast.warning('يرجى كتابة رسالة');
      return;
    }

    // إنشاء رسالة مؤقتة
    const tempMessage = {
      id: Date.now(),
      message: content,
      content: content,
      is_mine: true,
      sender: currentUser || { id: currentUserId, name: 'أنت' },
      image_profile: currentUser?.image_profile,
      timestamp: new Date().toISOString(),
      timestampHuman: 'الآن',
      is_read: false,
      created_at: new Date().toISOString(),
      created_at_human: 'الآن'
    };
    
    // إضافة الرسالة المؤقتة
    setMessages(prev => [...prev, tempMessage]);
    updateChatsAfterMessage(conversationId, content, true);

    try {
      // إرسال الرسالة الفعلية
      const sent = await sendMessage(conversationId, content);
      
      // استبدال الرسالة المؤقتة بالرسالة الحقيقية
      setMessages(prev => 
        prev.filter(m => m.id !== tempMessage.id).concat([formatMessage({
          ...sent,
          is_mine: true,
          sender: {
            id: sent.sender_id || currentUserId,
            name: currentUser?.name || 'أنت',
            image_profile: currentUser?.image_profile
          }
        })])
      );
            
    } catch (e) {
      console.error('Error sending message:', e);
      // إزالة الرسالة المؤقتة في حالة الخطأ
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      
      // استعادة الحالة السابقة للمحادثة
      setChats(prev => prev.map(chat => 
        chat.conversation_id === conversationId 
          ? { 
              ...chat, 
              last_message: chat.last_message,
              lastMessage: chat.lastMessage,
              lastTime: chat.lastTime 
            }
          : chat
      ));
    }
  };

  // Initial Data Load
  useEffect(() => {
    if (!userToken) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const myUserId = await getCurrentUserId();
        const response = await fetchConversations();
        
        console.log('Conversations loaded:', response); 
        
        const formattedChats = Array.isArray(response) 
          ? response.map(formatChat) 
          : [];
        
        setChats(formattedChats);
        
        // إذا كان هناك user_id في الرابط
        if (targetUserId) {
          await handleUserChat(parseInt(targetUserId), formattedChats, myUserId);
        } else if (formattedChats.length > 0) {
          // اختيار أول محادثة تلقائياً
          await selectChat(formattedChats[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('فشل في تحميل المحادثات');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userToken, targetUserId]);

  // Real-time Updates
  useEffect(() => {
    if (!selectedChat) return;
    
    const updateMessages = async () => {
      try {
        const msgs = await fetchMessages(selectedChat.conversation_id);
        
        if (!Array.isArray(msgs)) return;
        
        const lastMessageId = messages.length > 0 
          ? Math.max(...messages.map(m => m.id)) 
          : 0;
        
        const newMessages = msgs.filter(msg => msg.id > lastMessageId);
        
        if (newMessages.length > 0) {
          setMessages(msgs.map(formatMessage));
          
          // تحديث قائمة المحادثات إذا كانت الرسالة من الطرف الآخر
          if (newMessages.some(msg => !msg.is_mine)) {
            updateChatsAfterMessage(
              selectedChat.conversation_id, 
              newMessages[newMessages.length - 1].message, 
              false
            );
          }
        }
      } catch (error) {
        console.error('Error updating messages:', error);
      }
    };
    
    const interval = setInterval(updateMessages, 7000);
    updateMessages();
    
    return () => clearInterval(interval);
  }, [selectedChat, messages]);

  return (
    <div className="chat-app">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
      />
      
      <Sidebar 
        chats={chats} 
        selectedChat={selectedChat} 
        onSelectChat={selectChat} 
        loading={loading} 
      />
      <div className="chat-main">
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            messagesLoading={messagesLoading}
            isStartingNewChat={isStartingNewChat}
          />
        ) : (
          <div className="no-chat-selected">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <div className="empty-chat-icon">💬</div>
                <p>اختر محادثة للبدء</p>
                <small>أو ابدأ محادثة جديدة</small>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;