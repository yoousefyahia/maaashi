
import React, { useEffect, useState } from "react";
import "./bottomSectionProfile.css";
import { MdOutlineTimer } from "react-icons/md";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";

const BottomSectionProfile = () => {
  const [inputDate, setInputDate] = useState("");
  const [showUserAds, setShowUserAds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [Cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(Cookies?.token);
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // -------------------- جلب الإعلانات --------------------
  useEffect(() => {
    const fetchShowUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.maaashi.com/api/profile/ealans",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataAds = await response.json();
        setShowUserAds(dataAds.data?.data || []);
      } catch {
        setError("فشل الاتصال بالسيرفر.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShowUser();
    }
  }, [token]);

  // -------------------- حذف إعلان --------------------
  const deleteAdById = async (adId, category) => {
    try {
      setDeleting(true);
      const resp = await fetch(
        `https://api.maaashi.com/api/profile/ealans/${category}/${adId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.ok) {
        setShowUserAds(showUserAds.filter((ad) => ad.id_ads !== adId));
        setSuccessMessage("✅ تم حذف الإعلان بنجاح");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError("حدث خطأ أثناء حذف الإعلان.");
      }
    } catch {
      setError("فشل الاتصال بالسيرفر أثناء الحذف.");
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    if (selectedAd) deleteAdById(selectedAd.id, selectedAd.category);
  };

  // -------------------- تحويل التاريخ --------------------
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
  };

  // -------------------- JSX --------------------
  return (
    <div className="bottom_section">
      <div className="section_header">
        <h4>أحدث العروض</h4>

        <div className="date-search-box">
          <input
            id="dateInput"
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <button>فلتر</button>
        </div>
      </div>

      {loading ? (
        <p className="loading">جاري تحميل الإعلانات...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : showUserAds.length === 0 ? (
        <p className="no-data">لا توجد إعلانات حالياً.</p>
      ) : (
        <div className="ads_list">
          {showUserAds.map((ad) => (
            <div key={ad.id_ads} className="ad_card">
              <div className="ad_image_wrapper">
                <img
                  src={`https://api.maaashi.com/storage${ad.images[0]}`}
                  alt={ad.user.user_name}
                  className="ad_image"
                />
              </div>

              <div className="ad_content">
                <div>
                  <h5 className="ad_title">{ad.information.title}</h5>
                  <p>{ad.information.description}</p>

                  <div className="ad_meta">
                    <span className="ad_time">
                      <MdOutlineTimer /> {formatTime(ad.created_at)}
                    </span>
                  </div>
                </div>

                <div className="ad_actions">
                  <button className="edit_btn">تعديل</button>
                  <button
                    className="delete_btn"
                    onClick={() => {
                      setSelectedAd({
                        id: ad.id_ads,
                        category: ad.category,
                      });
                      setShowModal(true);
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ رسالة نجاح */}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* ✅ مودال تأكيد الحذف */}
      {showModal && (
        <div className="modal_overlay">
          <div className="modal_box">
            <h4>هل أنت متأكد من حذف هذا الإعلان؟</h4>
            <p>لن تتمكن من استرجاعه بعد الحذف.</p>
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
