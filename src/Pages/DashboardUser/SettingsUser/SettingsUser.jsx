import React, { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import defaultProfile from "../../../assets/default-profile.jpg";
import defaultCover from "../../../assets/default-cover.jpg";

const SettingsUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const profileRef = useRef(null);
  const coverRef = useRef(null);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // قراءة البيانات من localStorage أولًا
  // ================================
  useEffect(() => {
    if (!token || !userID) return;

    const localData = localStorage.getItem("userData");
    let parsedLocal = null;
    try {
      parsedLocal = localData ? JSON.parse(localData) : null;
    } catch {
      parsedLocal = null;
    }

    if (parsedLocal && parsedLocal.userID === userID) {
      setUserData(parsedLocal);
      if (parsedLocal.profile_image) {
        setProfileImage(parsedLocal.profile_image);
        profileRef.current = parsedLocal.profile_image;
      }
      if (parsedLocal.cover_image) {
        setCoverImage(parsedLocal.cover_image);
        coverRef.current = parsedLocal.cover_image;
      }
    }

    // ================================
    // جلب البيانات من السيرفر ومقارنة الصور
    // ================================
    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        if (data.status) {
          const serverData = { ...data.data, userID };

          const needUpdate =
            !parsedLocal ||
            parsedLocal.profile_image !== data.data.profile_image ||
            parsedLocal.cover_image !== data.data.cover_image ||
            parsedLocal.name !== data.data.name ||
            parsedLocal.email !== data.data.email ||
            parsedLocal.phone !== data.data.phone;

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
        }
      } catch (err) {
        toast.error("فشل تحميل بيانات المستخدم من السيرفر");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, userID]);

  const triggerProfileInput = () => profileInputRef.current?.click();
  const triggerCoverInput = () => coverInputRef.current?.click();

  // ================================
  // رفع صورة البروفايل
  // ================================
  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("لم يتم اختيار أي صورة");

    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);

    const formData = new FormData();
    formData.append("image", file);

    try {
      toast("جارٍ رفع الصورة...");
      const res = await axios.post(
        "https://api.maaashi.com/api/profile/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        setProfileImage(`${res.data.data.profile_image}?t=${Date.now()}`);
        profileRef.current = res.data.data.profile_image;

        const updatedData = { ...userData, profile_image: res.data.data.profile_image };
        setUserData(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));

        toast.success("تم تحديث صورة البروفايل!");
      }
    } catch {
      toast.error("فشل رفع صورة البروفايل!");
    }
  };

  // ================================
  // رفع صورة الكوفر
  // ================================
  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("لم يتم اختيار أي صورة");

    const previewURL = URL.createObjectURL(file);
    setCoverImage(previewURL);

    const formData = new FormData();
    formData.append("cover", file);

    try {
      toast("جارٍ رفع صورة الكوفر...");
      const res = await axios.post(
        "https://api.maaashi.com/api/profile/cover",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        setCoverImage(`${res.data.data.cover_image}?t=${Date.now()}`);
        coverRef.current = res.data.data.cover_image;

        const updatedData = { ...userData, cover_image: res.data.data.cover_image };
        setUserData(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));

        toast.success("تم تحديث صورة الكوفر!");
      }
    } catch {
      toast.error("فشل رفع صورة الكوفر!");
    }
  };

  return (
    <div className="Settings_user">
      <Toaster position="top-right" />

      <div className="settings_user_container">
        <div className="Settings_user_image">
          <div className="image_container">

            {/* صورة الكوفر */}
            <div className="Settings_user_image_cover">
              <img src={coverImage || defaultCover} alt="Cover" />
              <button className="change_banner_btn" onClick={triggerCoverInput}>
                <FaCamera /> تغيير
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: "none" }}
              />
            </div>

            {/* صورة البروفايل */}
            <div className="Settings_user_image_profile">
              <div className="user_img_container">
                <img src={profileImage || defaultProfile} alt="Profile" />
                <button
                  className="profile_camera_icon"
                  type="button"
                  onClick={triggerProfileInput}
                >
                  <FaCamera />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>

          </div>

          <div className="user_name">
            <h3>{loading ? "جارٍ التحميل..." : userData?.name || "مستخدم جديد"}</h3>
          </div>
        </div>

        {/* الفورم */}
        <form className="Settings_user_form" onSubmit={(e) => e.preventDefault()}>
          <label>
            الاسم الكامل
            <input
              type="text"
              value={userData?.name || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </label>

          <label>
            بريدك الإلكتروني
            <input
              type="email"
              value={userData?.email || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </label>

          <label>
            رقم الجوال
            <input
              type="tel"
              value={userData?.phone || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </label>
        </form>

        <LocationForm />
      </div>
    </div>
  );
};

export default SettingsUser;
