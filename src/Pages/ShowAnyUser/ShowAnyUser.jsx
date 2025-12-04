import React, { useEffect, useState } from 'react';
import "./showAnyUserStyle.css";
import { useNavigate, useParams } from 'react-router-dom';
import { CiLocationOn } from 'react-icons/ci';
import SkeletonCard from '../../Components/SkeletonCard/SkeletonCard';
import NotFound from '../../Components/NotFound/NotFound';
import { useCookies } from 'react-cookie';
import { ToastWarning } from '../../Components/Header/Header';
import { parseAuthCookie } from '../../utils/auth';

export default function ShowAnyUser() {
    const { userID } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const [cookies] = useCookies(["token"]);
    const { token } = parseAuthCookie(cookies?.token);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://api.maaashi.com/api/user/${userID}`, {
                    method: "GET",
                });
                const data = await response.json();
                if (data.status) {
                    setUserData(data.data);
                    setErrorMessage("");
                } else {
                    setErrorMessage("فشل في تحميل بيانات المستخدم.");
                }
            } catch {
                setErrorMessage("حدث خطأ أثناء تحميل البيانات.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [userID]);

    // Favorite Handling
    const toggleFavorite = (adId) => {
        setFavorites((prev) => ({
            ...prev,
            [adId]: !prev[adId],
        }));
    };

    const addToFavorites = async (adId) => {
        try {
            setIsFavoriteLoading(true);
            const response = await fetch(`https://api.maaashi.com/api/favorites`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ad_id: adId }),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data?.message || "حدث خطأ أثناء الإضافة للمفضلة.");
            }
        } catch {
            setErrorMessage("فشل الاتصال بالسيرفر أثناء الإضافة.");
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleFavoriteClick = (e, adId) => {
        e.stopPropagation();
        if (!token) {
            setShowToast(true);
            return;
        }
        toggleFavorite(adId);
        addToFavorites(adId);
    };

    return (
        <section className="showAnyUserData">

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="loading_data">
                    <div className="isLoading">
                        {Array.from({ length: 8 }, (_, i) => (<SkeletonCard key={i} />))}
                    </div>
                </div>
            )}

            {/* Error */}
            {errorMessage && !isLoading && <NotFound />}

            {/* Main Content */}
            {!isLoading && !errorMessage && (
                <div className="showAnyUserData_container">

                    {/* User Data */}
                    <div className="user_data">
                        <div className="user_images">
                            <div className="cover_user_image">
                                <img
                                    src={userData?.cover_image || "/placeholder.png"}
                                    alt="صورة الكوفر"
                                    loading="lazy"
                                />
                            </div>

                            <div className="profile_user_image">
                                <div className="user_img_container">
                                    <img
                                        src={userData?.image_profile || "/placeholder-profile.png"}
                                        alt="img"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="user_info">
                            <p><strong>الاسم:</strong> {userData?.name || "غير محدد"}</p>
                            <p><strong>المنطقة:</strong> {userData?.area || "غير محدد"}</p>
                            <p><strong>المدينة:</strong> {userData?.city || "غير محدد"}</p>
                            <p><strong>العنوان:</strong> {userData?.location || "غير محدد"}</p>
                            <p><strong>رقم الهاتف:</strong> {userData?.phone || "غير محدد"}</p>
                        </div>
                    </div>

                    {/* Ads List */}
                    <div className="categories_items">
                        {userData?.ads?.map((ad) => (
                            <div
                                key={ad.id}
                                className="category_card"
                                onClick={() => navigate(`/${ad?.category?.id}/${ad.id}`)}
                            >
                                {/* Ad Image */}
                                <div className="card_image">
                                <img
                                    src={
                                        ad?.images?.length > 0
                                            ? ad.images[0] 
                                            : "/images/team.webp"
                                    }
                                    alt={ad?.title || "image"}
                                />
                                </div>

                                {/* User Info */}
                                        <div className="card_user">
                                            {userData?.image_profile ? (
                                                <img src={userData.image_profile} alt="user" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 20a6 6 0 0 0-12 0" />
                                                    <circle cx={12} cy={10} r={4} />
                                                    <circle cx={12} cy={12} r={10} />
                                                </svg>
                                            )}

                                            <span>{ad?.seller_name || userData?.name?.split(" ").slice(0, 2).join(" ")}</span>
                                        </div>

                                {/* Title + Location */}
                                <div className="card_body">
                                    <h3>{ad.title.substring(0, 18)}...</h3>
                                    <div className="card_meta">
                                        <div className="ciLocationOn">
                                            <CiLocationOn style={{ color: "var(--main-color)", fontSize: "12px" }} />
                                            <span>{ad?.user?.area || ad?.user?.city || "غير محدد"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price + Favorite */}
                                <div className="card_footer">
                                    <div className="card_footer_price">
                                        <span>{ad.price} ر.س</span>
                                    </div>

                                    <div className="hart_icon" onClick={(e) => handleFavoriteClick(e, ad.id)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={22}
                                            height={22}
                                            viewBox="0 0 24 24"
                                            fill={favorites[ad.id] ? "red" : "none"}
                                            stroke={favorites[ad.id] ? "red" : "currentColor"}
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {showToast && (
                <ToastWarning
                    message="قم بتسجيل الدخول أولاً"
                    onClose={() => setShowToast(false)}
                />
            )}
        </section>
    );
}
