import React, { useState, useEffect } from "react";
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
  const [imageLoading, setImageLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  const queryClient = useQueryClient();

  // =======================
  // 🎯 جلب بيانات المستخدم
  // =======================
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userID],
    queryFn: async () => {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        return res.data.data;
      }
      return {};
    },
    enabled: !!token && !!userID,
  });

  // 🤍 تحديث الصور بعد جلب البيانات
  useEffect(() => {
    if (userData?.image_url) {
      setProfileImage(`${userData.image_url}?t=${Date.now()}`);
    }
    if (userData?.cover_image) {
      setCoverImage(`${userData.cover_image}?t=${Date.now()}`);
    }
  }, [userData]);

  // =======================
  // 🔥 رفع صورة البروفايل
  // =======================
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("https://api.maaashi.com/api/profile/avatar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status) return res.data.data.image_url;
    throw new Error("فشل رفع الصورة");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL); // Preview فورًا
    setImageLoading(true);

    try {
      const uploadedUrl = await uploadProfileImage(file);

      // تحديث الصورة مع timestamp لتفادي الكاش
      setProfileImage(`${uploadedUrl}?t=${Date.now()}`);

      // تحديث بيانات المستخدم مباشرة
      queryClient.setQueryData(["user", userID], (oldData) => ({
        ...oldData,
        image_url: uploadedUrl
      }));

      queryClient.invalidateQueries(["user", userID]);
    } finally {
      setImageLoading(false);
    }
  };

  // =============================
  // 🔧 التحكم في فورم البيانات
  // =============================
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

  // =============================
  // 🔥 تحديث بيانات الحساب
  // =============================
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post(
        "https://api.maaashi.com/api/profile",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userID]);
    },
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(
      { name, email, phone },
      {
        onSuccess: () => toast.success("تم تحديث البيانات بنجاح!"),
        onError: () => toast.error("حدث خطأ أثناء التحديث!"),
      }
    );
  };

  return (
    <div className="Settings_user">
      <Toaster position="top-right" reverseOrder={false} />

      {/* =======================
          📌 Buttons
      =========================== */}
      <ul className="Settings_user_buttons">
        <li>حسابي</li>
        <li>الشروط والأحكام</li>
        <li>الخصوصية</li>
        <li>الأسئلة الشائعة</li>
        <li>تغيير البانر</li>
        <li onClick={() => setShowDeleteModal(true)}>حذف الحساب</li>
      </ul>

      {/* =======================
          🖼️ الصور
      =========================== */}
      <div className="settings_user_container">
        <div className="Settings_user_image">
          <div className="image_container">

            {/* صورة الكوفر */}
            <div className="Settings_user_image_cover">
              {coverImage && <img src={coverImage} alt="Cover" />}
              <label className="change_banner_btn">
                <FaCamera />
                <input type="file" accept="image/*" />
                <span>تغيير البانر</span>
              </label>
            </div>

            {/* صورة البروفايل */}
            <div className="Settings_user_image_profile">
              <div className="user_img_container">
                {imageLoading ? (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader"></div>
                  </div>
                ) : (
                  profileImage && <img src={profileImage} alt="Profile" />
                )}

                <label className="profile_camera_icon">
                  <FaCamera />
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

          </div>

          <div className="user_name">
            <h3>{userData?.name}</h3>
          </div>
        </div>

        {/* =======================
            📄 فورم تعديل الحساب
        =========================== */}
        <form className="Settings_user_form" onSubmit={(e) => e.preventDefault()}>
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
