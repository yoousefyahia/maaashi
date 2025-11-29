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
  const [saving, setSaving] = useState(false);

  const fetchUserData = async () => {
    if (!token || !userID) return;
    setLoading(true);
    try {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        const data = res.data.data;
        setUserData(data);
        setProfileImage(data.image_profile);
        setCoverImage(data.cover_image);
        profileRef.current = data.image_profile;
        coverRef.current = data.cover_image;
      }
    } catch {
      toast.error("فشل تحميل بيانات المستخدم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    const toastId = toast.loading("جارٍ رفع الصورة...");
    try {
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
        setProfileImage(`${res.data.data.image_url}?t=${Date.now()}`);
        profileRef.current = res.data.data.image_url;
        setUserData((prev) => ({ ...prev, image_profile: res.data.data.image_url }));
        toast.success("تم تحديث صورة البروفايل!", { id: toastId });
      }
    } catch {
      toast.error("فشل رفع صورة البروفايل!", { id: toastId });
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("لم يتم اختيار أي صورة");

    const previewURL = URL.createObjectURL(file);
    setCoverImage(previewURL);

    const formData = new FormData();
    formData.append("cover", file);

    const toastId = toast.loading("جارٍ رفع صورة الكوفر...");
    try {
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
        setCoverImage(`${res.data.data.image_url}?t=${Date.now()}`);
        coverRef.current = res.data.data.image_url;
        setUserData((prev) => ({ ...prev, cover_image: res.data.data.image_url }));
        toast.success("تم تحديث صورة الكوفر!", { id: toastId });
      }
    } catch {
      toast.error("فشل رفع صورة الكوفر!", { id: toastId });
    }
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image_profile: profileRef.current,
        cover_image: coverRef.current,
      };

      const res = await axios.post(
        "https://api.maaashi.com/api/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        const data = res.data.data;
        setUserData(data);
        toast.success("تم تحديث البيانات الشخصية بنجاح!");
      }
    } catch {
      toast.error("فشل تحديث البيانات الشخصية");
    } finally {
      setSaving(false);
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

          <button
            type="button"
            className="Settings_user_save_btn"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "جاري الحفظ..." : "تعديل الملف الشخصي"}
          </button>
        </form>

        <LocationForm />
      </div>
    </div>
  );
};

export default SettingsUser;
