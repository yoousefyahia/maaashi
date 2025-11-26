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

  const fetchUserData = async (ignoreLocal = false) => {
    if (!token || !userID) return;
    setLoading(true);

    try {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      if (data.status) {
        const serverData = { ...data.data, userID };

        // لو البيانات مختلفة عن الـ localStorage أو طلبنا تجاهل الـ localStorage
        const needUpdate =
          ignoreLocal ||
          !userData ||
          userData.profile_image !== data.data.profile_image ||
          userData.cover_image !== data.data.cover_image ||
          userData.name !== data.data.name ||
          userData.email !== data.data.email ||
          userData.phone !== data.data.phone;

        if (needUpdate) {
          localStorage.setItem("userData", JSON.stringify(serverData));
          setUserData(serverData);

          if (data.data.profile_image) {
            const newProfileURL = `${data.data.profile_image}?t=${Date.now()}`;
            setProfileImage(newProfileURL);
            profileRef.current = data.data.profile_image;
          }
          if (data.data.cover_image) {
            const newCoverURL = `${data.data.cover_image}?t=${Date.now()}`;
            setCoverImage(newCoverURL);
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

  // قراءة البيانات من localStorage أولًا
  useEffect(() => {
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

    fetchUserData();
  }, [token, userID]);

  const triggerProfileInput = () => profileInputRef.current?.click();
  const triggerCoverInput = () => coverInputRef.current?.click();

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
        // تحديث الصورة بدون أي undefined
        const newProfileURL = `${res.data.data.profile_image}?t=${Date.now()}`;
        setProfileImage(newProfileURL);
        profileRef.current = res.data.data.profile_image;

        // تجاهل localStorage القديم ونعمل re-fetch
        await fetchUserData(true);

        toast.success("تم تحديث صورة البروفايل!");
      }
    } catch {
      toast.error("فشل رفع صورة البروفايل!");
    }
  };

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
        const newCoverURL = `${res.data.data.cover_image}?t=${Date.now()}`;
        setCoverImage(newCoverURL);
        coverRef.current = res.data.data.cover_image;

        // تجاهل localStorage القديم ونعمل re-fetch
        await fetchUserData(true);

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

            {/* Cover */}
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

            {/* Profile */}
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
