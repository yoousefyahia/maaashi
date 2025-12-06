import React, { useEffect, useRef, useState, useCallback } from "react";
import "./header.css";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { navLinks } from "../../Constants/NavLinks.js";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../utils/auth";

const Header = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [userData, setUserData] = useState({});
  const [showToast, setShowToast] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const inputRef = useRef(null);

  const handleFocus = () => inputRef.current.focus();
  const closeMenu = () => setMenuOpen(false);

  // تحديث البحث عند تغيير الـ URL
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  // دالة البحث مع Debounce
  const performSearch = useCallback((query) => {
    const trimmedQuery = query.trim();
    
    // إذا كان البحث فارغًا، ارجع للصفحة الرئيسية
    if (!trimmedQuery) {
      navigate('/');
      return;
    }
    
    // إذا كان البحث في الصفحة الرئيسية، قم بتحديث URL فقط
    if (location.pathname === '/') {
      navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      // إذا كان في صفحة أخرى، اذهب للصفحة الرئيسية مع البحث
      navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
    }
    closeMenu();
  }, [navigate, location.pathname]);

  // معالجة تغيير حقل البحث مع Debounce
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    // إلغاء الوقت السابق
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // إذا كان الحقل فارغًا، امسح البحث فورًا
    if (!value.trim()) {
      performSearch('');
      return;
    }
    
    // تأخير البحث لـ 500ms بعد توقف الكتابة
    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    
    setTypingTimeout(timeout);
  };

  // البحث عند الضغط على Enter أو الأيقونة (اختياري)
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    performSearch(searchQuery);
  };

  // تنظيف timeout عند unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // إغلاق المينيو وكارت البروفايل عند الضغط خارجهم أو scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      if (mobileProfileRef.current?.contains(target)) return;
      if (desktopProfileRef.current?.contains(target)) return;

      setMenuOpen(false);
      setMobileProfileOpen(false);
      setDesktopProfileOpen(false);
    };

    const handleScroll = () => {
      if (window.innerWidth <= 768) setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // جلب بيانات المستخدم من السيرفر
  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.maaashi.com/api/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setUserData(data.data || {});
      } catch (err) {
        if (err.name !== "AbortError") console.error(err.message);
      }
    };

    fetchUserData();
    return () => controller.abort();
  }, [token]);

  return (
    <header className="header">
      <div className="header-container">
        {/* اللوجو */}
        <div className="logo">
          <NavLink to="/" onClick={() => { 
            closeMenu(); 
            setSearchQuery('');
            performSearch('');
          }}>
            <img src="/images/logo.svg" alt="logo" />
          </NavLink>
        </div>

        {/* البحث في الموبايل */}
        <div className="mobile-search">
          <CiSearch className="search_icon" onClick={handleSearchSubmit} />
          <input 
            type="search" 
            placeholder="ابحث هنا..." 
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
          />
        </div>

        {/* أيقونة الموبايل والبروفايل */}
        <div className="menu-mobile-toggle">
          {token ? (
            <div className="mobile-login">
              <Link
                onClick={() => setMobileProfileOpen((prev) => !prev)}
                className="header_profile_img"
                ref={mobileProfileRef}
              >
                {userData?.image_profile ? (
                  <img
                    src={userData.image_profile}
                    alt={userData?.name}
                    className="user_img"
                  />
                ) : (
                  <span className="two_char">
                    {userData?.name
                      ? userData.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                      : "US"}
                  </span>
                )}
              </Link>
              <ProfileCard
                toggleProfileCard={mobileProfileOpen}
                userData={userData}
                removeCookie={removeCookie}
                onClose={() => setMobileProfileOpen(false)}
              />
            </div>
          ) : (
            <NavLink to="/login" className="mobile_loginBTN">
              تسجيل الدخول
            </NavLink>
          )}

          {/* زر المينيو */}
          <div
            ref={toggleRef}
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 5h18M3 12h18M3 19h18" />
            </svg>
          </div>
        </div>

        {/* الروابط الرئيسية */}
        <ul
          id="primary-navigation"
          ref={menuRef}
          className={`nav ${menuOpen ? "open" : ""}`}
        >
          {navLinks.map((link, i) => (
            <li key={i}>
              <NavLink to={link.path} onClick={closeMenu} end={link.path === "/"}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* أزرار الديسكتوب */}
        <div className="header-button">
          {/* إضافة البحث في الديسكتوب أيضًا */}
          {/* <div className="desktop-search">
            <input 
              type="search" 
              placeholder="ابحث هنا..." 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            />
            <CiSearch className="search_icon" onClick={handleSearchSubmit} />
          </div> */}
          
          {token ? (
            <div>
              <Link
                onClick={() => setDesktopProfileOpen((prev) => !prev)}
                className="btn_profile"
                ref={desktopProfileRef}
              >
                <span>حسابي</span>
              </Link>
              <ProfileCard
                toggleProfileCard={desktopProfileOpen}
                userData={userData}
                removeCookie={removeCookie}
                onClose={() => setDesktopProfileOpen(false)}
              />
            </div>
          ) : (
            <NavLink to="/login" className="btn-delete">
              <span>تسجيل الدخول</span>
            </NavLink>
          )}

          <NavLink to="/Advertisements" className="btn-add">
            <span>اضف عرضك</span>
          </NavLink>
        </div>
      </div>

      {/* Toast */}
      {token && showToast && (!userData?.area || userData?.area === "") && (
        <ToastWarning
          message="الرجاء إضافة الموقع قبل المتابعة."
          onClose={() => setShowToast(false)}
        />
      )}
    </header>
  );
};

export default Header;


// =======================
// ProfileCard Component
// =======================
export function ProfileCard({ toggleProfileCard, userData, removeCookie, onClose }) {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);

  const handleLogout = async () => {
    try {
      const response = await fetch("https://api.maaashi.com/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        removeCookie("token");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const initials = userData?.name
    ? userData.name
    : "مستحدم جديد";

  return (
    <div
      className="profile-card"
      style={{
        height: "280px",
        opacity: toggleProfileCard ? 1 : 0,
        transition: "opacity 0.3s"
      }}
    >
      <div className="user-info">
{userData?.image_profile ? (
  <img src={userData.image_profile} alt={userData?.name} className="user_img" />
) : (
  <span className="two_char">{initials}</span>
)}

        <div>
          <p className="greeting">أهلا</p>
        </div>
      </div>
      <Link to="/accountUser" className="show_accountUser">
        عرض الملف الشخصي
      </Link>
      <Link to="/settingsUser" className="settings">
        إعدادات الحساب
      </Link>
      <button className="logout-btn" onClick={handleLogout}>
        تسجيل الخروج
      </button>
    </div>
  );
}

// =======================
// ToastWarning Component
// =======================

export function ToastWarning({ onClose }) {
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const controller = new AbortController();

    const checkUserArea = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        if (isMounted && (!data?.data?.area || data.data.area === "")) {
          setVisible(true);
          // اغلاق التوست تلقائياً بعد ثانيتين
          setTimeout(() => {
            setVisible(false);
            onClose();
          }, 2000);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err.message);
      }
    };

    checkUserArea();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token, onClose]);

  if (!visible) return null;

  return (
    <div id="toast-warning" className="toast_warning">
      <div className="toast_container">
        <div className="toast-message">الرجاء إضافة الموقع من اعدادت الحساب قبل المتابعة.</div>
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="toast-close-btn"
        >
          ×
        </button>
        <div className="progress-line" />
      </div>
    </div>
  );
}