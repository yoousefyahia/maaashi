import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useCookies } from 'react-cookie';
import { parseAuthCookie } from '../../../utils/auth';
import axios from 'axios';
import './ChatApp.css';

const BASE_URL = 'https://api.maaashi.com/api';

const ChatApp = () => {
  const { user_id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const { token: userToken, userId: currentUserId, user: currentUser } = parseAuthCookie(cookies?.token);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false); // حالة جديدة

  useEffect(() => {
    if (!userToken) navigate('/login');
  }, [userToken, navigate]);

  const getCurrentUserId = async () => {
    if (currentUserId) return currentUserId;
    try {
      const res = await axios.get(`${BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return res.data.data?.id || null;
    } catch (e) { 
      console.error('Error fetching user profile:', e); 
      return null; 
    }
  };

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/conversations`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return res.data.data || [];
    } catch (e) { 
      console.error('Error fetching conversations:', e); 
      return []; 
    }
  }, [userToken]);

  const startConversation = async (userId) => {
    setIsStartingNewChat(true);
    try {
      const res = await axios.post(`${BASE_URL}/conversations/start?user_id=${userId}`, {}, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return res.data.data;
    } catch (e) { 
      console.error('Error starting conversation:', e); 
      throw e; 
    } finally { 
      setIsStartingNewChat(false); 
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await axios.get(`${BASE_URL}/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return res.data.data || [];
    } catch (e) { 
      console.error('Error fetching messages:', e); 
      return []; 
    }
  };

  const sendMessage = async (convId, message) => {
    try {
      const res = await axios.post(`${BASE_URL}/messages/send`, {
        conversation_id: convId,
        message
      }, { 
        headers: { Authorization: `Bearer ${userToken}` } 
      });
      return res.data.data;
    } catch (e) { 
      console.error('Error sending message:', e); 
      throw e; 
    }
  };

  const updateChatsAfterMessage = (conversationId, newMessage, isMine = true) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.conversation_id === conversationId) {
          return {
            ...chat,
            last_message: {
              message: newMessage,
              created_at: new Date().toISOString(),
              is_read: false,
              sender_id: isMine ? currentUserId : chat.other_user.id
            },
            lastMessage: newMessage,
            lastTime: 'الآن',
            unread_count: isMine ? 0 : (chat.unread_count || 0) + 1
          };
        }
        return chat;
      }).sort((a, b) => {
        const timeA = a.last_message?.created_at ? new Date(a.last_message.created_at) : new Date(0);
        const timeB = b.last_message?.created_at ? new Date(b.last_message.created_at) : new Date(0);
        return timeB - timeA;
      })
    );
  };

  const selectChat = async (chat) => {
    if (isStartingNewChat) return; // منع التبديل أثناء بدء محادثة جديدة
    
    setMessagesLoading(true); // بدء تحميل الرسائل
    setSelectedChat(chat);
    setConversationId(chat.conversation_id);
    
    try {
      const msgs = await fetchMessages(chat.conversation_id);
      
      // تحديث حالة الرسائل كمقروءة في قائمة المحادثات
      setChats(prev => prev.map(c => 
        c.conversation_id === chat.conversation_id 
          ? { ...c, unread_count: 0 }
          : c
      ));
      
      // تنسيق الرسائل
      setMessages(msgs.map(msg => ({
        id: msg.id,
        content: msg.message,
        is_mine: msg.is_mine,
        sender: msg.sender,
        image_profile: msg.sender?.image_profile,
        timestamp: msg.created_at,
        timestampHuman: msg.created_at_human || msg.created_at,
        is_read: msg.is_read || true
      })));
    } catch (error) {
      console.error('Error selecting chat:', error);
    } finally {
      setMessagesLoading(false); // انتهاء تحميل الرسائل
    }
  };

  const handleUserChat = async (targetId, existingChats, myUserId) => {
    if (myUserId === targetId) {
      alert('لا يمكنك إنشاء محادثة مع نفسك');
      navigate('/ChatApp'); 
      return;
    }

    const existingChat = existingChats.find(c => c.other_user?.id === targetId);
    if (existingChat) {
      await selectChat(existingChat);
      return;
    }

    try {
      setIsStartingNewChat(true);
      const newConv = await startConversation(targetId);
      
      const newChat = {
        id: newConv.conversation_id,
        conversation_id: newConv.conversation_id,
        name: newConv.other_user.name,
        avatar: newConv.other_user.name?.charAt(0) || 'U',
        image_profile: newConv.other_user.image_profile,
        lastMessage: 'بدأ المحادثة',
        lastTime: 'الآن',
        unread_count: 0,
        other_user: newConv.other_user,
        last_message: {
          message: 'بدأ المحادثة',
          created_at: new Date().toISOString(),
          sender_id: currentUserId
        }
      };
      
      setChats(prev => [newChat, ...prev]);
      await selectChat(newChat);
    } catch (e) {
      console.error('Error starting new chat:', e);
      alert('فشل في بدء المحادثة.');
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChat || !content.trim()) return;

    // إضافة رسالة مؤقتة
    const tempMessage = {
      id: Date.now(),
      content,
      is_mine: true,
      sender: currentUser,
      image_profile: currentUser?.image_profile,
      timestamp: new Date().toISOString(),
      timestampHuman: 'الآن',
      is_read: false
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    // تحديث قائمة المحادثات
    updateChatsAfterMessage(conversationId, content, true);

    try {
      const sent = await sendMessage(conversationId, content);
      
      // استبدال الرسالة المؤقتة بالرسالة الحقيقية
      setMessages(prev => 
        prev.filter(m => m.id !== tempMessage.id).concat([{
          id: sent.id,
          content: sent.message,
          is_mine: true,
          sender: {
            id: sent.sender_id,
            name: currentUser?.name,
            image_profile: currentUser?.image_profile
          },
          image_profile: currentUser?.image_profile,
          timestamp: sent.created_at,
          timestampHuman: sent.created_at_human,
          is_read: false
        }])
      );
      
    } catch (e) {
      console.error('Error sending message:', e);
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
      
      // التراجع عن تحديث قائمة المحادثات
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
      
      alert('فشل في إرسال الرسالة.');
    }
  };

  useEffect(() => {
    if (!userToken) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const myUserId = await getCurrentUserId();
        const convs = await fetchConversations();
        
        const formatted = convs.map(c => ({
          id: c.conversation_id,
          conversation_id: c.conversation_id,
          name: c.other_user.name,
          avatar: c.other_user.name?.charAt(0) || 'U',
          image_profile: c.other_user.image_profile,
          lastMessage: c.last_message?.message || 'بدأ المحادثة',
          lastTime: c.last_message_at || 'الآن',
          unread_count: c.unread_count || 0,
          other_user: c.other_user,
          last_message: c.last_message
        }));
        
        setChats(formatted);
        
        if (targetUserId) {
          await handleUserChat(parseInt(targetUserId), formatted, myUserId);
        } else if (formatted.length) {
          await selectChat(formatted[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userToken, targetUserId, fetchConversations]);

  useEffect(() => {
    if (!selectedChat) return;
    
    const updateMessages = async () => {
      try {
        const msgs = await fetchMessages(selectedChat.conversation_id);
        
        // التحقق مما إذا كانت هناك رسائل جديدة
        const lastMessageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) : 0;
        const newMessages = msgs.filter(msg => msg.id > lastMessageId);
        
        if (newMessages.length > 0) {
          setMessages(msgs.map(msg => ({
            id: msg.id,
            content: msg.message,
            is_mine: msg.is_mine,
            sender: msg.sender,
            image_profile: msg.sender?.image_profile,
            timestamp: msg.created_at,
            timestampHuman: msg.created_at_human || msg.created_at,
            is_read: msg.is_read || true
          })));
          
          // تحديث قائمة المحادثات إذا كانت الرسائل ليست من المستخدم الحالي
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
    
    const interval = setInterval(updateMessages, 5000);
    
    updateMessages();
    
    return () => clearInterval(interval);
  }, [selectedChat]);

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
            messagesLoading={messagesLoading}
            isStartingNewChat={isStartingNewChat}
          />
        ) : (
          <div className="no-chat-selected">
            {loading ? <p>جاري تحميل المحادثات...</p> : <p>اختر محادثة للبدء</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;