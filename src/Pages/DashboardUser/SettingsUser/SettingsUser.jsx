// SettingsUser.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const SettingsUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const queryClient = useQueryClient();

  // جلب بيانات المستخدم
  const { data: userData } = useQuery({
    queryKey: ["user", userID],
    queryFn: async () => {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) return res.data.data;
      return {};
    },
    enabled: !!token && !!userID,
  });

  useEffect(() => {
    if (userData?.profile_image) setProfileImage(userData.profile_image);
    if (userData?.cover_image) setCoverImage(userData.cover_image);
  }, [userData]);

  // رفع صورة البروفايل
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      "https://api.maaashi.com/api/profile/avatar",
      formData,
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.status) return res.data.data.profile_image;
    throw new Error("فشل رفع صورة البروفايل");
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("لم يتم اختيار ملف");
      return toast.error("لم يتم اختيار أي صورة");
    }

    console.log("تم اختيار ملف:", file.name);
    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);
    setProfileLoading(true);
    toast("جارٍ رفع الصورة...");

    try {
      const uploadedUrl = await uploadProfileImage(file);
      setProfileImage(`${uploadedUrl}?t=${Date.now()}`);
      queryClient.invalidateQueries(["user", userID]);
      toast.success("تم تحديث صورة البروفايل!");
    } catch (error) {
      console.error("خطأ في الرفع:", error);
      toast.error("فشل رفع صورة البروفايل!");
    } finally {
      setProfileLoading(false);
    }
  };

  // رفع صورة الكوفر
  const uploadCoverImage = async (file) => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await axios.post(
      "https://api.maaashi.com/api/profile/cover",
      formData,
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.status) return res.data.data.cover_image;
    throw new Error("فشل رفع صورة الكوفر");
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("لم يتم اختيار أي صورة");

    const previewURL = URL.createObjectURL(file);
    setCoverImage(previewURL);
    setCoverLoading(true);
    toast("جارٍ رفع صورة الكوفر...");

    try {
      const uploadedUrl = await uploadCoverImage(file);
      setCoverImage(`${uploadedUrl}?t=${Date.now()}`);
      queryClient.invalidateQueries(["user", userID]);
      toast.success("تم تحديث صورة الكوفر!");
    } catch {
      toast.error("فشل رفع صورة الكوفر!");
    } finally {
      setCoverLoading(false);
    }
  };

  // دوال لتشغيل اختيار الملفات
  const triggerProfileInput = () => profileInputRef.current?.click();
  const triggerCoverInput = () => coverInputRef.current?.click();

  // فورم تعديل البيانات
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post("https://api.maaashi.com/api/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["user", userID]),
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(
      { name, email, phone },
      {
        onSuccess: () => toast.success("تم تحديث البيانات!"),
        onError: () => toast.error("فشل تحديث البيانات"),
      }
    );
  };

  return (
    <div className="Settings_user">
      <Toaster position="top-right" />

      <ul className="Settings_user_buttons">
        <li>حسابي</li>
        <li>الشروط والأحكام</li>
        <li>الخصوصية</li>
        <li>الأسئلة الشائعة</li>
        <li>تغيير البانر</li>
      </ul>

      <div className="settings_user_container">
        <div className="Settings_user_image">
          <div className="image_container">
            {/* صورة الكوفر */}
            <div className="Settings_user_image_cover">
              {coverLoading ? (
                <div className="upload_overlay">جارٍ التحميل...</div>
              ) : (
                coverImage && <img src={coverImage} alt="Cover" />
              )}
              <button 
                className="change_banner_btn"
                type="button"
                onClick={triggerCoverInput}
              >
                <FaCamera />
                تغيير
              </button>
              <input 
                ref={coverInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* صورة البروفايل */}
            <div className="Settings_user_image_profile">
              <div className="user_img_container">
                {profileLoading ? (
                  <div className="upload_overlay">جارٍ التحميل...</div>
                ) : (
                  profileImage && <img src={profileImage} alt="Profile" />
                )}
                <button
                  className="profile_camera_icon"
                  type="button"
                  onClick={triggerProfileInput}
                  title="تغيير الصورة الشخصية"
                >
                  <FaCamera />
                </button>
                <input 
                  ref={profileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <div className="user_name">
            <h3>{userData?.name || "جارٍ التحميل..."}</h3>
          </div>
        </div>

        <form
          className="Settings_user_form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label>
            الاسم الكامل
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            بريدك الإلكتروني
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            رقم الجوال
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>

          <button
            type="button"
            className="Settings_user_save_btn"
            onClick={handleUpdateProfile}
          >
            {updateProfileMutation.isLoading ? "جاري التحديث..." : "تعديل الملف الشخصي"}
          </button>
        </form>

        <LocationForm />
      </div>
    </div>
  );
};

export default SettingsUser;
