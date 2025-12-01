import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ConfirmAd.css";

export default function ConfirmAd({ formik }) {
  const { values, setFieldValue } = formik;
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [cookies] = useCookies(["token"]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/categories");
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (err) {
        console.log("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ضبط اسم الفئة
  useEffect(() => {
    if (values.category && categories.length > 0) {
      const selectedCat = categories.find((cat) => cat.id == values.category);
      setCategoryName(selectedCat ? selectedCat.name : "اسم الفئة");
    }
  }, [values.category, categories]);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = cookies.token?.token || cookies.token;
        if (!token) return;

        const response = await fetch("https://api.maaashi.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUserData(data?.data || {});
      } catch (err) {
        console.log("Error fetching user data:", err.message);
      }
    };
    fetchUserData();
  }, [cookies.token]);

  // دالة رفع الإعلان
  const submitAd = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = cookies.token?.token || cookies.token;
      if (!token) throw new Error("Token not found");

      const formData = new FormData();
      formData.append("category_id", values.category);
      formData.append("title", values.information.adTitle);
      formData.append("description", values.information.adDescription);
      formData.append("price", values.information.adPrice || "");
      formData.append("additional_info", values.information.additional_info || "");
      formData.append("seller_name", userData?.name || "");
      formData.append("seller_phone", userData?.phone || "");
      formData.append("is_featured", values.featured ? 1 : 0);
      formData.append("fee_agree", values.feeAgreement ? 1 : 0);
      formData.append("isNegotiable", values.information.isNegotiable ? 1 : 0);

      values.images?.forEach((file, idx) => {
        formData.append(`images[${idx}]`, file);
      });

      const res = await fetch("https://api.maaashi.com/api/ads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "حدث خطأ");
        setIsLoading(false);
        return;
      }

      toast.success("تم نشر الإعلان بنجاح!");
      setIsLoading(false);
      navigate("/"); // العودة للصفحة الرئيسية

    } catch (err) {
      console.log(err);
      setErrorMessage(err.message || "حدث خطأ");
      setIsLoading(false);
    }
  };

  return (
    <div className="confirmAd_container">
      <header className='confirmAd_header'>
        <h3>مراجعة الإعلان</h3>
        <p>راجع إعلانك قبل نشره</p>
      </header>

      <div className="information_ad">
        <ul className='info_list'>
          <li><h4>القسم/الفئة:</h4><p>{categoryName || "اسم الفئة"}</p></li>
          <li><h4>عنوان الإعلان:</h4><p>{values?.information?.adTitle || "غير محدد"}</p></li>
          <li><h4>السعر:</h4><p>{values?.information?.adPrice ? `${values.information.adPrice} ريال سعودي` : "غير محدد"}</p></li>
          <li><h4>عدد الصور:</h4><p>{values?.images?.length || 0}</p></li>
          <li><h4>المعلومات الإضافية:</h4><p>{values?.information?.additional_info || "غير محدد"}</p></li>
          <li><h4>الموقع:</h4><p>{userData?.location || userData?.area || userData?.city || "جارٍ التحميل..."}</p></li>
          <li><h4>البائع:</h4><p>{userData?.name || "جارٍ التحميل..."}</p></li>
          <li><h4>رقم الهاتف:</h4><p>{userData?.phone || "جارٍ التحميل..."}</p></li>
        </ul>
      </div>

      <div className="fee_agreement">
        <label className="terms_label">
          <input
            type="checkbox"
            name="feeAgreement"
            checked={values.feeAgreement || false}
            onChange={(e) => setFieldValue("feeAgreement", e.target.checked)}
          />
        </label>
        <div className="text">
          <p>اتعهد واقسم بالله أنا المعلن أن أدفع رسوم الموقع وهي 1% من قيمة البيع.</p>
        </div>
      </div>

      <div className="featured">
        <label className="featured_label">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured || false}
            onChange={(e) => setFieldValue("featured", e.target.checked)}
          />
        </label>
        <div className="text">
          <p>أريد تمييز الإعلان</p>
        </div>
      </div>

      {values.feeAgreement && (
        <div className="btn_confirmAd">
          <button
            type='button'
            className='btn'
            onClick={submitAd}
            disabled={isLoading}
          >
            <span>انشر إعلانك الآن</span>
            <img src="./advertisements/Plus.svg" alt="Plus" />
          </button>
        </div>
      )}

      {errorMessage && <div className="error_message">{errorMessage}</div>}

      <div className="modal_fade" style={{ display: isLoading ? "flex" : "none" }}>
        <div className="loader" />
      </div>
    </div>
  );
}
