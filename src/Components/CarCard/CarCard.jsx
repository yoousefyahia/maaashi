import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiLocationOn, CiStopwatch } from "react-icons/ci";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastWarning } from "../Header/Header";
import { parseAuthCookie } from "../../utils/auth";
import "./carCard.css";

const CarCard = () => {
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);
  const navigate = useNavigate();

  const [adsCard, setAdsCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState(null);

  // 1- Load featured ads
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get("https://api.maaashi.com/api/ads/featured");
        const ads = Array.isArray(res.data.ads) ? res.data.ads : [];
        setAdsCard(
          ads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      } catch {
        setError("حدث خطأ أثناء تحميل الإعلانات.");
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  // 2- Load favorites
  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("https://api.maaashi.com/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverFavIds = new Set(
          Array.isArray(res.data.ads)
            ? res.data.ads.map((item) => Number(item.id))
            : []
        );
        setFavorites(serverFavIds);
        localStorage.setItem("localFavorites", JSON.stringify([...serverFavIds]));
      } catch (err) {
        console.error("Server fetch failed:", err);
      }
    };
    fetchFavorites();
  }, [token]);

  // 3- Toggle favorite
  const handleFavoriteClick = (e, adId) => {
    e.stopPropagation();
    if (!token) {
      setShowToast(true);
      return;
    }

    const updatedFavorites = new Set(favorites);
    const isFavorite = favorites.has(adId);

    if (isFavorite) updatedFavorites.delete(adId);
    else updatedFavorites.add(adId);

    setFavorites(updatedFavorites);
    localStorage.setItem("localFavorites", JSON.stringify([...updatedFavorites]));

    setLoadingFavoriteId(adId);

    const url = isFavorite
      ? "https://api.maaashi.com/api/favorites/delete"
      : "https://api.maaashi.com/api/favorites";

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ad_id: adId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("فشل التحديث على السيرفر");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingFavoriteId(null));
  };

  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "منذ لحظات";
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} يوم`;
    return `منذ ${Math.floor(seconds / 604800)} أسبوع`;
  };

  if (loading) return <p>جارِ تحميل الإعلانات...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="car-card">
      <div className="car_card_container">
        <h2 className="section-title">اكتشف الجديد أولًا</h2>
        <div className="categories_items">
          {adsCard.length > 0 ? (
            adsCard.map((ad) => ( 
              <div
                key={ad.id}
                className="category_card"
                onClick={() => navigate(`/${ad.category_id}/${ad.id}`)}
              >
                {/* صورة الإعلان */}
                <div className="card_image">
                  <img src={ad.images?.[0] || "/placeholder.png"} alt={ad.title} />
                </div>

                {/* بيانات البائع */}
                <div
                  className="card_user"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${ad.seller_name}/${ad.user_id}`);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide-circle-user-round-icon"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx={12} cy={10} r={4} />
                    <circle cx={12} cy={12} r={10} />
                  </svg>
                  <span>{ad.seller_name}</span>
                </div>

                {/* بيانات الإعلان */}
                <div className="card_body">
                  <h2>{ad.title.substring(0, 18)}...</h2>
                  <div className="card_meta">
                    <div>
                      <CiLocationOn style={{ color: "var(--main-color)" }} />
                      <span>
                        {ad.user?.city || "غير محدد"}
                        {ad.user?.area ? ` / ${ad.user.area}` : ""}
                      </span>
                    </div>
                    <div>
                      <CiStopwatch style={{ color: "var(--main-color)" }} />
                      <span>{timeSince(ad.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* السعر + زر المفضلة */}
                <div className="card_footer">
                  <h2 className="card_footer_price">
                    {ad.price && ad.price !== "0.00" ? (
                      <>
                        {ad.price}<span> ر.س</span>
                      </>
                    ) : (
                      "السعر غير محدد"
                    )}
                  </h2>
                  <div
                    className={`hart_icon ${
                      loadingFavoriteId === ad.id ? "loading-heart" : ""
                    }`}
                    onClick={(e) => handleFavoriteClick(e, ad.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 24 24"
                      className="heart-svg"
                    >
                      <path
                        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                        fill={favorites.has(ad.id) ? "red" : "none"}
                        stroke={favorites.has(ad.id) ? "red" : "currentColor"}
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

      {showToast && (
        <ToastWarning
          message="قم بتسجيل الدخول أولاً"
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
};

export default CarCard;
