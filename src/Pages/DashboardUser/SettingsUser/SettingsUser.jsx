import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import "./settingsUser.css";
import LocationForm from "../../../Components/LocationForm/LocationForm";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

// إنشاء instance مخصص لـ axios
const api = axios.create({
  baseURL: 'https://api.maaashi.com/api',
  timeout: 30000,
});

const SettingsUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token, user } = parseAuthCookie(cookies?.token);
  const userID = user?.id;

  const [profileImage, setProfileImage] = useState(null); // ✅ هنا تعريف profileImage
  const [coverImage, setCoverImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const queryClient = useQueryClient();

  // =======================
  // جلب بيانات المستخدم
  // =======================
  const { data: userData } = useQuery({
    queryKey: ["user", userID],
    queryFn: async () => {
      if (!token) {
        toast.error("لا يوجد token، يرجى تسجيل الدخول مرة أخرى");
        return {};
      }

      try {
        toast.loading("جاري جلب البيانات...");
        const res = await api.get("/profile", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
        });
        
        toast.dismiss();
        
        if (res.data.status) {
          toast.success("تم جلب البيانات بنجاح");
          return res.data.data;
        } else {
          toast.error("فشل في جلب البيانات من السيرفر");
          return {};
        }
      } catch (error) {
        toast.dismiss();
        
        if (error.message?.includes('timeout')) {
          toast.error("انتهت مدة الانتظار. تحقق من الإنترنت وحاول مرة أخرى.");
        } else if (error.response) {
          toast.error(`خطأ من السيرفر: ${error.response.status}`);
        } else if (error.request) {
          toast.error("لا يمكن الاتصال بالسيرفر. تحقق من الإنترنت.");
        } else {
          toast.error("حدث خطأ غير متوقع");
        }
        
        return {};
      }
    },
    enabled: !!token && !!userID,
  });

  // تحديث الصور بعد جلب البيانات
  useEffect(() => {
    if (userData?.image_url) {
      setProfileImage(`${userData.image_url}?t=${Date.now()}`);
    }
    if (userData?.cover_image) {
      setCoverImage(`${userData.cover_image}?t=${Date.now()}`);
    }
  }, [userData]);

  // =======================
  // رفع صورة البروفايل
  // =======================
  const uploadProfileImage = async (file) => {
    if (!token) {
      throw new Error("No token available");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch('https://api.maaashi.com/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        return data.data.image_url;
      } else {
        throw new Error(data?.message || "فشل رفع الصورة");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error("انتهت مدة الانتظار أثناء رفع الصورة");
      }
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    event.target.value = ''; // تنظيف الـ input

    if (!file) {
      return;
    }

    // التحقق من نوع وحجم الملف
    if (!file.type.startsWith("image/")) {
      toast.error("الملف المختار ليس صورة. الرجاء اختيار ملف صورة فقط.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جدًا. الرجاء اختيار صورة أصغر من 5MB.");
      return;
    }

    // عرض صورة معاينة
    const previewURL = URL.createObjectURL(file);
    setProfileImage(previewURL);
    setImageLoading(true);

    try {
      toast.loading("جاري رفع الصورة...");

      const uploadedUrl = await uploadProfileImage(file);

      if (uploadedUrl) {
        // استخدام الصورة الجديدة مع timestamp
        const newImageUrl = `${uploadedUrl}?t=${Date.now()}`;
        setProfileImage(newImageUrl);
        
        // تحديث الـ cache
        queryClient.setQueryData(["user", userID], (oldData) => ({
          ...oldData,
          image_url: uploadedUrl,
        }));

        // إعادة تحميل البيانات
        await queryClient.invalidateQueries(["user", userID]);
        
        toast.success("🎉 تم تحديث صورة البروفايل بنجاح!");
      }

    } catch (error) {
      console.error("Upload error:", error);
      
      // رسائل خطأ محددة
      if (error.message.includes('انتهت مدة الانتظار')) {
        toast.error("استغرقت العملية وقتاً طويلاً. حاول مرة أخرى.");
      } else if (error.message.includes('HTTP error')) {
        toast.error("مشكلة في السيرفر. حاول مرة أخرى لاحقاً.");
      } else {
        toast.error(`فشل رفع الصورة: ${error.message}`);
      }

      // الرجوع للصورة الأصلية
      if (userData?.image_url) {
        setProfileImage(`${userData.image_url}?t=${Date.now()}`);
      }
    } finally {
      setImageLoading(false);
      // تنظيف الـ URL المؤقت
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
      api.post("/profile", data, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userID]);
    },
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(
      { name, email, phone },
      {
        onSuccess: () => toast.success("تم تحديث البيانات بنجاح!"),
        onError: (error) => {
          toast.error(`فشل التحديث: ${error.response?.data?.message || "حدث خطأ"}`);
        }
      }
    );
  };

  return (
    <div className="Settings_user">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />

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
                      toast.error("فشل تحميل الصورة.");
                    }}
                  />
                )}
                {imageLoading && (
                  <div className="upload_overlay">
                    <div className="UploadImages_loader"></div>
                    <span style={{color: 'white', fontSize: '12px', marginTop: '10px'}}>جاري الرفع...</span>
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