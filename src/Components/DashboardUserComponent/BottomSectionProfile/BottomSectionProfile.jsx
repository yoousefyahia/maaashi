import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bottomSectionProfile.css";
import { MdOutlineTimer, MdLocationOn, MdImage } from "react-icons/md";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";

const BottomSectionProfile = () => {
  const [inputDate, setInputDate] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showUserAds, setShowUserAds] = useState([]);
  const [userData, setUserData] = useState(null); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [Cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(Cookies?.token);
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // -------------------- جلب البيانات --------------------
  useEffect(() => {
    const fetchShowUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.maaashi.com/api/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full response:", data);
        
        // حفظ بيانات المستخدم
        if (data.data) {
          setUserData(data.data);
          
          // استخراج الإعلانات
          if (Array.isArray(data.data.ads)) {
            console.log("Ads found:", data.data.ads.length, "ads");
            setShowUserAds(data.data.ads);
          } else {
            setShowUserAds([]);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("فشل الاتصال بالسيرفر.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchShowUser();
  }, [token]);

  // -------------------- حذف إعلان --------------------
  const deleteAdById = async (adId) => {
    try {
      setDeleting(true);
      const resp = await fetch(
        `https://api.maaashi.com/api/profile/ads/${adId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await resp.json();
      console.log("Delete response:", result);
      
      if (resp.ok && result.status) {
        setShowUserAds(prevAds => prevAds.filter((ad) => ad.id !== adId));
        setSuccessMessage("✅ تم حذف الإعلان بنجاح");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.message || "حدث خطأ أثناء حذف الإعلان.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("فشل الاتصال بالسيرفر أثناء الحذف.");
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    if (selectedAd) deleteAdById(selectedAd.id);
  };

  // -------------------- تحويل التاريخ --------------------
  const formatTime = (dateString) => {
    if (!dateString) return "غير معروف";
    
    try {
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

      if (seconds < 60) return "منذ لحظات";
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
    } catch {
      return "غير معروف";
    }
  };

  // -------------------- فلترة الإعلانات --------------------
  const handleFilter = () => {
    setFilterDate(inputDate);
  };

  const handleClearFilter = () => {
    setInputDate("");
    setFilterDate("");
  };

  const filteredAds = Array.isArray(showUserAds) 
    ? showUserAds.filter((ad) => {
        if (!filterDate) return true;
        if (!ad.created_at) return false;
        return ad.created_at.split("T")[0] === filterDate;
      })
    : [];

  // -------------------- عرض تفاصيل الإعلان --------------------
  const handleViewAd = (adId) => {
    if (adId) {
      navigate(`/ad/${adId}`);
    }
  };

  return (
    <div className="bottom_section">
      <div className="section_header">
        <h4>أحدث العروض ({showUserAds.length})</h4>
        <div className="date-search-box">
          <input
            id="dateInput"
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <button onClick={handleFilter} className="filter-btn">فلتر</button>
          {filterDate && (
            <button onClick={handleClearFilter} className="clear-btn">
              إلغاء الفلتر
            </button>
          )}
        </div>
      </div>

      {/* عرض معلومات الموقع من بيانات المستخدم */}
      {/* {userData && (userData.location || userData.city || userData.area) && (
        <div className="user_location_info">
          <div className="location_header">
            <MdLocationOn size={20} />
            <span>موقع المستخدم:</span>
          </div>
          <div className="location_details">
            {userData.location && (
              <span className="location_item">{userData.location}</span>
            )}
            {userData.city && (
              <span className="location_item">{userData.city}</span>
            )}
            {userData.area && (
              <span className="location_item">{userData.area}</span>
            )}
          </div>
        </div>
      )} */}

      {loading ? (
        <p className="loading">جاري تحميل الإعلانات...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : !Array.isArray(showUserAds) || filteredAds.length === 0 ? (
        <p className="no-data">
          {Array.isArray(showUserAds) && showUserAds.length === 0 
            ? "لا توجد إعلانات حالياً." 
            : filterDate 
            ? `لا توجد إعلانات في تاريخ ${filterDate}`
            : "حدث خطأ في تحميل الإعلانات."}
        </p>
      ) : (
        <div className="ads_list">
          {filteredAds.map((ad) => {
            // الحصول على الصورة الأولى كما تأتي من الباك-إند
            const firstImage = ad.images && ad.images.length > 0 
              ? ad.images[0] 
              : null;
            
            return (
              <div key={ad.id} className="ad_card">
                <div className="ad_image_wrapper">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={ad.title || "إعلان"}
                      className="ad_image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no_image_placeholder">
                      <MdImage size={40} color="#ccc" />
                      <span>لا توجد صورة</span>
                    </div>
                  )}
                </div>

                <div className="ad_content">
                  <div className="ad_info">
                    <h5 className="ad_title">{ad.title || "بدون عنوان"}</h5>
                    <p className="ad_description">
                      {ad.description 
                        ? (ad.description.length > 100 
                            ? ad.description.substring(0, 100) + "..." 
                            : ad.description)
                        : "بدون وصف"}
                    </p>
                    
                    <div className="ad_meta">
                      <span className="ad_time">
                        <MdOutlineTimer /> {formatTime(ad.created_at)}
                      </span>
                      {/* <span className="ad_category">
                        {ad.category?.name || "غير مصنف"}
                      </span> */}
                    </div>

                    {/* عرض موقع المستخدم في كل إعلان */}
                    {userData && (userData.location || userData.city) && (
                      <div className="ad_location_info">
                        <MdLocationOn size={16} />
                        <span>
                          {userData.location && `${userData.location}`}
                          {userData.location && userData.city && " - "}
                          {userData.city && `${userData.city}`}
                        </span>
                      </div>
                    )}

                  {ad.price && (
  <div className="ad_price_container">
    <div className="ad_price">
      <span className="price_label">السعر:</span>
      <span className="price_value">{parseFloat(ad.price).toLocaleString()} ر.س</span>
    </div>
                      </div>
                    )}
                  </div>

                  <div className="ad_actions_container">
                    <div className="ad_actions_right">
                      <button
                        className="show_ad_btn"
                        onClick={() => handleViewAd(ad.id)}
                      >
                        عرض الإعلان
                      </button>
                    </div>
                    
                    <div className="ad_actions_left">
                      <button 
                        className="edit_btn"
                        onClick={() => {
                          // هنا يمكنك إضافة وظيفة التعديل
                          console.log("Edit ad:", ad.id);
                          // navigate(`/edit-ad/${ad.id}`);
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        className="delete_btn"
                        onClick={() => {
                          setSelectedAd({ id: ad.id, title: ad.title });
                          setShowModal(true);
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {successMessage && (
        <div className="success_message">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error_message">
          {error}
        </div>
      )}

      {showModal && (
        <div className="modal_overlay">
          <div className="modal_box">
            <h4>هل أنت متأكد من حذف هذا الإعلان؟</h4>
            <p>{selectedAd?.title && `"${selectedAd.title}"`}</p>
            <p className="warning_text">لن تتمكن من استرجاعه بعد الحذف.</p>
            <div className="modal_actions">
              <button
                className="confirm_delete_btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "جارٍ الحذف..." : "نعم، حذف"}
              </button>
              <button
                className="cancel_btn"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomSectionProfile;