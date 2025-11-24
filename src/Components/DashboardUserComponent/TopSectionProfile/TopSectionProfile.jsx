import React, { useState, useEffect } from "react";
import "./topSectionProfile.css";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";

const TopSectionProfile = () => {
  const [userData, setUserData] = useState(null);
  const [coverImage, setCoverImage] = useState("/default-cover.jpg");
  const [profileImage, setProfileImage] = useState("/default-user.jpg");
  const [cookie] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookie?.token);
  const userID = user?.id;
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          setError("يرجى تسجيل الدخول مرة أخرى.");
          return;
        }

        const res = await axios.get("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.status) {
          setUserData(data.data);

          // تحديث الصور فقط إذا لم يتم تغييرها بالفعل
          setProfileImage(prev =>
            prev === "/default-user.jpg" && data.data.profile_image
              ? `${data.data.profile_image}?t=${Date.now()}`
              : prev
          );

          setCoverImage(prev =>
            prev === "/default-cover.jpg" && data.data.cover_image
              ? `${data.data.cover_image}?t=${Date.now()}`
              : prev
          );

          setError("");
        } else {
          setError("فشل في تحميل بيانات المستخدم.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات.");
      }
    };

    if (userID && token) {
      fetchUserData();
    }
  }, [userID, token]);

  return (
    <div className="accountUserImage_up">
      <div className="Account_user_image">
        {/* صورة الكوفر */}
        <div className="Account_user_image_profile">
          <img src={coverImage} alt="صورة الكوفر" loading="lazy" />
        </div>

        {/* صورة البروفايل */}
        <div className="Account_user_image_profile_person">
          <div className="user_img_container">
            <img src={profileImage} alt="صورة البروفايل" loading="lazy" />
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
