import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
import './Sidebar.css';

const Sidebar = ({ chats, selectedChat, onSelectChat, loading }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // اكتشاف حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // على الجوال، إخفاء الشريط تلقائياً
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // إغلاق الشريط عند اختيار محادثة على الجوال
  const handleSelectChat = (chat) => {
    onSelectChat(chat);
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* طبقة شفافة لإغلاق الشريط على الجوال */}
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay active"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* زر عائم للجوال */}
      {isMobile && isCollapsed && (
        <button 
          className="floating-toggle"
          onClick={toggleSidebar}
          aria-label="فتح القائمة"
        >
          <span className="menu-icon">☰</span>
          {chats.filter(chat => chat.unreadCount > 0).length > 0 && (
            <span className="floating-badge">
              {chats.filter(chat => chat.unreadCount > 0).length}
            </span>
          )}
        </button>
      )}

      {/* الشريط الجانبي */}
       <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="header-content">
            {!isCollapsed && (
              <div className="header-left">
                <h2>المحادثات</h2>
                <span className="chats-count">({chats.length})</span>
                {chats.filter(chat => chat.unreadCount > 0).length > 0 && (
                  <span className="unread-badge">
                    {chats.filter(chat => chat.unreadCount > 0).length}
                  </span>
                )}
              </div>
            )}
            {/* ... */}
          </div>
        </div>
        
  {!isCollapsed && (
  <div className="sidebar-content no-scrollbar"> {/* إضافة class no-scrollbar */}
    {loading ? (
      <div className="loading">
        <div className="spinner"></div>
        <span>جاري تحميل المحادثات...</span>
      </div>
    ) : chats.length > 0 ? (
      <div className="chat-list"> {/* إزالة الـ wrapper تماماً */}
        {chats.map(chat => (
          <div
            key={chat.conversation_id || chat.id}
            className={`chat-item ${selectedChat?.conversation_id === chat.conversation_id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-avatar">
              {chat.image_profile ? (
                <img 
                  src={chat.image_profile} 
                  alt={chat.name}
                  className="chat-avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.avatar-fallback').style.display = 'flex';
                  }}
                />
              ) : (
                <div className="avatar-fallback">
                  {chat.avatar}
                </div>
              )}
              {chat.unreadCount > 0 && (
                <span className="unread-indicator"></span>
              )}
            </div>
            <div className="chat-info">
              <div className="chat-header">
                <h4>{chat.name}</h4>
                <span className="chat-time">{chat.lastTime}</span>
              </div>
              <p className="last-message">
                {chat.lastMessage.length > 30 
                  ? `${chat.lastMessage.substring(0, 30)}...`
                  : chat.lastMessage}
              </p>
              {chat.unreadCount > 0 && (
                <span className="unread-count">{chat.unreadCount}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="no-chats">
        <div className="empty-icon">💬</div>
        <p>لا توجد محادثات</p>
        <small>ابدأ محادثة من أي إعلان</small>
      </div>
    )}
  </div>
)}
      </div>
    </>
  );
};

export default Sidebar;