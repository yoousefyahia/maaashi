import React, { useEffect, useRef, useState } from "react";
import "./sidebarDashboard.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PiTagSimple, PiSignOut } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import {
  IoIosNotificationsOutline,
  IoIosHelpCircleOutline,
} from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { RiBloggerLine } from "react-icons/ri";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../utils/auth";

export default function SidebarDashboard({toggleSidebar, setToggleSidebar, sidebarRef}) {
  const [cookie, , removeCookie] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookie?.token);
  const userID = user?.id;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setErrors] = useState("");

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch (
          `https://api.maaashi.com/api/user/${userID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();        
        if (data?.success) {
          setUserProfile(data.data);
        } else {
          setErrors("حدث خطأ أثناء تحميل البيانات");
        }
      } catch {
        setErrors("فشل الاتصال بالسيرفر");
      } finally {
        setLoading(false);
      }
    };

    if (userID && token) {
      fetchUserProfile();
    }
  }, [userID, token]);

  // تسجيل الخروج
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
        removeCookie("token", { path: "/" });
        navigate("/");
      } else {
        setErrors("حدث خطأ أثناء تسجيل الخروج");
      }
    } catch {
      setErrors("حدث خطأ أثناء الاتصال بالسيرفر أثناء تسجيل الخروج");
    }
  };

  return (
    <div className={`Sidebar_Dashboard ${toggleSidebar ? "" : "hidden" }`} ref={sidebarRef}>
      <div className="Sidebar_Dashboard_content">

        {/* الروابط */}
        <div className="Sidebar_Dashboard_links">
          <ul className="Sidebar_Dashboard_link">
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink to="/accountUser">
                <IoHomeOutline />
                الرئيسيه
              </NavLink>
            </li>
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/offersUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <PiTagSimple />
                العروض
              </NavLink>
            </li>
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/notifactionsUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <IoIosNotificationsOutline />
                الإشعارات
              </NavLink>
            </li>
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/favoritesUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdFavoriteBorder />
                المفضلة
              </NavLink>
            </li>
          </ul>
        </div>

        <hr style={{ marginTop: "10px", color: "#DBDBDB" }} />

        <div className="Sidebar_Dashboard_links">
          <ul className="Sidebar_Dashboard_link">
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/settingsUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineSetting />
                الإعدادات
              </NavLink>
            </li>
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/blogUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <RiBloggerLine />
                المدونة
              </NavLink>
            </li>
            <li onClick={()=>setToggleSidebar(false)}>
              <NavLink
                to="/helpUser"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <IoIosHelpCircleOutline />
                المساعدة
              </NavLink>
            </li>
          </ul>
        </div>

        <hr style={{ marginTop: "10px", color: "#DBDBDB" }} />

        <Link to="/" className="linkToMaaashi" onClick={()=>setToggleSidebar(false)}>
          <img src="images/logo.svg" alt="logo" />
          <span>الذهاب للموقع</span>
        </Link>
        {/*زر تسجيل الخروج */}
        <button className="logout_btn" onClick={() => setShowConfirm(true)}>
          <PiSignOut />
          تسجيل الخروج
        </button>
      </div>

      {/* مودال تأكيد تسجيل الخروج */}
      {showConfirm && (
        <div className="confirm_overlay">
          <div className="confirm_box">
            <PiSignOut className="icon_confirm" />
            <h3 className="confirm_box_title">
              هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
            </h3>
            <p className="confirm_box_par">
              يمكنك دائمًا تسجيل الدخول مرة أخرى لمتابعة نشاطك.
            </p>
            <div className="confirm_actions">
              <button
                className="cancel_btn_confirm"
                onClick={() => setShowConfirm(false)}
              >
                إلغاء
              </button>
              <button
                className="confirm_btn"
                onClick={() => {
                  setShowConfirm(false);
                  handleLogout();
                }}
              >
                تسجيل الخروج
              </button>
              {error && <p className="error_message">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};