import React, { useEffect, useRef, useState } from "react";
import "./layoutProfile.css";
import HeaderDashboard from "../Components/HeaderDashboard/HeaderDashboard";
import SidebarDashboard from "../Components/SidebarDashboard/SidebarDashboard";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import LoginRequiredCard from "../Components/AdvertisementsComponents/LoginRequiredCard/LoginRequiredCard";
import { parseAuthCookie } from "../utils/auth";

const LayoutProfile = ({ children }) => {
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);

  // لو الناف بار موجود داخل الرسايل يخفيه
  const location = useLocation();

  // الصفحات اللي مش عاوز يظهر فيها الناف بار
  const navNone = ["/ChatApp"];

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  useEffect(() => {
    if (!toggleSidebar) return;

    const handleClickOutside = (e) => {
      const target = e.target;

      if (
        (sidebarRef.current && sidebarRef.current.contains(target)) ||
        (toggleBtnRef.current && toggleBtnRef.current.contains(target))
      ) {
        return;
      }

      setToggleSidebar(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleSidebar]);

  // لما اضغط علي الصفحه يغير البيانات
  const pageInfo = {
    "/accountUser": {
      title: "متجرك من ",
      desc: "عرّف بنفسك واجعل ملفك أكثر وضوحًا",
    },
    "/offersUser": {
      title: "قائمه عروضك ",
      desc: "تابع وأدِر جميع عروضك بسهولة من هنا",
    },
    "/notifactionsUser": {
      title: "اشعاراتك ",
      desc: "تابع أحدث المستجدات حول عروضك ورسائلك",
    },
    "/favoritesUser": {
      title: "مفضلتك ",
      desc: "اعرض وأدر جميع إعلاناتك المحفوظة بسهولة",
    },
    "/settingsUser": {
      title: "اعداداتك ",
      desc: "تحكم في حسابك وإعداداتك بسهولة من هنا",
    },
    "/blogUser": {
      title: "أهم المقالات ",
      desc: "تابع وأدِر جميع عروضك بسهولة من هنا",
    },
    "/helpUser": {
      title: "مركز المساعده ",
      desc: "اعثر على إجابات لأسئلتك وتعلّم كيف تستخدم ماشي بسهولة",
    },
      "/ChatApp": {
      title: "مركز الرسائل ",
      desc:" تواصل مع المشترين والبائعين بسهولة من خلال مركز الرسائل الخاص بك",
    },
  };

  // الصفحه الحاليه
  const cur = pageInfo[location.pathname] || {
    // قيم افتراضيه
    title: "الملف الشخصي ",
    desc: "مرحبًا بك في حسابك الشخصي",
  };
  return (
    <div className="layoutProfile">
      {token ?
        <div className="layoutProfile_main">
          <div className="toggle_sidebar" onClick={() => setToggleSidebar(!toggleSidebar)} ref={toggleBtnRef} >
            {toggleSidebar ?
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-columns2-icon lucide-columns-2"><rect width={18} height={18} x={3} y={3} rx={2} /><path d="M12 3v18" /></svg>
            }
          </div>
          {/* السايدبار الثابت */}
          <div className="layoutProfile_sidebar">
            <SidebarDashboard
              toggleSidebar={toggleSidebar}
              setToggleSidebar={setToggleSidebar}
              sidebarRef={sidebarRef}
            />
          </div>

          {/* باقي الصفحة (الهيدر + المحتوى) */}
          <div className="layoutProfile_body">
            {!navNone.includes(location.pathname) && (
              <HeaderDashboard title={cur.title} desc={cur.desc} />
            )}
            <div className="layoutProfile_content">{children}</div>
          </div>
        </div>
        :
        <LoginRequiredCard />
      }
    </div>
  );
};
export default LayoutProfile;