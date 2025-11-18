import React, { useState, useEffect } from "react";
import "./topSectionProfile.css";
import { useCookies } from "react-cookie";

const TopSectionProfile = () => {
  const [userData, setUserData] = useState(null);
  const [cookie] = useCookies(["token"]);
  const userID = cookie?.token?.data?.user?.id;
  const [error, setError] = useState("");

  //جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = cookie?.token?.data?.token;
        if (!token) {
          setError("يرجى تسجيل الدخول مرة أخرى.");
          return;
        }

        const res = await fetch(
          `https://api.maaashi.com/api/user/${userID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
          setError("");
        } else {
          setError("فشل في تحميل بيانات المستخدم.");
        }
      } catch {
        setError("حدث خطأ أثناء تحميل البيانات.");
      }
    };

    fetchUserData();
  }, [cookie]);

  return (
    <div className="accountUserImage_up">
      <div className="Account_user_image">
        {/* صورة الكوفر */}
        <div className="Account_user_image_profile">
          <img src={userData?.cover_image} alt="صورة الكوفر" loading="lazy"/>
        </div>

        {/* صورة البروفايل */}
        <div className="Account_user_image_profile_person">
          <div className="user_img_container">
            <img src={userData?.profile_image} alt="صورة البروفايل" loading="lazy"/>
          </div>
        </div>

        {/* بيانات المستخدم */}
        <div className="Account_user_info">
          <h3 className="user_name">{userData?.name || "جارٍ التحميل..."}</h3>
          <h6 className="user_status">
            آخر ظهور الآن <span className="status_dot active"></span>
          </h6>
        </div>

        {/* عرض الخطأ إن وجد */}
        {error && <p className="error_message">{error}</p>}
      </div>
    </div>
  );
};
export default TopSectionProfile;