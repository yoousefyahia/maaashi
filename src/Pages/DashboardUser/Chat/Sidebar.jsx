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
      <div 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      >
        <div className="sidebar-header">
          <div className="header-content">
            {!isCollapsed && (
              <div className="header-left">
                <h2>المحادثات</h2>
                {chats.filter(chat => chat.unreadCount > 0).length > 0 && (
                  <span className="unread-badge">
                    {chats.filter(chat => chat.unreadCount > 0).length}
                  </span>
                )}
              </div>
            )}
            
            <button 
              className="toggle-btn"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "فتح القائمة" : "إغلاق القائمة"}
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
                <span>جاري التحميل...</span>
              </div>
            ) : chats.length > 0 ? (
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
              />
            ) : (
              <div className="no-chats">
                <div className="empty-icon">💬</div>
                <p>لا توجد محادثات</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;