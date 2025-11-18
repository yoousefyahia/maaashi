import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { navLinks } from "../../Constants/NavLinks.js";
import { useCookies } from "react-cookie";

const Header = () => {
  // بنستخدم useCookies عشان نقدر نقرأ ونمسح الكوكيز (زي التوكن)
  const [cookies, removeCookie] = useCookies(["token"]);
  const userID = cookies?.token?.data?.user?.id;
  const token = cookies?.token?.data?.token;

  // بنجيب بيانات المستخدم من التوكن اللي في الكوكيز
  const [userData, setUserData] = useState({});
  const [showToast, setShowToast] = useState(true);

  // حالة لإظهار أو إخفاء كارت البروفايل لما نضغط على الصورة
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);

  // حالة فتح أو غلق المينيو في الموبايل
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false); // دالة لغلق المينيو بسهولة

  // مراجع (refs) لعناصر معينة في الـ DOM عشان نتحكم فيها
  const menuRef = useRef(null);      // تمثل قائمة الروابط (ul)
  const toggleRef = useRef(null);    // تمثل زر فتح المينيو
  const mobileProfileRef = useRef(null);
  const desktopProfileRef = useRef(null);   // تمثل صورة أو زر البروفايل

  const inputRef = useRef(null);   // الضغط علي البحث يوجهك لل input

  const handleFocus = () => {
    inputRef.current.focus();
  }

  // useEffect الأول: يقفل المينيو أو كارت البروفايل لما نضغط على زر Escape
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

    // يقفل المينيو لما المستخدم يعمل scroll في الموبايل
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);


  useEffect(() => {
    if (!userID || !token) return;

    const controller = new AbortController();

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://api.maaashi.com/api/user/${userID}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err.message);
      }
    };

    fetchUserData();
    return () => controller.abort();
  }, [userID, token]);


  return (
    <header className="header">
      <div className="header-container">

        {/* اللوجو */}
        <div className="logo">
          <NavLink to="/" onClick={closeMenu}>
            <img src="/images/logo.svg" alt="logo" />
          </NavLink>
        </div>

        {/* مربع البحث في الموبايل */}
        <div className="mobile-search">
          <CiSearch className="search_icon" onClick={handleFocus} />
          <input type="search" placeholder="ابحث هنا..." ref={inputRef} />
        </div>

        {/* الجزء الخاص بالموبايل (زر المينيو + صورة البروفايل أو تسجيل الدخول) */}
        <div className="menu-mobile-toggle">

          {/* لو المستخدم مسجل دخول */}
          <div className="mobile-login">
            {Boolean(token) ? (
              <div>
                {/* صورة أو أول حرفين من الاسم */}
                <Link
                  type="button"
                  onClick={() => setMobileProfileOpen((prev) => !prev)}
                  className="header_profile_img"
                  ref={mobileProfileRef}
                >
                  {userData?.profile_image === null ? (
                    <span className="two_char">
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx={12} cy={10} r={4} /><circle cx={12} cy={12} r={10} /></svg>
                    </span>
                  ) : (
                    <img src={userData?.profile_image} alt={userData?.name?.split(" ").map((word) => word[0]).join(" ").toUpperCase()} className="user_img" />
                  )}
                </Link>

                {/* كارت البروفايل */}
                <ProfileCard
                  toggleProfileCard={mobileProfileOpen}
                  userData={userData}
                  removeCookie={removeCookie}
                  onClose={() => setMobileProfileOpen(false)}
                  triggerRef={mobileProfileRef}
                />
              </div>
            ) : (
              <NavLink to="/login" className="mobile_loginBTN">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in">
                  <path d="m10 17 5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                </svg>
              </NavLink>
            )}
          </div>

          {/* زر فتح وغلق المينيو (الهامبرجر) */}
          <div
            ref={toggleRef}
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)} // قلب الحالة
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {/* أيقونة الهامبرجر */}
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
              className="lucide lucide-text-align-justify"
            >
              <path d="M3 5h18" />
              <path d="M3 12h18" />
              <path d="M3 19h18" />
            </svg>
          </div>
        </div>

        {/* قائمة الروابط الرئيسية */}
        <ul onClick={(e) => {

          // لما المستخدم يضغط خارج اللينكات
          if (e.target) {
            setMenuOpen(false);
          }
        }}
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

        {/* أزرار الهيدر في الديسكتوب */}
        <div className="header-button">
          {cookies?.token?.data?.token && cookies?.token?.data?.token !== "undefined" ? (
            <div>
              {/* زر البروفايل في الديسكتوب */}
              <Link
                type="button"
                onClick={() => setDesktopProfileOpen((prev) => !prev)}
                className="btn_profile" ref={desktopProfileRef}
              >
                <span>حسابي</span>
                {/* سهم للأسفل */}
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down" >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>

              {/* كارت البروفايل */}
              <ProfileCard
                toggleProfileCard={desktopProfileOpen}
                userData={userData}
                removeCookie={removeCookie}
                onClose={() => setDesktopProfileOpen(false)}
                triggerRef={desktopProfileRef}
              />
            </div>
          ) : (
            // زر تسجيل الدخول لو مش داخل
            <NavLink to="/login" className="btn-delete">
              <span>تسجيل الدخول</span>
            </NavLink>
          )}

          {/* زر إضافة إعلان جديد */}
          <NavLink to="/Advertisements" className="btn-add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span>اضف عرضك</span>
          </NavLink>
        </div>
      </div>
      {Boolean(token) && showToast && userData?.area === null && (<ToastWarning message="الرجاء إضافة الموقع قبل المتابعة." onClose={() => setShowToast(false)} />)}
    </header>
  );
};
export default Header;

export function ProfileCard({ toggleProfileCard, userData, removeCookie, onClose, triggerRef }) {
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(["token"]);
  const token = cookies?.token?.data?.token;
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      const clickedOutsideCard = cardRef.current && !cardRef.current.contains(target);
      const clickedOutsideButton = triggerRef?.current && !triggerRef.current.contains(target);

      // نقفل الكارت لو الضغط مش على الكارت ولا على الزر اللي بيفتحه
      if (clickedOutsideCard && clickedOutsideButton) {
        onClose?.();
      }
    };

    const handleScroll = () => {
      onClose?.();
    };

    if (toggleProfileCard) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toggleProfileCard, onClose, triggerRef]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://api.maaashi.com/api/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        removeCookie("token");
        navigate("/");
      } else {
        setErrors("حدث خطأ أثناء تسجيل الخروج");
      }
    } catch {
      setErrors("حدث خطأ أثناء الاتصال بالسيرفر أثناء تسجيل الخروج");
    }
  };
  return (
    <div className="profile-card" style={{ height: toggleProfileCard ? "280px" : "0" }} ref={cardRef}>
      <div className="user-info">
        {userData?.profile_image === null ? (
          <span className="two_char">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx={12} cy={10} r={4} /><circle cx={12} cy={12} r={10} /></svg>
          </span>
        ) : (
          <img src={userData.profile_image} alt={userData?.name?.split(" ").map((word) => word[0]).join(" ").toUpperCase()} className="user_img" />
        )}
        <div>
          <p className="greeting">أهلا</p>
          <p className="username">{userData?.name?.split(" ").slice(0, 2).join(" ")}</p>
        </div>
      </div>
      <Link to="/accountUser" className="show_accountUser"><span>عرض الملف الشخصي</span></Link>
      <Link to="/settingsUser" className="settings">
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings">
          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
          <circle cx={12} cy={12} r={3} />
        </svg>
        <span>إعدادات الحساب</span>
      </Link>
      <button
        className="logout-btn"
        onClick={() => handleLogout()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
          <path d="m16 17 5-5-5-5" /> <path d="M21 12H9" /> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        </svg>
        <span>تسجيل الخروج</span>
      </button>
    </div>
  )
};

export function ToastWarning({ message = "الرجاء إضافة الموقع قبل المتابعة.", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div id="toast-warning" role="alert" className="toast_warning">
      <div className="toast_container">
        <div className="toast-icon">
          <svg className="toast-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" /></svg>
        </div>

        <div className="toast-message">{message}</div>

        <button type="button" className="toast-close-btn" aria-label="Close" onClick={onClose} >
          <svg className="toast-close-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" ><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg>
        </button>

        <div className="progress-line" />
      </div>
    </div>
  );
};