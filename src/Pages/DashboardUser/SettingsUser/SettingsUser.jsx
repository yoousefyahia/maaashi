import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";

const SettingsUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;

  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);

  // صور المستخدم
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // موديلات الحذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  // ==============================
  // 🔥 حذف الحساب
  // ==============================
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete("https://api.maaashi.com/api/profile/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        setShowDeleteModal(false);
        setShowDeletedModal(true);
      } else {
        setError("حدث خطأ أثناء حذف الحساب");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================
  // 🔥 تحويل الصورة إلى webp
  // ==============================
  const convertToWebP = async (file, quality = 0.9) => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
  };

  // ==============================
  // 🔥 رفع الصورة الشخصية
  // ==============================
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // المفتاح الصحيح حسب رسالة الخطأ

    const res = await axios.post("https://api.maaashi.com/api/profile/avatar", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status) {
      return res.data.data.image_url; // رابط الصورة الجديدة
    } else {
      throw new Error("فشل رفع الصورة");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const webpFile = await convertToWebP(file);
      const uploadedUrl = await uploadProfileImage(webpFile);
      setProfileImage(`${uploadedUrl}?t=${Date.now()}`);
    } catch (err) {
      console.log(err);
    } finally {
      setImageLoading(false);
    }
  };

  // ==============================
  // 🔥 جلب بيانات المستخدم
  // ==============================
  useEffect(() => {
    if (!token || !userID) return;

    const getUserData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status) {
          setUserData(res.data.data);

          if (res.data.data.image_url) {
            setProfileImage(`${res.data.data.image_url}?t=${Date.now()}`);
          }

          if (res.data.data.cover_image) {
            setCoverImage(res.data.data.cover_image);
          }
        }
      } catch (err) {
        setError("خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [userID, token]);

  return (
    <div className="Settings_user">
      {/* الأزرار العلوية */}
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
                {isLoading ? "جاري الحذف..." : "تأكيد"}
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
        {/* صور المستخدم */}
        <div className="Settings_user_image">
          <div className="image_container">
            {/* كوفر */}
            <div className="Settings_user_image_cover">
              {coverImage && <img src={coverImage} alt="صورة الغلاف" />}
              <label className="change_banner_btn">
                <FaCamera />
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <span>تغيير البانر</span>
              </label>
            </div>

            {/* بروفايل */}
            <div className="Settings_user_image_profile">
              <div className="user_img_container">
                {imageLoading ? (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader"></div>
                  </div>
                ) : (
                  profileImage && <img src={profileImage} alt="صورة البروفايل" />
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
