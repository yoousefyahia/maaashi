import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  // ==============================
  // 🔥 جلب بيانات المستخدم
  // ==============================
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userID],
    queryFn: async () => {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status) {
        if (res.data.data.image_url) {
          setProfileImage(`${res.data.data.image_url}?t=${Date.now()}`);
        }
        if (res.data.data.cover_image) {
          setCoverImage(res.data.data.cover_image);
        }
        return res.data.data;
      }
      return {};
    },
    enabled: !!token && !!userID,
  });

  // ==============================
  // 🔥 رفع صورة البروفايل
  // ==============================
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
    setProfileImage(previewURL);
    setImageLoading(true);

    try {
      const uploadedUrl = await uploadProfileImage(file);
      setProfileImage(`${uploadedUrl}?t=${Date.now()}`);
      queryClient.invalidateQueries(["user", userID]);
    } catch (err) {
      console.log("Upload failed:", err);
    } finally {
      setImageLoading(false);
    }
  };

  // ==============================
  // 🔥 حذف الحساب
  // ==============================

  

  return (
    <div className="Settings_user">
      {/* الأزرار */}
      <ul className="Settings_user_buttons">
        <li>حسابي</li>
        <li>الشروط والأحكام</li>
        <li>الخصوصية</li>
        <li>الأسئلة الشائعة</li>
        <li>تغيير البانر</li>
        <li onClick={() => setShowDeleteModal(true)}>حذف الحساب</li>
      </ul>

      {/* موديل تأكيد الحذف */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>تأكيد حذف الحساب</h3>
            <p>هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟</p>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
              <button onClick={handleDeleteAccount}>
                {deleteMutation.isLoading ? "جاري الحذف..." : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* موديل تم الحذف */}
      {showDeletedModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>تم حذف الحساب</h3>
            <p>تم حذف حسابك بنجاح.</p>
            <button onClick={() => (window.location.href = "/login")}>موافق</button>
          </div>
        </div>
      )}

      {/* الصفحة الرئيسية */}
      <div className="settings_user_container">
        <div className="Settings_user_image">
          <div className="image_container">
            {/* كوفر */}
            <div className="Settings_user_image_cover">
              {coverImage && <img src={coverImage} alt="Cover" />}
              <label className="change_banner_btn">
                <FaCamera />
                <input type="file" accept="image/*" />
                <span>تغيير البانر</span>
              </label>
            </div>

            {/* صورة بروفايل */}
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

        {/* الفورم */}
        <form className="Settings_user_form">
          <label>
            الاسم الكامل
            <input type="text" defaultValue={userData?.name} />
          </label>

          <label>
            بريدك الإلكتروني
            <input type="email" defaultValue={userData?.email} />
          </label>

          <label>
            رقم الجوال
            <input type="tel" defaultValue={userData?.phone} />
          </label>

          <div className="password_row">
            <label>
              كلمة المرور الحالية
              <input type="password" defaultValue="***************" />
            </label>

            <label>
              كلمة المرور الجديدة
              <input type="password" />
            </label>

            <label>
              تأكيد كلمة المرور الجديدة
              <input type="password" />
            </label>
          </div>

          <button className="Settings_user_save_btn">تعديل الملف الشخصي</button>
        </form>

        <LocationForm />
      </div>
    </div>
  );
};

export default SettingsUser;
