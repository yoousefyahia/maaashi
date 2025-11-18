
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";

const SettingsUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // === حالات الموديل ===
  const [showDeleteModal, setShowDeleteModal] = useState(false); // موديل التأكيد
  const [showDeletedModal, setShowDeletedModal] = useState(false); // موديل تم الحذف

  // حذف الحساب نهائي
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        "https://api.maaashi.com/api/profile/delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await resp.json();

      if (resp.ok && data.success) {
        setShowDeleteModal(false);
        setShowDeletedModal(true); // اعرض موديل تم الحذف
      } else {
        setError("حدث خطأ أثناء حذف الحساب");
      }
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  // =================== باقي الكود لتحميل الصور وتعديل البيانات ===================
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

    const webpFile = new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, "") + ".webp",
      { type: "image/webp" }
    );

    return webpFile;
  };

  const sendImage = async (name, file, endPoint) => {
    const formData = new FormData();
    formData.append(name, file);

    const response = await fetch(endPoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (response.ok && data?.success) {
      return data?.data?.image;
    } else {
      throw new Error(data?.message || "فشل رفع الصورة");
    }
  };

  const [imageLoading, setImageLoading] = useState(false);
  const handleImageUpload = async (event, name, endPoint) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const webpFile = await convertToWebP(file);
      const imageUrl = await sendImage(name, webpFile, endPoint);
      if (name === "profile_image") setProfileImage(URL.createObjectURL(webpFile));
      else if (name === "cover_image") setCoverImage(URL.createObjectURL(webpFile));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (!userID || !token) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.maaashi.com/api/user/${userID}`,
          { method: "get", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userID, token]);

  useEffect(() => {
    if (userData?.data?.profile_image) {
      setProfileImage(`${userData.data.profile_image}?t=${Date.now()}`);
      setCoverImage(`${userData?.data?.cover_image}?t=${Date.now()}`);
    }
  }, [userData]);

  return (
    <div className="Settings_user">
      {/* الأزرار العلوية */}
      <ul className="Settings_user_buttons">
        <li className="Settings_user_but">حسابي</li>
        <li className="Settings_user_but">الشروط والأحكام</li>
        <li className="Settings_user_but">الخصوصية</li>
        <li className="Settings_user_but">الأسئلة الشائعة</li>
        <li className="Settings_user_but">تغيير البانر</li>
        <li
          className="Settings_user_but"
          onClick={() => setShowDeleteModal(true)}
        >
          حذف الحساب
        </li>
      </ul>

      {/* موديل تأكيد الحذف */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>تأكيد حذف الحساب</h3>
            <p>هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>إلغاء</button>
              <button className="btn-confirm" onClick={handleDeleteAccount}>
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
            <div className="modal-buttons">
              <button
                className="btn-confirm"
                onClick={() => (window.location.href = "/login")}
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* باقي الصفحة */}
      <div className="settings_user_container">
        {/* صورة الغلاف + صورة البروفايل */}
        <div className="Settings_user_image">
          <div className="image_container">
            <div className="Settings_user_image_cover">
              <img src={coverImage} alt="صورة الغلاف" />
              <label className="change_banner_btn">
                <FaCamera className="camera_icon" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      "cover_image",
                      "https://api.maaashi.com/api/cover-image"
                    )
                  }
                  disabled={imageLoading}
                />
                <span> تغيير البانر</span>
              </label>
            </div>

            <div className="Settings_user_image_profile">
              <div className="user_img_container">
                {isLoading ? (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader" />
                  </div>
                ) : (
                  <img src={profileImage} alt="صورة البروفايل" />
                )}
                <label className="profile_camera_icon">
                  <FaCamera className="camera_icon" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        "profile_image",
                        "https://api.maaashi.com/api/profile-image"
                      )
                    }
                    disabled={imageLoading}
                  />
                </label>
                {imageLoading && (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="user_name">
            <h3>{userData?.data?.name}</h3>
          </div>
        </div>

        {/* نموذج تعديل البيانات */}
        <form className="Settings_user_form">
          <label>
            الاسم الكامل
            <input type="text" defaultValue={userData?.data?.name} />
          </label>
          <label>
            بريدك الإلكتروني
            <input type="email" defaultValue={userData?.data?.email} />
          </label>
          <label>
            رقم الجوال
            <input type="tel" defaultValue={userData?.data?.phone} />
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
          <button type="submit" className="Settings_user_save_btn">
            تعديل الملف الشخصي
          </button>
        </form>
        <LocationForm />
      </div>
    </div>
  );
};
export default SettingsUser;
