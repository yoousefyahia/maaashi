import React, { useEffect, useState } from "react";
import "./favoritesUser.css";
import { IoLocationOutline } from "react-icons/io5";
import { CiStopwatch } from "react-icons/ci";
import { useCookies } from "react-cookie";
import { parseAuthCookie } from "../../../utils/auth";

const FavoritesUser = () => {
  const [cookies] = useCookies(["token"]);
  const { token } = parseAuthCookie(cookies?.token);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch("https://api.maaashi.com/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const ads = Array.isArray(data.ads) ? data.ads : [];
        setFavorites(ads);
        localStorage.setItem(
          "localFavorites",
          JSON.stringify(ads.map((ad) => ad.id))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [token]);

  if (loading) return <p>جارِ تحميل المفضلة...</p>;

  return (
    <div className="Favorites_user">
      <h2 className="Favorites_user_desc">
        <span className="Favorites_user_total">({favorites.length})</span> اعلانات محفوظة
      </h2>

      <hr />

      <div className="Favorites_user_item">
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <div className="Favorites_user_card" key={item.id}>
              <div className="Favorites_user_item_picture">
                <img
                  src={item.images?.[0] || "/images/no-image.webp"}
                  alt={item.title}
                />
              </div>
              <div className="Favorites_user_item_details">
                <h3 className="Favorites_user_title">{item.title}</h3>
                <div className="Favorites_user_meta">
                  <p>
                    <IoLocationOutline /> {item.area || "غير محدد"}
                  </p>
                  <span>
                    <CiStopwatch /> {new Date(item.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="Favorites_user_price">السعر: {item.price} ر.س</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>لا توجد إعلانات محفوظة حالياً</p>
        )}
      </div>
    </div>
  );
};

export default FavoritesUser;
