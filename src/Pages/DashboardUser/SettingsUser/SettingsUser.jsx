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

  const queryClient = useQueryClient();

  // =======================
  // جلب بيانات المستخدم
  // =======================
  const { data: userData } = useQuery({
    queryKey: ["user", userID],
    queryFn: async () => {
      const res = await axios.get("https://api.maaashi.com/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.status ? res.data.data : {};
    },
    enabled: !!token && !!userID,
  });

  // تحديث الصور بعد جلب البيانات
  useEffect(() => {
    if (userData?.image_url) setProfileImage(`${userData.image_url}?t=${Date.now()}`);
    if (userData?.cover_image) setCoverImage(`${userData.cover_image}?t=${Date.now()}`);
  }, [userData]);

  // =======================
  // رفع صورة البروفايل
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
    throw new Error(res.data?.message || "فشل رفع الصورة");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // التحقق من نوع وحجم الملف
    if (!file.type.startsWith("image/")) {
      toast.error("الملف المختار ليس صورة. الرجاء اختيار ملف صورة فقط.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جدًا. الرجاء اختيار صورة أصغر من 5MB.");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);
    setImageLoading(true);

    try {
      const uploadedUrl = await uploadProfileImage(file);

      if (!uploadedUrl) {
        toast.error("الصورة لم تتغير. حاول مرة أخرى.");
        return;
      }

      const newImageUrl = `${uploadedUrl}?t=${Date.now()}`;
      setProfileImage(newImageUrl);

      queryClient.setQueryData(["user", userID], (oldData) => ({
        ...oldData,
        image_url: uploadedUrl,
      }));

      await queryClient.invalidateQueries(["user", userID]);

      toast.success("تم تحديث صورة البروفايل بنجاح!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`فشل رفع الصورة: ${error.response?.data?.message || error.message}`);
      if (userData?.image_url) {
        setProfileImage(`${userData.image_url}?t=${Date.now()}`);
      }
    } finally {
      setImageLoading(false);
      URL.revokeObjectURL(previewURL);
    }
  };

  // =======================
  // فورم البيانات
  // =======================
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

  // =======================
  // تحديث بيانات الحساب
  // =======================
  const updateProfileMutation = useMutation({
    mutationFn: async (data) =>
      axios.post("https://api.maaashi.com/api/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => queryClient.invalidateQueries(["user", userID]),
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

      {/* Buttons */}
      <ul className="Settings_user_buttons">
        <li>حسابي</li>
        <li>الشروط والأحكام</li>
        <li>الخصوصية</li>
        <li>الأسئلة الشائعة</li>
        <li>تغيير البانر</li>
      </ul>

      {/* الصور */}
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
                {profileImage && (
                  <img
                    src={profileImage}
                    alt="Profile"
                    onError={(e) => {
                      e.target.style.display = "none";
                      toast.error("فشل تحميل الصورة. ربما تم حذفها أو الرابط غير صالح.");
                    }}
                  />
                )}
                {imageLoading && (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader"></div>
                  </div>
                )}
                <label className="profile_camera_icon">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageLoading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="user_name">
            <h3>{userData?.name}</h3>
          </div>
        </div>

        {/* فورم تعديل الحساب */}
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
            disabled={updateProfileMutation.isLoading}
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
