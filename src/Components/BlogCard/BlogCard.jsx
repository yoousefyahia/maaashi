import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./blogCard.css";
import { CiLocationOn, CiStopwatch } from "react-icons/ci";
import { MdFavoriteBorder } from "react-icons/md";

const BlogCard = () => {
  // تعريف حالات (states) لتخزين البيانات وحالة التحميل والخطأ
  const [ads, setAds] = useState([]);
  console.log(ads);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // عند تحميل المكون لأول مرة يتم استدعاء البيانات من API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        // طلب البيانات من السيرفر
        const res = await fetch(
          "https://api.maaashi.com/api/ealans?category=realestate&page_num=1"
        );

        // التحقق من نجاح الاتصال بالسيرفر
        if (!res.ok) {
          setError("حدث خطأ في الاتصال، حاول مرة أخرى.");
          setLoading(false);
          return;
        }

        // تحويل البيانات إلى JSON
        const data = await res.json();

        // الوصول إلى الإعلانات داخل الاستجابة (response)
        const adsData = data?.data?.data?.ads || [];

        // التحقق من أن الاستجابة ناجحة وتحتوي على مصفوفة إعلانات
        if (data?.success && Array.isArray(adsData)) {
          setAds(adsData); // حفظ الإعلانات في الحالة
        } else {
          setError("لم يتم العثور على أي إعلانات حاليًا."); // في حال لم توجد إعلانات
        }
      } catch {
        // معالجة الأخطاء العامة (مثل انقطاع الإنترنت أو مشكلة في البيانات)
        setError("حدث خطأ أثناء جلب البيانات، يرجى المحاولة لاحقًا.");
      } finally {
        // إنهاء حالة التحميل بعد انتهاء الطلب
        setLoading(false);
      }
    };

    // استدعاء الدالة لجلب الإعلانات
    fetchAds();
  }, []);

  // عرض رسالة أثناء تحميل البيانات
  if (loading) {
    return (
      <div className="loading">
        <p>جارِ تحميل الإعلانات...</p>
      </div>
    );
  }

  // عرض رسالة الخطأ في حال حدوث مشكلة
  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  // عرض الإعلانات في حال تم جلبها بنجاح

  // تحويل التاريخ الي صيغه معينه
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    if (seconds < 60) return "مند لحظات";
    if (seconds < intervals.minute) return `منذ ${seconds} ثانية`;
    if (seconds < intervals.hour)
      return `منذ ${Math.floor(seconds / intervals.minute)} دقيقة`;
    if (seconds < intervals.day)
      return `منذ ${Math.floor(seconds / intervals.hour)} ساعة`;
    if (seconds < intervals.week)
      return `منذ ${Math.floor(seconds / intervals.day)} يوم`;
    if (seconds < intervals.month)
      return `منذ ${Math.floor(seconds / intervals.week)} أسبوع`;
    if (seconds < intervals.year)
      return `منذ ${Math.floor(seconds / intervals.month)} شهر`;

    return `منذ ${Math.floor(seconds / intervals.year)} سنة`;
  };
  return (
    <section className="latest-ads">
      <div className="container">
        {/* عنوان القسم والوصف */}
        <h2 className="section-title">اكتشف الجديد أولًا</h2>
        <p className="section-subtitle">
          تصفح أحدث الإعلانات المضافة الآن، واعثر على ما يناسبك بسرعة وسهولة
        </p>

        {/* شبكة عرض الإعلانات */}
        <div className="ads-grid">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div key={ad.id_ads} className="ad-card">
                {/* صورة الإعلان */}
                <img
                  src={
                    ad.images?.[0]
                      ? `https://api.maaashi.com/storage${ad.images[0]}`
                      : "/images/default.jpg"
                  }
                  alt={ad.information?.title || "إعلان"}
                  className="ad-img"
                />

                <div className="ad-content">
                  {/* بيانات المستخدم صاحب الإعلان */}
                  <div className="ad-user">
                    <img
                      src={ad?.user?.profile_image || "/images/logo.svg"}
                      alt={ad.user?.user_name || "مستخدم"}
                      className="user-img"
                    />
                    <span>{ad.user?.user_name || "مستخدم"}</span>
                  </div>

                  {/* عنوان الإعلان */}
                  <h3 className="ad-title">
                    {ad.information?.title || "بدون عنوان"}
                  </h3>

                  {/* بيانات إضافية عن الموقع والوقت */}
                  <div className="ad-meta">
                    <span className="meta-item">
                      <CiLocationOn className="meta-icon" />
                      {ad?.user?.area || "غير محدد"}
                    </span>
                    <span className="meta-item">
                      <CiStopwatch className="meta-icon" />
                      {formatTime(ad.created_at) || "حديثًا"}
                    </span>
                  </div>

                  {/* عرض السعر أو حالة التفاوض */}
                  <p className="ad-price">
                    {ad.information?.price? `${ad.information.price} ريال`: ad.information?.isNegotiable? "السعر قابل للتفاوض": "السعر غير محدد"}
                  </p>

                  {/* الأزرار الخاصة بالتفاصيل والمفضلة */}
                  <div className="ad-actions">
                    <Link to={`/realestate/${ad.id_ads}`} className="ad-btn">
                      عرض التفاصيل
                    </Link>
                    <Link to="/favoritesUser" className="fav-btn">
                      <MdFavoriteBorder className="fav-icon" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // في حال لم توجد إعلانات بعد التحميل
            <p className="no-ads">لا توجد إعلانات حالياً</p>
          )}
        </div>
      </div>
    </section>
  );
};
export default BlogCard;
