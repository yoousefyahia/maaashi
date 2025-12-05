import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ chats, selectedChat, onSelectChat, loading }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // اكتشاف حجم الشاشة
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

  // معالجة خطأ تحميل الصور
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  // استخدام unread_count من البيانات الحقيقية
  const getUnreadCount = (chat) => {
    return chat.unread_count || chat.unreadCount || 0;
  };

  // حساب إجمالي الرسائل غير المقروءة
  const totalUnreadMessages = chats.reduce((total, chat) => total + getUnreadCount(chat), 0);

  return (
    <>
      {/* طبقة شفافة لإغلاق الشريط على الجوال */}
      {isMobile && !isCollapsed && (
        <div 
          className="sidebar-overlay"
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
          ☰
          {totalUnreadMessages > 0 && (
            <span className="floating-badge">
              {totalUnreadMessages}
            </span>
          )}
        </button>
      )}

      {/* الشريط الجانبي */}
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
                    {totalUnreadMessages}
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
          <div className="sidebar-content no-scrollbar">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>جاري تحميل المحادثات...</span>
              </div>
            ) : chats.length > 0 ? (
              <div className="chat-list">
                {chats.map(chat => {
                  // الحصول على الحرف الأول من الاسم للصورة البديلة
                  const avatarFallback = chat.name?.charAt(0)?.toUpperCase() || '?';
                  const unreadCount = getUnreadCount(chat);
                  
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
                              className="chat-avatar-image"
                              onError={handleImageError}
                            />
                            <div className="avatar-fallback" style={{ display: 'none' }}>
                              {avatarFallback}
                            </div>
                          </>
                        ) : (
                          <div className="avatar-fallback">
                            {avatarFallback}
                          </div>
                        )}
                        {unreadCount > 0 && <span className="unread-indicator"></span>}
                      </div>
                      <div className="chat-info">
                        <div className="chat-header">
                          <h4>{chat.name}</h4>
                          <span className="chat-time">{chat.lastTime || chat.last_message_at || 'الآن'}</span>
                        </div>
                        <p className="last-message">
                          {chat.last_message?.message || chat.lastMessage || 'بدون رسائل'}
                        </p>
                        {unreadCount > 0 && (
                          <span className="unread-count">{unreadCount}</span>
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