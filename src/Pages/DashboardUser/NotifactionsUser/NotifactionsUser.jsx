import React, { useState } from "react";
import "./notifactionsUser.css";

// البيانات المبدئية (الإشعارات) 
// كل إشعار له: id, title, details, time, read (مقروء/غير مقروء)
const initialNotifs = [
  {
    id: 1,
    title: "لديك رسالة جديدة",
    details: "محمد أحمد أرسل لك رسالة حول إعلانك 'سيارة تويوتا كامري 2020'",
    time: "قبل 5 دقائق",
    read: false, // غير مقروء
  },
  {
    id: 2,
    title: "لديك رسالة جديدة",
    details: "محمد أحمد أرسل لك رسالة حول إعلانك 'سيارة تويوتا كامري 2020'",
    time: "قبل 10 دقائق",
    read: false, // غير مقروء
  },
  {
    id: 3,
    title: "لديك رسالة جديدة",
    details: "محمد أحمد أرسل لك رسالة حول إعلانك 'سيارة تويوتا كامري 2020'",
    time: "2025/09/01",
    read: true, // مقروء
  },
];

// التابات (الأزرار اللي بتفلتر الإشعارات)
const Tabs = ["الكل", "غير مقروءة", "مقروءة"];

function NotifactionsUser() {
  // حالة الإشعارات
  const [notifs, setNotifs] = useState(initialNotifs);

  // حالة التاب الحالي (مبدئيًا "الكل")
  const [activeTab, setActiveTab] = useState("الكل");

  // فلترة الإشعارات حسب التاب
  const filtered = notifs.filter((n) => {
    if (activeTab === "غير مقروءة") return !n.read; // لو التاب "غير مقروءة" رجع اللي read = false
    if (activeTab === "مقروءة") return n.read; // لو التاب "مقروءة" رجع اللي read = true
    return true; // لو "الكل" رجع كل الإشعارات
  });

  // دالة لتعليم إشعار معين كمقروء
  
  // eslint-disable-next-line
  const markAsRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="notifs_wrap">
      {/* التابات (الأزرار اللي فوق) */}
      <nav className="notifs_tabs">
        {Tabs.map((t) => (
          <button
            key={t}
            className={`tab_btn ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
            {/* عداد لعدد الإشعارات الغير مقروءة جنب التاب */}
            {t === "غير مقروءة" && (
              <span className="tab_count">
                {notifs.filter((n) => !n.read).length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* قائمة الإشعارات */}
      <ul className="notifs_list">
        {filtered.map((n) => (
          <li key={n.id} className={`notif_item ${!n.read ? "unread" : ""}`}>
            <div className="notif_header">
              <div className="notif_title">
                {/* النقطة الحمراء تظهر لو الإشعار غير مقروء */}
                {!n.read && <span className="dot"></span>}
                {n.title}
              </div>
              <div className="notif_time">{n.time}</div>
            </div>

            <div className="notif_details">{n.details}</div>
            <hr className="spice" />
          </li>
        ))}

        {/* لو مفيش إشعارات بعد الفلترة */}
        {filtered.length === 0 && (
          <li className="empty_notif">لا توجد إشعارات</li>
        )}
      </ul>
    </div>
  );
}

export default NotifactionsUser;
