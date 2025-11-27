import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";
import "./topSectionProfile.css";

const TopSectionProfile = () => {
  const [userData, setUserData] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const coverRef = useRef(null);
  const profileRef = useRef(null);
  const [cookie] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookie?.token);
  const userID = user?.id;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !userID) return;

    // قراءة البيانات من localStorage فورًا
    const localData = localStorage.getItem("userData");
    let parsedLocal = null;
    try {
      parsedLocal = localData ? JSON.parse(localData) : null;
    } catch {
      parsedLocal = null;
    }

    if (parsedLocal && parsedLocal.userID === userID) {
      setUserData(parsedLocal);
      if (parsedLocal.cover_image) {
        setCoverImage(parsedLocal.cover_image);
        coverRef.current = parsedLocal.cover_image;
      }
      if (parsedLocal.profile_image) {
        setProfileImage(parsedLocal.profile_image);
        profileRef.current = parsedLocal.profile_image;
      }
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.status) {
          const serverData = { ...data.data, userID };

          // مقارنة الصور قبل التحديث
          const needUpdate =
            !parsedLocal ||
            parsedLocal.profile_image !== data.data.profile_image ||
            parsedLocal.cover_image !== data.data.cover_image;

          if (needUpdate) {
            localStorage.setItem("userData", JSON.stringify(serverData));
            setUserData(serverData);

            if (data.data.profile_image && profileRef.current !== data.data.profile_image) {
              setProfileImage(`${data.data.profile_image}?t=${Date.now()}`);
              profileRef.current = data.data.profile_image;
            }
            if (data.data.cover_image && coverRef.current !== data.data.cover_image) {
              setCoverImage(`${data.data.cover_image}?t=${Date.now()}`);
              coverRef.current = data.data.cover_image;
            }
          }
        } else {
          setError("فشل في تحميل بيانات المستخدم.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات.");
      }
    };

    fetchUserData();
  }, [token, userID]);

  return (
    <div className="accountUserImage_up">
      <div className="Account_user_image">

        {/* صورة الكوفر */}
        {coverImage ? (
          <div className="Account_user_image_profile">
            <img src={coverImage} alt="صورة الكوفر" />
          </div>
        ) : (
          <div className="Account_user_image_profile placeholder">
            <p>لم يتم إضافة صورة الكوفر بعد، الرجاء إضافة صورة من الإعدادات</p>
          </div>
        )}

        {/* صورة البروفايل */}
        {profileImage ? (
          <div className="Account_user_image_profile_person">
            <div className="user_img_container">
              <img src={profileImage} alt="صورة البروفايل" />
            </div>
          </div>
        ) : (
          <div className="Account_user_image_profile_person placeholder">
            <p>لم يتم إضافة صورة البروفايل بعد، الرجاء إضافة صورة من الإعدادات</p>
          </div>
        )}

        <div className="Account_user_info">
          <h3 className="user_name">{userData?.name || "جارٍ التحميل..."}</h3>
          <h6 className="user_status">
            آخر ظهور الآن <span className="status_dot active"></span>
          </h6>
        </div>

        {error && <p className="error_message">{error}</p>}
      </div>
    </div>
  );
};

export default TopSectionProfile;