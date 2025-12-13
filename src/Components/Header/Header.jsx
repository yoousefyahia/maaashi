import React, { useEffect, useRef, useState, useCallback } from "react";
import "./header.css";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { navLinks } from "../../Constants/NavLinks.js";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../utils/auth";

const Header = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [userData, setUserData] = useState({});
  const [showToast, setShowToast] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const mobileProfileCardRef = useRef(null);
  const desktopProfileCardRef = useRef(null);
  const inputRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // ================= Search =================
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const performSearch = useCallback(
    (query) => {
      const q = query.trim();
      if (!q) {
        navigate("/");
      } else {
        navigate(`/?search=${encodeURIComponent(q)}`);
      }
      closeMenu();
    },
    [navigate]
  );

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (typingTimeout) clearTimeout(typingTimeout);

    if (!value.trim()) {
      performSearch("");
      return;
    }

    const t = setTimeout(() => performSearch(value), 500);
    setTypingTimeout(t);
  };

  // ================= Click Outside =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (menuRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      if (mobileProfileRef.current?.contains(target)) return;
      if (desktopProfileRef.current?.contains(target)) return;
      if (mobileProfileCardRef.current?.contains(target)) return;
      if (desktopProfileCardRef.current?.contains(target)) return;

      setMenuOpen(false);
      setMobileProfileOpen(false);
      setDesktopProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= Fetch User =================
  useEffect(() => {
    if (!token) return;

    fetch("https://api.maaashi.com/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data?.data || {});
        // نعرض التوست فقط لو مفيش area
        if (!data?.data?.area || data.data.area === "") {
          setShowToast(true);
        }
      })
      .catch(console.error);
  }, [token]);

  return (
    <header className="header">
      <div className="header-container">
        {/* اللوجو */}
        <div className="logo">
          <NavLink
            to="/"
            onClick={() => {
              closeMenu();
              setSearchQuery("");
              performSearch("");
            }}
          >
            <img src="/images/logo.svg" alt="logo" />
          </NavLink>
        </div>

        {/* البحث في الموبايل */}
        <div className="mobile-search">
          <CiSearch className="search_icon" />
          <input
            type="search"
            placeholder="ابحث هنا..."
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && performSearch(searchQuery)}
          />
        </div>

        {/* أيقونة الموبايل والبروفايل */}
        <div className="menu-mobile-toggle">
          {token ? (
            <div className="mobile-login">
              <Link
                onClick={() => setMobileProfileOpen((p) => !p)}
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
                      ? userData.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "US"}
                  </span>
                )}
              </Link>

              <ProfileCard
                toggleProfileCard={mobileProfileOpen}
                userData={userData}
                removeCookie={removeCookie}
                cardRef={mobileProfileCardRef}
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
            onClick={() => setMenuOpen((p) => !p)}
          >
            ☰
          </div>
        </div>

        {/* الروابط */}
        <ul
          id="primary-navigation"
          ref={menuRef}
          className={`nav ${menuOpen ? "open" : ""}`}
        >
          {navLinks.map((link, i) => (
            <li key={i}>
              <NavLink to={link.path} onClick={closeMenu}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* أزرار الديسكتوب */}
        <div className="header-button">
          {token ? (
            <div>
              <Link
                onClick={() => setDesktopProfileOpen((p) => !p)}
                className="btn_profile"
                ref={desktopProfileRef}
              >
                <span>حسابي</span>
              </Link>

              <ProfileCard
                toggleProfileCard={desktopProfileOpen}
                userData={userData}
                removeCookie={removeCookie}
                cardRef={desktopProfileCardRef}
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

      {token && showToast && <ToastWarning onClose={() => setShowToast(false)} />}
    </header>
  );
};

export default Header;

/* =======================
   ProfileCard
======================= */
function ProfileCard({ toggleProfileCard, userData, removeCookie, cardRef }) {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);

  const handleLogout = async () => {
    try {
      await fetch("https://api.maaashi.com/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    removeCookie("token");
    navigate("/");
  };

  return (
    <div
      ref={cardRef}
      className="profile-card"
      style={{
        height: "280px",
        display: toggleProfileCard ? "block" : "none",
      }}
    >
      <div className="user-info">
        {userData?.image_profile ? (
          <img
            src={userData.image_profile}
            alt={userData?.name}
            className="user_img"
          />
        ) : (
          <span className="two_char">
            {userData?.name
              ? userData.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "US"}
          </span>
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

/* =======================
   ToastWarning
======================= */
export function ToastWarning({ onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div id="toast-warning" className="toast_warning">
      <div className="toast_container">
        <div className="toast-message">
          الرجاء إضافة الموقع من إعدادات الحساب قبل المتابعة.
        </div>

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
