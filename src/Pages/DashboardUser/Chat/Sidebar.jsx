import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ chats, selectedChat, onSelectChat, loading }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleSelectChat = (chat) => {
    onSelectChat(chat);
    if (isMobile) setIsCollapsed(true);
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  const getUnreadCount = (chat) => {
    return chat.unread_count || 0;
  };

  const totalUnreadMessages = chats.reduce((total, chat) => total + getUnreadCount(chat), 0);

  const formatTime = (timeString) => {
    if (!timeString) return 'الآن';
    
    if (typeof timeString === 'string') {
      if (timeString.includes('minutes ago')) {
        const minutes = timeString.split(' ')[0];
        return `منذ ${minutes} دقيقة`;
      }
      if (timeString.includes('hours ago')) {
        const hours = timeString.split(' ')[0];
        return `منذ ${hours} ساعة`;
      }
      if (timeString.includes('day ago')) {
        return 'أمس';
      }
      if (timeString.includes('days ago')) {
        const days = timeString.split(' ')[0];
        return `منذ ${days} يوم`;
      }
      if (timeString.includes('ساعة') || timeString.includes('دقيقة') || timeString.includes('يوم')) {
        return timeString;
      }
    }
    
    return 'الآن';
  };

  const getLastMessage = (chat) => {
    if (chat.last_message?.message) {
      return chat.last_message.message;
    }
    if (chat.lastMessage) {
      return chat.lastMessage;
    }
    return 'بدون رسائل';
  };

  const getAvatarFallback = (name) => {
    if (!name || name.trim() === '') return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {isMobile && isCollapsed && (
        <button 
          className="floating-toggle"
          onClick={toggleSidebar}
          aria-label="فتح القائمة"
        >
          ☰
          {totalUnreadMessages > 0 && (
            <span className="floating-badge">
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </span>
          )}
        </button>
      )}

      <div 
        ref={sidebarRef}
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      >
        <div className="sidebar-header">
          <div className="header-content">
            {!isCollapsed && (
              <div className="header-left">
                <h2>المحادثات</h2>
                <span className="chats-count">({chats.length})</span>
                {totalUnreadMessages > 0 && (
                  <span className="unread-badge">
                    {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                  </span>
                )}
              </div>
            )}
            <button 
              className="toggle-btn"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "فتح الشريط الجانبي" : "طي الشريط الجانبي"}
            >
              {isCollapsed ? '☰' : '✕'}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="sidebar-content">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>جاري تحميل المحادثات...</span>
              </div>
            ) : chats.length > 0 ? (
              <div className="chat-list">
                {chats.map(chat => {
                  const unreadCount = getUnreadCount(chat);
                  const avatarFallback = getAvatarFallback(chat.name);
                  
                  return (
                    <div
                      key={chat.conversation_id || chat.id}
                      className={`chat-item ${selectedChat?.conversation_id === chat.conversation_id ? 'active' : ''}`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="chat-avatar">
                        {chat.image_profile ? (
                          <>
                            <img
                              src={chat.image_profile}
                              alt={chat.name}
                              className="chat-avatar-img"
                              onError={handleImageError}
                            />
                            <div className="avatar-fallbaack" style={{ display: 'none' }}>
                              {avatarFallback}
                            </div>
                          </>
                        ) : (
                          <div className="avatar-fallback">
                            {avatarFallback}
                          </div>
                        )}
                        {chat.other_user?.is_online && <span className="online-indicator"></span>}
                        {unreadCount > 0 && <span className="unread-indicator"></span>}
                      </div>
                      <div className="chat-info">
                        <div className="chat-header">
                          <h4>{chat.name}</h4>
                          <span className="chat-time">{formatTime(chat.lastTime || chat.last_message_at)}</span>
                        </div>
                        <p className="last-message">
                          {getLastMessage(chat)}
                        </p>
                        {unreadCount > 0 && (
                          <span className="unread-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-chats">
                <div className="empty-icon">💬</div>
                <p>لا توجد محادثات</p>
                <small>ابدأ محادثة جديدة</small>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;