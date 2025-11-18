import React, { useEffect, useState } from "react";
import "./favoritesUser.css";
import { IoLocationOutline } from "react-icons/io5";
import { CiStopwatch } from "react-icons/ci";
import { useCookies } from "react-cookie";

const FavoritesUser = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies?.token?.data?.token;
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          "https://api.maaashi.com/api/favorites",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setFavorites(data.data);
        console.log("Response data:", data);

      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل البيانات.");
      }
    };

    if (token) fetchUserData();
  }, [token]);

  return (
    <div className="Favorites_user">
      <h2 className="Favorites_user_desc">
        <span className="Favorites_user_total">({favorites.length}) </span>
        اعلانات محفوظة
      </h2>
      <hr />

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="Favorites_user_item">
        {favorites.map((item) => (
          <div className="Favorites_user_card" key={item.id_ads}>
            {/* الصورة */}
            <div className="Favorites_user_item_picture">
              <img
                src={
                  item.images?.[0]
                    ? `https://api.maaashi.com/storage/${item.images[0]}`
                    : "/images/no-image.webp"
                }
                alt={item.information?.title || "إعلان"}
              />
            </div>

            {/* المحتوى */}
            <div className="Favorites_user_item_details">
              <h3 className="Favorites_user_title">
                {item.information?.title || "بدون عنوان"}
              </h3>

              <div className="Favorites_user_meta">
                <p>
                  <IoLocationOutline />{" "}
                  {item.user?.area || "غير محدد"}
                </p>
                <span>
                  <CiStopwatch />{" "}
                  {new Date(item.created_at).toLocaleDateString("ar-EG")}
                </span>
              </div>

              <p className="Favorites_user_price">
                السعر: {item.information?.price || 0} ر.س
              </p>
            </div>
          </div>
        ))}
      </div>

      {favorites.length > 3 && (
        <button className="Favorites_user_showMore">عرض المزيد...</button>
      )}
    </div>
  );
};

export default FavoritesUser;