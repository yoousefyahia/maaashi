import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiLocationOn, CiStopwatch } from "react-icons/ci";
import "./carCard.css";
import { timeSince } from "../../Pages/SpecificCategory/SpecificCategory";
import { useCookies } from "react-cookie";
import { ToastWarning } from "../Header/Header";

const CarCard = () => {
  const [cookies, removeCookie] = useCookies(["token"]);
  const token = cookies?.token?.data?.token;
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const [adsCard, setAdsCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(
          "https://api.maaashi.com/api/ealans/random"
        );

        if (!res.ok) {
          // بدلاً من throw new Error
          setError("حدث خطأ في الاتصال، حاول مرة أخرى.");
          setLoading(false);
          return; // نوقف هنا بدون رمي خطأ
        }

        const data = await res.json();
        console.log("data", data.data.data);

        if (data?.success) {
          const sortedAds = data?.data?.data.sort((a, b) => {
            return new Date(b.ad.created_at) - new Date(a.ad.created_at);
          });

          setAdsCard(sortedAds);
        } else {
          setError("لم يتم العثور على إعلانات سيارات حالياً.");
        }
      } catch {
        setError("حدث خطأ أثناء تحميل البيانات، حاول لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, []);

  // 💖 handle favorite toggle
  const [favorites, setFavorites] = useState({});
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  //  تبديل المفضلة محلياً
  const toggleFavorite = (e, category, adID) => {
    e.stopPropagation();
    const uniqueKey = `${category}_${adID}`;
    setFavorites((prev) => ({
      ...prev,
      [uniqueKey]: !prev?.[uniqueKey],
    }));
  };

  //  إضافة للمفضلة في السيرفر
  const addToFavorites = async (category, adId) => {
    try {
      setIsFavoriteLoading(true);
      setLoadingFavoriteId(`${category}_${adId}`);

      const response = await fetch(
        `https://api.maaashi.com/api/favorites/${category}/${adId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "حدث خطأ أثناء الإضافة للمفضلة.");
      }
    } catch {
      setErrorMessage("فشل الاتصال بالسيرفر أثناء الإضافة.");
    } finally {
      setIsFavoriteLoading(false);
      setLoadingFavoriteId(null);
    }
  };

  //  جلب بيانات المفضلة من السيرفر
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/favorites", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        // 👇 نضمن إن القيمة دايمًا object
        setFavorites(data?.data || {});
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل المفضلة.");
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleFavoriteClick = (e, category, adID) => {
    e.stopPropagation();
    if (!token) {
      setShowToast(true); // يظهر رسالة تسجيل الدخول
      return;
    }
    const key = `${category}_${adID}`;
    toggleFavorite(e, category, adID);
    addToFavorites(category, adID);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>جارِ تحميل الإعلانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

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
    <section className="car-card">
      <div className="car_card_container">
        <h2 className="section-title">اكتشف الجديد أولًا</h2>
        <p className="section-subtitle">
          تصفح أحدث إعلانات السيارات المضافة الآن، واعثر على ما يناسبك بسرعة
          وسهولة
        </p>

        <div className="categories_items">
          {adsCard.length > 0 ? (
            adsCard.map((ad, index) => (
              <div
                key={index}
                className={`category_card`}
                onClick={() => navigate(`/${ad?.category}/${ad?.ad?.id_ads}`)}
              >
                <div className="card_image">
                  <img
                    src={ad?.ad?.images?.[0] ? `https://api.maaashi.com/storage/${ad?.ad?.images[0]}` : "/placeholder.png"}
                    alt={ad?.information?.title}
                  />
                </div>

                <div className="card_user" onClick={(e) => { e.stopPropagation(); navigate(`/user/${ad?.ad?.user?.user_name}/${ad?.ad?.user?.id_user}`) }}>
                  {ad?.ad?.user?.profile_image ? (
                    <img src={ad?.ad?.user?.profile_image} alt="user" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx={12} cy={10} r={4} /><circle cx={12} cy={12} r={10} /></svg>
                  )}
                  <span>{ad?.ad?.user?.user_name?.split(" ").slice(0, 2).join(" ")}</span>
                </div>

                <div className="card_body">
                  <h2>{ad?.ad?.information?.title.substring(0, 18)}...</h2>
                  <div className="card_meta">
                    <div className="ciLocationOn">
                      <CiLocationOn style={{ color: "var(--main-color)", fontSize: "12px", fontWeight: "bold" }} />
                      <span>{ad?.ad?.user?.area || "غير محدد"}</span>
                    </div>
                    <div className="ciStopwatch">
                      <CiStopwatch style={{ color: "var(--main-color)", fontSize: "12px", fontWeight: "bold" }} />
                      <span>{timeSince(ad?.ad?.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="card_footer">
                  <h2 className="card_footer_price">{ad?.ad?.information?.price !== "0.00" ? ad?.ad?.information?.price : "غير محدد"}<span> ر.س</span></h2>

                  {/* <div className={`hart_icon ${loadingFavoriteId === `${ad?.category}_${ad?.ad?.id_ads}` ? "disabled" : ""}`} onClick={(e) => { e.stopPropagation(); if (isFavoriteLoading) return; toggleFavorite(e, ad?.category, ad?.ad?.id_ads); addToFavorites(ad?.category, ad?.ad?.id_ads) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill={ad?.ad?.is_favorited || favorites[`${ad?.category}_${ad?.ad?.id_ads}`] ? "red" : "none"} stroke={ad?.ad?.is_favorited || favorites[`${ad?.category}_${ad?.ad?.id_ads}`] ? "red" : "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart">
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                  </div> */}
                  <div className={`hart_icon ${loadingFavoriteId === `${ad?.category}_${ad?.ad?.id_ads}` ? "loading-heart" : ""}`}
                    onClick={(e) => handleFavoriteClick(e, ad?.category, ad?.ad?.id_ads)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" className="heart-svg" >
                      <defs>
                        <linearGradient id={`grad-${ad?.ad?.id_ads}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="red" stopOpacity="0" />
                          <stop offset="100%" stopColor="red" stopOpacity="1" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                        fill={
                          loadingFavoriteId === `${ad?.category}_${ad?.ad?.id_ads}`
                            ? `url(#grad-${ad?.ad?.id_ads})`
                            : ad?.ad?.is_favorited ||
                              favorites[`${ad?.category}_${ad?.ad?.id_ads}`]
                              ? "red"
                              : "none"
                        }
                        stroke={
                          ad?.ad?.is_favorited ||
                            favorites[`${ad?.category}_${ad?.ad?.id_ads}`]
                            ? "red"
                            : "currentColor"
                        }
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-ads">لا توجد إعلانات حالياً</p>
          )}
        </div>
      </div>
      <div className="favoritesToast">
        {showToast && (
          <ToastWarning
            message="قم بتسجيل الدخول أولاً"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </section>
  );
};
export default CarCard;