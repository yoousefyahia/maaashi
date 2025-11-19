import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiLocationOn, CiStopwatch } from "react-icons/ci";
import "./carCard.css";
import { useCookies } from "react-cookie";
import { ToastWarning } from "../Header/Header";
import { parseAuthCookie } from "../../utils/auth";

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
        const res = await fetch("https://api.maaashi.com/api/ads/featured");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const ads = Array.isArray(data.ads) ? data.ads : [];
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

  // 2- Load favorites from server, use localStorage for UI instant feedback
  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const serverFavIds = new Set(
          Array.isArray(data.ads) ? data.ads.map((item) => Number(item.id)) : []
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
  const handleFavorite = (e, adId) => {
    e.stopPropagation();

    if (!token) {
      setShowToast(true);
      return;
    }

    const updatedFavorites = new Set(favorites);
    const isFavorite = favorites.has(adId);

    if (isFavorite) updatedFavorites.delete(adId);
    else updatedFavorites.add(adId);

    // Update UI immediately
    setFavorites(updatedFavorites);
    localStorage.setItem("localFavorites", JSON.stringify([...updatedFavorites]));

    const url = isFavorite
      ? "https://api.maaashi.com/api/favorites/delete"
      : "https://api.maaashi.com/api/favorites";

    setLoadingFavoriteId(adId);

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
                <div className="card_image">
                  <img src={ad.images?.[0] || "/placeholder.png"} alt={ad.title} />
                </div>

                <div className="card_body">
                  <h2>{ad.title.substring(0, 18)}...</h2>
                  <div className="card_meta">
                    <div>
                      <CiLocationOn style={{ color: "var(--main-color)" }} />
                      <span>{ad.area || "غير محدد"}</span>
                    </div>
                    <div>
                      <CiStopwatch style={{ color: "var(--main-color)" }} />
                      <span>{timeSince(ad.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="hart_icon"
                  onClick={(e) => handleFavorite(e, ad.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    className="heart-svg"
                  >
                    <path
                      d="M2 9.5a5.5 5.5 0 0 1 9.6-3.7.56.56 0 0 0 .8 0A5.5 5.5 0 0 1 22 9.5c0 2.3-1.5 4-3 5.5l-5.5 5.3a2 2 0 0 1-3 0L5 15C3.5 13.5 2 11.8 2 9.5"
                      fill={favorites.has(ad.id) ? "red" : "none"}
                      stroke={favorites.has(ad.id) ? "red" : "currentColor"}
                      strokeWidth="2"
                    />
                  </svg>
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
